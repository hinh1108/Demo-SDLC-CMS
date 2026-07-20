import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DbService } from '../db/db.service';
import { problem } from '../common/problem';
import { PublishDto } from './dto/publish.dto';

// Trạng thái được phép publish (BR-05): approved, hoặc published (idempotent re-publish)
const PUBLISHABLE = new Set(['approved', 'published']);

@Injectable()
export class PublishingService {
  private logger = new Logger('Publishing');
  constructor(private db: DbService) {}

  private async loadContent(c: PoolClient, id: string) {
    const { rows } = await c.query(
      'SELECT id, site_id, slug, status, current_version_id FROM content WHERE id = $1',
      [id],
    );
    if (!rows[0]) throw problem(404, 'not-found', 'Not Found', 'Không tìm thấy nội dung.');
    return rows[0];
  }

  private async resolveUrl(c: PoolClient, siteId: string, slug: string) {
    const d = await c.query(
      "SELECT domain FROM domain WHERE site_id = $1 AND status = 'active' LIMIT 1",
      [siteId],
    );
    const domain = d.rows[0]?.domain as string | undefined;
    const host = domain ?? `${siteId}.vietcms.site`; // BR-06: subdomain tạm khi chưa có domain active
    return { public_url: `https://${host}/${slug}`, used_temp_subdomain: !domain };
  }

  /** US-14 — Xuất bản ngay hoặc lên lịch. Trả {status, ...}; controller set 200/202. */
  async publish(tenantId: string, contentId: string, userId: string, dto: PublishDto) {
    // Validate lịch trước khi vào DB
    let when: Date | null = null;
    if (dto.scheduled_at) {
      when = new Date(dto.scheduled_at);
      if (isNaN(when.getTime())) throw problem(422, 'validation-error', 'Validation Error', 'scheduled_at không hợp lệ.');
      if (when.getTime() <= Date.now()) throw problem(422, 'validation-error', 'Validation Error', 'Thời điểm lên lịch phải ở tương lai.');
    }

    return this.db.withTenant(tenantId, async (c) => {
      const content = await this.loadContent(c, contentId);
      // BR-05 — chỉ approved/published mới publish được
      if (!PUBLISHABLE.has(content.status)) {
        throw problem(409, 'not-approved', 'Content not approved', 'Chỉ nội dung Đã duyệt mới được xuất bản.');
      }
      const { public_url, used_temp_subdomain } = await this.resolveUrl(c, content.site_id, content.slug);

      if (when) {
        // Lên lịch
        await c.query(
          `INSERT INTO publish_job (tenant_id, content_id, run_at, status) VALUES ($1, $2, $3, 'queued')`,
          [tenantId, contentId, when.toISOString()],
        );
        await c.query("UPDATE content SET status = 'scheduled', scheduled_at = $1 WHERE id = $2",
          [when.toISOString(), contentId]);
        this.logger.log(`schedule content=${contentId} at=${when.toISOString()} by=${userId}`);
        return { scheduled: true, status: 'scheduled', scheduled_at: when.toISOString(), public_url, used_temp_subdomain };
      }

      // Xuất bản ngay — snapshot version approved, ghi published_at + url.
      // (Render SSR/static + đẩy CDN + cập nhật sitemap = external/job — ADR-004; ở đây log bước đó)
      await c.query(
        `UPDATE content SET status = 'published', published_version_id = current_version_id,
           published_at = now(), public_url = $1 WHERE id = $2`,
        [public_url, contentId],
      );
      this.logger.log(`publish content=${contentId} url=${public_url} by=${userId} → render+CDN+sitemap`);
      return { scheduled: false, status: 'published', public_url, used_temp_subdomain };
    });
  }

  /** US-14 — Gỡ xuất bản → draft, loại khỏi sitemap. */
  async unpublish(tenantId: string, contentId: string, userId: string) {
    return this.db.withTenant(tenantId, async (c) => {
      const content = await this.loadContent(c, contentId);
      if (content.status !== 'published' && content.status !== 'scheduled') {
        throw problem(409, 'invalid-state', 'Invalid State', 'Nội dung chưa xuất bản/lên lịch.');
      }
      await c.query(
        `UPDATE content SET status = 'draft', published_version_id = NULL, published_at = NULL, public_url = NULL
         WHERE id = $1`, [contentId]);
      await c.query("DELETE FROM publish_job WHERE content_id = $1 AND status = 'queued'", [contentId]);
      this.logger.log(`unpublish content=${contentId} by=${userId}`);
    });
  }

  /** US-14 — Sitemap: URL đã xuất bản của site (tenant-scoped). */
  async sitemap(tenantId: string, siteId: string) {
    return this.db.withTenant(tenantId, async (c) => {
      const { rows } = await c.query(
        `SELECT slug, public_url, published_at FROM content
         WHERE site_id = $1 AND status = 'published'
         ORDER BY published_at DESC`,
        [siteId],
      );
      return { site_id: siteId, urls: rows };
    });
  }
}
