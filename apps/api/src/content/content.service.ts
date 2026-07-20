import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DbService } from '../db/db.service';
import { problem } from '../common/problem';
import { ListContentsQuery } from './dto/list-contents.query';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { validateBlocks, slugify } from './blocks.util';

@Injectable()
export class ContentService {
  private logger = new Logger('Content');
  constructor(private db: DbService) {}

  async list(tenantId: string, siteId: string, q: ListContentsQuery) {
    return this.db.withTenant(tenantId, async (c) => {
      const limit = q.limit ?? 20;
      const sql = `
        SELECT id, kind, title, slug, status, seo_score, updated_at
        FROM content
        WHERE site_id = $1
          AND ($2::content_status IS NULL OR status = $2::content_status)
          AND ($3::timestamptz IS NULL OR updated_at < $3::timestamptz)
        ORDER BY updated_at DESC
        LIMIT $4`;
      const { rows } = await c.query(sql, [siteId, q.status ?? null, q.cursor ?? null, limit + 1]);
      const hasMore = rows.length > limit;
      const page = rows.slice(0, limit);
      const data = page.map((r) => ({
        id: r.id, kind: r.kind, title: r.title, slug: r.slug,
        status: r.status, seo_score: r.seo_score, updated_at: r.updated_at,
      }));
      const next_cursor = hasMore ? page[page.length - 1].updated_at.toISOString() : null;
      return { data, pagination: { next_cursor, has_more: hasMore } };
    });
  }

  /** US-01 — Tạo content (draft). BR-02 slug unique trong site. */
  async create(tenantId: string, siteId: string, userId: string, dto: CreateContentDto) {
    return this.db.withTenant(tenantId, async (c) => {
      // Site phải thuộc tenant (RLS trên site) — chống tạo content trỏ site tenant khác
      const site = await c.query('SELECT id FROM site WHERE id = $1', [siteId]);
      if (!site.rows[0]) throw problem(404, 'not-found', 'Not Found', 'Không tìm thấy site.');

      const slug = dto.slug || slugify(dto.title);
      const dup = await c.query('SELECT 1 FROM content WHERE site_id = $1 AND slug = $2', [siteId, slug]);
      if (dup.rows[0]) {
        const cnt = await c.query('SELECT count(*)::int n FROM content WHERE site_id = $1 AND slug LIKE $2', [siteId, slug + '%']);
        const suggestion = `${slug}-${cnt.rows[0].n + 1}`;
        throw problem(409, 'slug-conflict', 'Slug conflict', 'Đường dẫn đã tồn tại trong site.',
          [{ field: 'slug', message: `Thử: ${suggestion}` }]);
      }
      const ins = await c.query(
        `INSERT INTO content (tenant_id, site_id, kind, title, slug, status, author_id)
         VALUES ($1, $2, $3, $4, $5, 'draft', $6)
         RETURNING id, kind, title, slug, status, seo_score, updated_at`,
        [tenantId, siteId, dto.kind, dto.title, slug, userId],
      );
      this.logger.log(`create content=${ins.rows[0].id} site=${siteId} by=${userId} tenant=${tenantId}`);
      return ins.rows[0];
    });
  }

  private async loadContent(c: PoolClient, id: string) {
    const { rows } = await c.query(
      'SELECT id, site_id, kind, title, slug, status, seo_score, current_version_id, updated_at FROM content WHERE id = $1',
      [id],
    );
    if (!rows[0]) throw problem(404, 'not-found', 'Not Found', 'Không tìm thấy nội dung.');
    return rows[0];
  }

  /** US-01 — Chi tiết content + phiên bản hiện tại. */
  async get(tenantId: string, id: string) {
    return this.db.withTenant(tenantId, async (c) => {
      const content = await this.loadContent(c, id);
      let current_version = null;
      if (content.current_version_id) {
        const v = await c.query('SELECT id, blocks, created_at FROM content_version WHERE id = $1', [content.current_version_id]);
        current_version = v.rows[0] ?? null;
      }
      return {
        id: content.id, kind: content.kind, title: content.title, slug: content.slug,
        status: content.status, seo_score: content.seo_score, updated_at: content.updated_at,
        current_version,
      };
    });
  }

  /** US-01 — Sửa title/slug (409 slug-conflict). */
  async update(tenantId: string, id: string, dto: UpdateContentDto) {
    return this.db.withTenant(tenantId, async (c) => {
      const content = await this.loadContent(c, id);
      if (dto.slug && dto.slug !== content.slug) {
        const dup = await c.query('SELECT 1 FROM content WHERE site_id = $1 AND slug = $2 AND id <> $3',
          [content.site_id, dto.slug, id]);
        if (dup.rows[0]) throw problem(409, 'slug-conflict', 'Slug conflict', 'Đường dẫn đã tồn tại trong site.');
      }
      const title = dto.title ?? content.title;
      const slug = dto.slug ?? content.slug;
      const upd = await c.query(
        `UPDATE content SET title = $1, slug = $2 WHERE id = $3
         RETURNING id, kind, title, slug, status, seo_score, updated_at`,
        [title, slug, id],
      );
      return upd.rows[0];
    });
  }

  /** US-01 — Lưu (autosave) → tạo content_version mới (BR-01). */
  async saveVersion(tenantId: string, id: string, userId: string, blocks: unknown[]) {
    validateBlocks(blocks); // validate sâu trước khi vào DB
    return this.db.withTenant(tenantId, async (c) => {
      await this.loadContent(c, id); // 404 nếu không thuộc tenant
      const ins = await c.query(
        `INSERT INTO content_version (tenant_id, content_id, blocks, author_id)
         VALUES ($1, $2, $3::jsonb, $4)
         RETURNING id, content_id, created_at`,
        [tenantId, id, JSON.stringify(blocks), userId],
      );
      await c.query('UPDATE content SET current_version_id = $1 WHERE id = $2', [ins.rows[0].id, id]);
      this.logger.log(`save version=${ins.rows[0].id} content=${id} by=${userId}`);
      return ins.rows[0];
    });
  }

  /** US-01 — Lịch sử phiên bản. */
  async listVersions(tenantId: string, id: string, limit = 20) {
    return this.db.withTenant(tenantId, async (c) => {
      await this.loadContent(c, id);
      const { rows } = await c.query(
        `SELECT id, author_id, created_at FROM content_version
         WHERE content_id = $1 ORDER BY created_at DESC LIMIT $2`,
        [id, limit],
      );
      return { data: rows };
    });
  }

  /** US-01 — Xem một phiên bản. */
  async getVersion(tenantId: string, versionId: string) {
    return this.db.withTenant(tenantId, async (c) => {
      const { rows } = await c.query(
        'SELECT id, content_id, blocks, author_id, created_at FROM content_version WHERE id = $1',
        [versionId],
      );
      if (!rows[0]) throw problem(404, 'not-found', 'Not Found', 'Không tìm thấy phiên bản.');
      return rows[0];
    });
  }
}
