// e2e US-01 — Editor + versioning. Cần seed mới.
const BASE = process.env.API_URL || 'http://localhost:3001/v1';
const SITE_A = 'aaaaaaaa-0000-0000-0000-000000000001';
const SITE_B = 'bbbbbbbb-0000-0000-0000-000000000001';

let pass = 0, fail = 0;
const check = (n, c, x = '') => c ? (console.log(`  ✅ ${n}`), pass++) : (console.log(`  ❌ ${n} ${x}`), fail++);
async function req(method, path, token, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}
const login = async (email) => (await req('POST', '/auth/login', null, { email, password: 'Password123!' })).body?.access_token;

console.log('=== VietCMS e2e — Editor + versioning (US-01) ===');
const ngoc = await login('ngoc@a.vn');
const edB = await login('ed@b.vn');

// Create
const cre = await req('POST', `/sites/${SITE_A}/contents`, ngoc, { kind: 'post', title: 'Bài mới của Ngọc' });
check('create → 201 draft + slugify tiếng Việt', cre.status === 201 && cre.body?.status === 'draft' && cre.body?.slug === 'bai-moi-cua-ngoc', `(status ${cre.status}, slug ${cre.body?.slug})`);
const id = cre.body?.id;

// Duplicate slug
const dup = await req('POST', `/sites/${SITE_A}/contents`, ngoc, { kind: 'post', title: 'Bài mới của Ngọc' });
check('slug trùng → 409 slug-conflict + gợi ý', dup.status === 409 && dup.body?.type?.includes('slug-conflict') && Array.isArray(dup.body?.errors), `(status ${dup.status})`);

// Save version (valid nested blocks)
const sv = await req('POST', `/contents/${id}/versions`, ngoc, { blocks: [{ type: 'heading' }, { type: 'paragraph', children: [{ type: 'paragraph' }] }] });
check('save version → 201 (BR-01)', sv.status === 201 && !!sv.body?.id, `(status ${sv.status})`);

// Invalid block type → 422
const bad = await req('POST', `/contents/${id}/versions`, ngoc, { blocks: [{ type: 'evil-script' }] });
check('block type lạ → 422 validation', bad.status === 422 && bad.body?.type?.includes('validation-error'), `(status ${bad.status})`);

// blocks không phải mảng → 400 (DTO @IsArray) hoặc 422
const bad2 = await req('POST', `/contents/${id}/versions`, ngoc, { blocks: 'notarray' });
check('blocks không phải mảng → 400/422', bad2.status === 400 || bad2.status === 422, `(status ${bad2.status})`);

// List versions
const vs = await req('GET', `/contents/${id}/versions`, ngoc);
check('list versions ≥ 1', vs.status === 200 && vs.body?.data?.length >= 1, `(len ${vs.body?.data?.length})`);

// Get content detail có current_version
const det = await req('GET', `/contents/${id}`, ngoc);
check('get content có current_version (2 blocks)', det.status === 200 && det.body?.current_version?.blocks?.length === 2, `(blocks ${det.body?.current_version?.blocks?.length})`);
check('get content KHÔNG lộ tenant_id/site_id', det.status === 200 && !('tenant_id' in det.body) && !('site_id' in det.body));

// Patch slug
const pat = await req('PATCH', `/contents/${id}`, ngoc, { slug: 'duong-dan-moi' });
check('patch slug → 200', pat.status === 200 && pat.body?.slug === 'duong-dan-moi', `(status ${pat.status})`);

// Patch to existing seed slug
const patDup = await req('PATCH', `/contents/${id}`, ngoc, { slug: 'ra-mat-vietcms' });
check('patch sang slug đã tồn tại → 409', patDup.status === 409, `(status ${patDup.status})`);

// Create on site of ANOTHER tenant (ngoc A → site B) → 404 (site RLS)
const wrongSite = await req('POST', `/sites/${SITE_B}/contents`, ngoc, { kind: 'post', title: 'Chèn site B' });
check('tạo content trên site tenant khác → 404', wrongSite.status === 404, `(status ${wrongSite.status})`);

// Cross-tenant get: ed (B) đọc content của A → 404
const cross = await req('GET', `/contents/${id}`, edB);
check('cross-tenant get content → 404 (RLS)', cross.status === 404, `(status ${cross.status})`);

// Invalid slug format on create → 400
const badSlug = await req('POST', `/sites/${SITE_A}/contents`, ngoc, { kind: 'post', title: 'X', slug: 'Bad Slug!' });
check('slug sai format → 400 validation', badSlug.status === 400, `(status ${badSlug.status})`);

console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`);
process.exit(fail === 0 ? 0 : 1);
