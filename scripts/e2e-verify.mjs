// e2e verify — chạy các acceptance criteria bảo mật với API đang chạy.
// Dùng fetch built-in (Node 18+). Không cần dependency.
const BASE = process.env.API_URL || 'http://localhost:3001/v1';
const SITE_A = 'aaaaaaaa-0000-0000-0000-000000000001';

let pass = 0, fail = 0;
function check(name, cond, extra = '') {
  if (cond) { console.log(`  ✅ ${name}`); pass++; }
  else { console.log(`  ❌ ${name} ${extra}`); fail++; }
}
async function post(path, body, token) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}
async function get(path, token) {
  const res = await fetch(BASE + path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  return { status: res.status, body: await res.json().catch(() => null) };
}

console.log('=== VietCMS e2e security verification ===');

// AC1 — login tenant A
const a = await post('/auth/login', { email: 'ngoc@a.vn', password: 'Password123!' });
check('AC1 login đúng → 200 + access_token', a.status === 200 && !!a.body?.access_token, `(status ${a.status})`);
const tokenA = a.body?.access_token;

// AC2 — sai mật khẩu → 401 chung
const bad = await post('/auth/login', { email: 'ngoc@a.vn', password: 'wrong' });
check('AC2 sai mật khẩu → 401 problem+json', bad.status === 401 && bad.body?.type?.includes('unauthorized'), `(status ${bad.status})`);
check('AC2 thông báo CHUNG (không lộ user tồn tại)', bad.body?.detail === 'Email hoặc mật khẩu không đúng.');

// AC3 — list content tenant A
const listA = await get(`/sites/${SITE_A}/contents`, tokenA);
check('AC3 list content (JWT A) → 200', listA.status === 200, `(status ${listA.status})`);
check('AC3 chỉ trả content tenant A (4 rows seed)', Array.isArray(listA.body?.data) && listA.body.data.length === 4, `(got ${listA.body?.data?.length})`);
check('AC3 KHÔNG lộ field nhạy cảm', listA.body?.data?.every(c => !('password_hash' in c) && !('tenant_id' in c)) ?? false);

// AC3 filter status
const pub = await get(`/sites/${SITE_A}/contents?status=published`, tokenA);
check('AC3 filter status=published (2 rows)', pub.body?.data?.length === 2, `(got ${pub.body?.data?.length})`);

// AC4 — no token → 401
const noTok = await get(`/sites/${SITE_A}/contents`);
check('AC4 không token → 401', noTok.status === 401, `(status ${noTok.status})`);

// AC5 — tenant B token can't see tenant A site (RLS)
const b = await post('/auth/login', { email: 'ed@b.vn', password: 'Password123!' });
const tokenB = b.body?.access_token;
const cross = await get(`/sites/${SITE_A}/contents`, tokenB);
check('AC5 JWT tenant B xem site A → 0 rows (RLS cô lập)', cross.status === 200 && cross.body?.data?.length === 0, `(got ${cross.body?.data?.length})`);

// Validation — bad uuid
const badUuid = await get('/sites/not-a-uuid/contents', tokenA);
check('Validation: siteId sai UUID → 400', badUuid.status === 400, `(status ${badUuid.status})`);

console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`);
process.exit(fail === 0 ? 0 : 1);
