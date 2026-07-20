// e2e US-14 — Publishing. Cần seed mới (có contributor cont@a.vn).
const BASE = process.env.API_URL || 'http://localhost:3001/v1';
const SITE_A = 'aaaaaaaa-0000-0000-0000-000000000001';

let pass = 0, fail = 0;
const check = (n, c, x = '') => c ? (console.log(`  ✅ ${n}`), pass++) : (console.log(`  ❌ ${n} ${x}`), fail++);
async function req(method, path, token, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}
const login = async (email) => (await req('POST', '/auth/login', null, { email, password: 'Password123!' })).body?.access_token;

console.log('=== VietCMS e2e — Publishing (US-14) ===');
const ngoc = await login('ngoc@a.vn'); // editor A
const hai = await login('hai@a.vn');   // manager A
const cont = await login('cont@a.vn'); // contributor A
const edB = await login('ed@b.vn');    // editor B

// Dựng 1 nội dung approved: create → save version → submit → approve
async function makeApproved(title, slug) {
  const c = await req('POST', `/sites/${SITE_A}/contents`, ngoc, { kind: 'post', title, slug });
  await req('POST', `/contents/${c.body.id}/versions`, ngoc, { blocks: [{ type: 'heading' }, { type: 'paragraph' }] });
  await req('POST', `/contents/${c.body.id}/submission`, ngoc);
  await req('POST', `/contents/${c.body.id}/approvals`, hai, { result: 'approved' });
  return c.body.id;
}
const id = await makeApproved('Bai xuat ban', 'bai-xuat-ban');

// BR-05: publish một draft → 409 not-approved
const draftC = await req('POST', `/sites/${SITE_A}/contents`, ngoc, { kind: 'post', title: 'Con nhap', slug: 'con-nhap' });
const pubDraft = await req('POST', `/contents/${draftC.body.id}/publication`, ngoc);
check('BR-05 publish draft → 409 not-approved', pubDraft.status === 409 && pubDraft.body?.type?.includes('not-approved'), `(status ${pubDraft.status})`);

// RBAC: contributor publish → 403 (trước cả state check)
const pubContrib = await req('POST', `/contents/${id}/publication`, cont);
check('RBAC contributor publish → 403', pubContrib.status === 403, `(status ${pubContrib.status})`);

// RBAC: manager publish → 403 (manager chỉ duyệt)
const pubMgr = await req('POST', `/contents/${id}/publication`, hai);
check('RBAC manager publish → 403', pubMgr.status === 403, `(status ${pubMgr.status})`);

// Editor publish approved → 200 + public_url + published
const pub = await req('POST', `/contents/${id}/publication`, ngoc);
check('editor publish approved → 200 status=published + public_url', pub.status === 200 && pub.body?.status === 'published' && !!pub.body?.public_url, `(status ${pub.status})`);
check('BR-06 chưa có domain → subdomain tạm', pub.body?.used_temp_subdomain === true);

// Idempotent: publish lại → vẫn 200 published
const pub2 = await req('POST', `/contents/${id}/publication`, ngoc);
check('publish lại → idempotent 200 published', pub2.status === 200 && pub2.body?.status === 'published', `(status ${pub2.status})`);

// Sitemap chứa nội dung đã publish
const sm = await req('GET', `/sites/${SITE_A}/sitemap`, ngoc);
check('sitemap chứa content đã publish', sm.status === 200 && sm.body?.urls?.some(u => u.slug === 'bai-xuat-ban'), `(urls ${sm.body?.urls?.length})`);

// Unpublish → 204, rời khỏi sitemap
const un = await req('DELETE', `/contents/${id}/publication`, ngoc);
check('unpublish → 204', un.status === 204, `(status ${un.status})`);
const sm2 = await req('GET', `/sites/${SITE_A}/sitemap`, ngoc);
check('sau unpublish không còn trong sitemap', !sm2.body?.urls?.some(u => u.slug === 'bai-xuat-ban'));

// Lên lịch tương lai → 202 scheduled
const id2 = await makeApproved('Bai len lich', 'bai-len-lich');
const future = new Date(Date.now() + 86400000).toISOString();
const sch = await req('POST', `/contents/${id2}/publication`, ngoc, { scheduled_at: future });
check('lên lịch tương lai → 202 scheduled', sch.status === 202 && sch.body?.status === 'scheduled', `(status ${sch.status})`);

// Lịch quá khứ → 422
const id3 = await makeApproved('Bai qua khu', 'bai-qua-khu');
const past = new Date(Date.now() - 86400000).toISOString();
const schPast = await req('POST', `/contents/${id3}/publication`, ngoc, { scheduled_at: past });
check('lịch quá khứ → 422', schPast.status === 422, `(status ${schPast.status})`);

// Cross-tenant: edB publish content của A → 404 (RLS, sau khi qua RBAC editor)
const cross = await req('POST', `/contents/${id2}/publication`, edB);
check('cross-tenant publish → 404 (RLS)', cross.status === 404, `(status ${cross.status})`);

console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`);
process.exit(fail === 0 ? 0 : 1);
