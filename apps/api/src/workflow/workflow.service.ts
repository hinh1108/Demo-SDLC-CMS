import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DbService } from '../db/db.service';
import { problem } from '../common/problem';
import { ApprovalResult, DecideApprovalDto } from './dto/decide-approval.dto';

@Injectable()
export class WorkflowService {
  private logger = new Logger('Workflow');
  constructor(private db: DbService) {}

  /** Đảm bảo content có version để gắn approval (BR-01: snapshot khi submit nếu chưa có). */
  private async ensureVersion(c: PoolClient, tenantId: string, content: any, userId: string) {
    if (content.current_version_id) return content.current_version_id;
    const v = await c.query(
      `INSERT INTO content_version (tenant_id, content_id, blocks, author_id)
       VALUES ($1, $2, '[]'::jsonb, $3) RETURNING id`,
      [tenantId, content.id, userId],
    );
    await c.query('UPDATE content SET current_version_id = $1 WHERE id = $2', [v.rows[0].id, content.id]);
    return v.rows[0].id;
  }

  private async loadContent(c: PoolClient, id: string) {
    const { rows } = await c.query(
      'SELECT id, status, current_version_id FROM content WHERE id = $1',
      [id], // RLS đảm bảo chỉ content thuộc tenant hiện tại
    );
    if (!rows[0]) throw problem(404, 'not-found', 'Not Found', 'Không tìm thấy nội dung.');
    return rows[0];
  }

  /** US-05 — Gửi duyệt. */
  async submit(tenantId: string, contentId: string, userId: string) {
    return this.db.withTenant(tenantId, async (c) => {
      const content = await this.loadContent(c, contentId);
      if (content.status !== 'draft') {
        throw problem(409, 'invalid-state', 'Invalid State', 'Chỉ nội dung bản nháp mới gửi duyệt được.');
      }
      // BR-04: site/tenant phải có người duyệt (manager/admin) đang hoạt động
      const appr = await c.query(
        `SELECT count(*)::int AS n FROM app_user u JOIN role r ON r.id = u.role_id
         WHERE r.name IN ('manager','admin') AND u.status = 'active'`,
      );
      if (appr.rows[0].n === 0) {
        throw problem(409, 'approver-not-configured', 'Approver Not Configured',
          'Chưa có người duyệt. Admin cần thiết lập.');
      }
      await this.ensureVersion(c, tenantId, content, userId);
      await c.query("UPDATE content SET status = 'review' WHERE id = $1", [contentId]);
      this.logger.log(`submit content=${contentId} by=${userId} tenant=${tenantId} → review, notify approvers`);
      return { id: contentId, status: 'review' };
    });
  }

  /** US-06 — Hàng chờ duyệt của tenant. */
  async queue(tenantId: string, limit = 20) {
    return this.db.withTenant(tenantId, async (c) => {
      const { rows } = await c.query(
        `SELECT id, kind, title, slug, status, seo_score, updated_at
         FROM content WHERE status = 'review'
         ORDER BY updated_at DESC LIMIT $1`,
        [limit],
      );
      return { data: rows };
    });
  }

  /** US-06 — Duyệt/từ chối (RBAC manager/admin đã enforce ở guard). */
  async decide(tenantId: string, contentId: string, userId: string, dto: DecideApprovalDto) {
    if (dto.result === ApprovalResult.rejected && !dto.note?.trim()) {
      throw problem(422, 'validation-error', 'Validation Error', 'Cần ghi chú khi từ chối.');
    }
    return this.db.withTenant(tenantId, async (c) => {
      const content = await this.loadContent(c, contentId);
      if (content.status !== 'review') {
        throw problem(409, 'invalid-state', 'Invalid State', 'Nội dung không ở trạng thái chờ duyệt.');
      }
      const versionId = await this.ensureVersion(c, tenantId, content, userId);
      const ins = await c.query(
        `INSERT INTO approval (tenant_id, version_id, approver_id, result, note)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, result, note, created_at`,
        [tenantId, versionId, userId, dto.result, dto.note ?? null],
      );
      const newStatus = dto.result === ApprovalResult.approved ? 'approved' : 'draft';
      await c.query('UPDATE content SET status = $1 WHERE id = $2', [newStatus, contentId]);
      this.logger.log(`decide content=${contentId} result=${dto.result} by=${userId} → ${newStatus}, notify editor`);
      return { approval: ins.rows[0], content_status: newStatus };
    });
  }

  /** US-06 — Lịch sử duyệt của một content. */
  async history(tenantId: string, contentId: string) {
    return this.db.withTenant(tenantId, async (c) => {
      const { rows } = await c.query(
        `SELECT a.id, a.result, a.note, a.approver_id, a.created_at
         FROM approval a JOIN content_version cv ON cv.id = a.version_id
         WHERE cv.content_id = $1
         ORDER BY a.created_at DESC`,
        [contentId],
      );
      return rows;
    });
  }
}
