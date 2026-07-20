import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { config } from '../config';

@Injectable()
export class DbService implements OnModuleDestroy {
  // Kết nối bằng role app_login (non-superuser) → RLS được thực thi.
  private pool = new Pool({ connectionString: config.databaseUrl, max: 10 });

  /** Tra user lúc đăng nhập (chưa biết tenant) — qua hàm SECURITY DEFINER, bypass RLS. */
  async authLookup(email: string) {
    const { rows } = await this.pool.query(
      'SELECT id, tenant_id, role_name, password_hash, status FROM auth_lookup($1)',
      [email], // tham số hoá — không nối chuỗi SQL
    );
    return rows[0] ?? null;
  }

  /** Chạy fn trong transaction có SET LOCAL app.current_tenant → RLS lọc theo tenant. */
  async withTenant<T>(tenantId: string, fn: (c: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // set_config(..., true) = SET LOCAL (chỉ trong transaction) → an toàn với pooling
      await client.query("SELECT set_config('app.current_tenant', $1, true)", [tenantId]);
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Query KHÔNG có tenant scope — CHỈ dùng cho hàm SECURITY DEFINER / dữ liệu công khai
   * (vd public_sitemap). Không dùng cho dữ liệu nhạy cảm.
   */
  async queryUnscoped<T = any>(text: string, params?: any[]): Promise<T[]> {
    const { rows } = await this.pool.query(text, params);
    return rows as T[];
  }

  /** Readiness probe — kiểm tra kết nối DB. */
  async ping(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
