// Seed dữ liệu demo — chạy quyền 'postgres' (superuser, bypass RLS) để nạp 2 tenant.
import pg from 'pg';
import bcrypt from 'bcryptjs';

const ADMIN_URL = process.env.ADMIN_DATABASE_URL
  || 'postgres://postgres:pw@localhost:55432/vietcms';

const A = '11111111-1111-1111-1111-111111111111';
const B = '22222222-2222-2222-2222-222222222222';
const SITE_A = 'aaaaaaaa-0000-0000-0000-000000000001';
const SITE_B = 'bbbbbbbb-0000-0000-0000-000000000001';
const R_EDITOR = '99999999-0000-0000-0000-000000000003';
const R_MANAGER = '99999999-0000-0000-0000-000000000002';
const R_CONTRIB = '99999999-0000-0000-0000-000000000004';

const client = new pg.Client({ connectionString: ADMIN_URL });
await client.connect();

const hash = await bcrypt.hash('Password123!', 10);

await client.query('BEGIN');
try {
  await client.query(
    `INSERT INTO role (id,name) VALUES ($1,'manager'),($2,'editor'),($3,'contributor')
     ON CONFLICT (name) DO NOTHING`, [R_MANAGER, R_EDITOR, R_CONTRIB]);

  await client.query(
    `INSERT INTO tenant (id,name) VALUES ($1,'Tenant A'),($2,'Tenant B')`, [A, B]);

  await client.query(
    `INSERT INTO app_user (tenant_id,email,name,role_id,status,password_hash) VALUES
       ($1,'ngoc@a.vn','Ngoc',$3,'active',$5),
       ($1,'hai@a.vn','Hai',$4,'active',$5),
       ($1,'cont@a.vn','Cong tac vien',$6,'active',$5),
       ($2,'ed@b.vn','Ed B',$3,'active',$5)`,
    [A, B, R_EDITOR, R_MANAGER, hash, R_CONTRIB]);

  await client.query(
    `INSERT INTO site (id,tenant_id,name) VALUES ($1,$3,'Site A1'),($2,$4,'Site B1')`,
    [SITE_A, SITE_B, A, B]);

  // Content tenant A (site A) — nhiều trạng thái
  await client.query(
    `INSERT INTO content (tenant_id,site_id,kind,title,slug,status) VALUES
      ($1,$2,'post','Ra mat VietCMS 1.0','ra-mat-vietcms','published'),
      ($1,$2,'post','Huong dan SEO cho nguoi moi','huong-dan-seo','review'),
      ($1,$2,'post','5 meo toi uu toc do tai','toi-uu-toc-do','draft'),
      ($1,$2,'page','Chinh sach noi dung','chinh-sach','published')`,
    [A, SITE_A]);

  // Content tenant B (site B) — KHÔNG được lộ cho tenant A.
  // Tenant B KHÔNG có manager/admin → dùng để test BR-04 (no approver) khi submit draft.
  await client.query(
    `INSERT INTO content (tenant_id,site_id,kind,title,slug,status) VALUES
      ($1,$2,'post','Bai viet bi mat cua B','secret-b','published'),
      ($1,$2,'post','Nhap cua B','nhap-b','draft')`,
    [B, SITE_B]);

  await client.query('COMMIT');
  console.log('✅ Seed done.');
  console.log('   Users: ngoc@a.vn (editor,A), hai@a.vn (manager,A), ed@b.vn (editor,B) — pass: Password123!');
  console.log('   Site A:', SITE_A, ' Site B:', SITE_B);
} catch (e) {
  await client.query('ROLLBACK');
  console.error('Seed failed:', e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
