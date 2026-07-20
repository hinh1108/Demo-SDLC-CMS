// e2e US-06 — Workflow duyệt. Cần seed mới (draft trong A & B).
const BASE = process.env.API_URL || 'http://localhost:3001/v1';
const SITE_A = 'aaaaaaaa-0000-0000-0000-000000000001';
const SITE_B = 'bbbbbbbb-0000-0000-0000-000000000001';

let pass = 0, fail = 0;
const check = (n, c, x = '') => c ? (console.log(`  ✅ ${n}`), pass++) : (console.log(`  ❌ ${n} ${x}`), fail++);
async function req(method, path, token, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}
const login = async (email) => (await req('POST', '/auth/login', null, { email, password: 'Password123!' })).body?.access_token;

console.log('=== VietCMS e2e — Workflow duyệt (US-05/06) ===');

const ngoc = await login('ngoc@a.vn');   // editor, tenant A
const hai = await login('hai@a.vn');     // manager, tenant A
const edB = await login('ed@b.vn');      // editor, tenant B (B KHÔNG có manager)

// Lấy 1 draft của tenant A
const draftsA = await req('GET', `/sites/${SITE_A}/contents?status=draft`, ngoc);
const draftA = draftsA.body?.data?.[0];
check('Có draft ở tenant A để test', !!draftA, `(got ${draftsA.body?.data?.length})`);

// AC-1 submit
const sub = await req('POST', `/contents/${draftA.id}/submission`, ngoc);
check('AC-1 submit draft → 200 status=review', sub.status === 200 && sub.body?.status === 'review', `(status ${sub.status})`);

// invalid-state: submit lại (đã review)
const sub2 = await req('POST', `/contents/${draftA.id}/submission`, ngoc);
check('submit lại (đã review) → 409 invalid-state', sub2.status === 409 && sub2.body?.type?.includes('invalid-state'), `(status ${sub2.status})`);

// AC-2 BR-04: tenant B không có approver → submit draft B → 409 approver-not-configured
const draftsB = await req('GET', `/sites/${SITE_B}/contents?status=draft`, edB);
const draftB = draftsB.body?.data?.[0];
const subB = await req('POST', `/contents/${draftB.id}/submission`, edB);
check('AC-2 tenant B không approver → 409 approver-not-configured',
  subB.status === 409 && subB.body?.type?.includes('approver-not-configured'), `(status ${subB.status})`);

// AC-7 queue: manager A thấy nội dung review (gồm cái vừa submit + 1 seed review)
const q = await req('GET', '/approvals', hai);
check('AC-7 queue manager A trả nội dung review', q.status === 200 && q.body?.data?.length >= 2, `(got ${q.body?.data?.length})`);
check('queue chứa content vừa submit', q.body?.data?.some(c => c.id === draftA.id));

// AC-5 RBAC: editor (ngoc) thử duyệt → 403
const forbid = await req('POST', `/contents/${draftA.id}/approvals`, ngoc, { result: 'approved' });
check('AC-5 editor duyệt → 403 forbidden', forbid.status === 403 && forbid.body?.type?.includes('forbidden'), `(status ${forbid.status})`);

// AC-3 approve bởi manager
const appr = await req('POST', `/contents/${draftA.id}/approvals`, hai, { result: 'approved' });
check('AC-3 manager duyệt → 201 content_status=approved', appr.status === 201 && appr.body?.content_status === 'approved', `(status ${appr.status})`);

// history
const hist = await req('GET', `/contents/${draftA.id}/approvals`, hai);
check('lịch sử duyệt có 1 bản ghi approved', Array.isArray(hist.body) && hist.body.length === 1 && hist.body[0].result === 'approved', `(len ${hist.body?.length})`);

// reject thiếu ghi chú → 422 ; rồi reject có ghi chú → draft
const seededReview = q.body.data.find(c => c.id !== draftA.id); // content 'review' từ seed
const rejNoNote = await req('POST', `/contents/${seededReview.id}/approvals`, hai, { result: 'rejected' });
check('AC-4 reject thiếu ghi chú → 422', rejNoNote.status === 422, `(status ${rejNoNote.status})`);
const rej = await req('POST', `/contents/${seededReview.id}/approvals`, hai, { result: 'rejected', note: 'Bổ sung meta description' });
check('AC-4 reject có ghi chú → 201 content_status=draft', rej.status === 201 && rej.body?.content_status === 'draft', `(status ${rej.status})`);

// invalid-state: duyệt content đã approved → 409
const again = await req('POST', `/contents/${draftA.id}/approvals`, hai, { result: 'approved' });
check('duyệt content không ở review → 409 invalid-state', again.status === 409, `(status ${again.status})`);

console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`);
process.exit(fail === 0 ? 0 : 1);
