import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ListContentsQuery } from './dto/list-contents.query';

@Injectable()
export class ContentService {
  constructor(private db: DbService) {}

  async list(tenantId: string, siteId: string, q: ListContentsQuery) {
    return this.db.withTenant(tenantId, async (c) => {
      const limit = q.limit ?? 20;
      // Tất cả tham số hoá ($1..$4). RLS tự thêm điều kiện tenant_id = current tenant.
      const sql = `
        SELECT id, kind, title, slug, status, seo_score, updated_at
        FROM content
        WHERE site_id = $1
          AND ($2::content_status IS NULL OR status = $2::content_status)
          AND ($3::timestamptz IS NULL OR updated_at < $3::timestamptz)
        ORDER BY updated_at DESC
        LIMIT $4`;
      const { rows } = await c.query(sql, [
        siteId,
        q.status ?? null,
        q.cursor ?? null,
        limit + 1, // lấy dư 1 để biết has_more
      ]);

      const hasMore = rows.length > limit;
      const page = rows.slice(0, limit);
      // Response schema TƯỜNG MINH — không trả field nhạy cảm/nội bộ
      const data = page.map((r) => ({
        id: r.id,
        kind: r.kind,
        title: r.title,
        slug: r.slug,
        status: r.status,
        seo_score: r.seo_score,
        updated_at: r.updated_at,
      }));
      const next_cursor = hasMore ? page[page.length - 1].updated_at.toISOString() : null;
      return { data, pagination: { next_cursor, has_more: hasMore } };
    });
  }
}
