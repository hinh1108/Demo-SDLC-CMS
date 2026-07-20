import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DbService } from '../db/db.service';
import { problem } from '../common/problem';
import { PutSeoDto } from './dto/put-seo.dto';
import { computeSeoScore, xmlEscape } from './seo.util';

@Injectable()
export class SeoService {
  private logger = new Logger('SEO');
  constructor(private db: DbService) {}

  private async assertContent(c: PoolClient, id: string) {
    const { rows } = await c.query('SELECT id FROM content WHERE id = $1', [id]);
    if (!rows[0]) throw problem(404, 'not-found', 'Not Found', 'Không tìm thấy nội dung.');
  }

  async getSeo(tenantId: string, contentId: string) {
    return this.db.withTenant(tenantId, async (c) => {
      await this.assertContent(c, contentId);
      const { rows } = await c.query(
        'SELECT title, description, keywords, schema_json, score FROM seo_meta WHERE content_id = $1',
        [contentId],
      );
      return rows[0] ?? { title: null, description: null, keywords: null, schema_json: null, score: null };
    });
  }

  async putSeo(tenantId: string, contentId: string, userId: string, dto: PutSeoDto) {
    const score = computeSeoScore(dto);
    return this.db.withTenant(tenantId, async (c) => {
      await this.assertContent(c, contentId);
      const { rows } = await c.query(
        `INSERT INTO seo_meta (tenant_id, content_id, title, description, keywords, schema_json, score)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
         ON CONFLICT (content_id) DO UPDATE
           SET title = EXCLUDED.title, description = EXCLUDED.description,
               keywords = EXCLUDED.keywords, schema_json = EXCLUDED.schema_json, score = EXCLUDED.score
         RETURNING title, description, keywords, schema_json, score`,
        [tenantId, contentId, dto.title ?? null, dto.description ?? null, dto.keywords ?? null,
          dto.schema_json ? JSON.stringify(dto.schema_json) : null, score],
      );
      // Đồng bộ điểm SEO hiển thị trên content
      await c.query('UPDATE content SET seo_score = $1 WHERE id = $2', [score, contentId]);
      this.logger.log(`seo updated content=${contentId} score=${score} by=${userId}`);
      return rows[0];
    });
  }

  /** sitemap.xml công khai — qua hàm SECURITY DEFINER (chỉ nội dung published). */
  async sitemapXml(siteId: string): Promise<string> {
    const rows = await this.db.queryUnscoped<{ slug: string; public_url: string; published_at: Date }>(
      'SELECT slug, public_url, published_at FROM public_sitemap($1)', [siteId],
    );
    const urls = rows
      .filter((r) => r.public_url)
      .map((r) => {
        const lastmod = r.published_at ? new Date(r.published_at).toISOString() : '';
        return `  <url><loc>${xmlEscape(r.public_url)}</loc>` +
          (lastmod ? `<lastmod>${xmlEscape(lastmod)}</lastmod>` : '') + `</url>`;
      })
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  }
}
