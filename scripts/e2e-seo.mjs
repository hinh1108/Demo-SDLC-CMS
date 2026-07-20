// e2e US-09 — SEO meta + sitemap.xml. Cần seed mới.
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
  let parsed = null; try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
  return { status: res.status, body: parsed, headers: res.headers };
}
const login = async (email) => (await req('POST', '/auth/login', null, { email, password: 'Password123!' })).body?.access_token;

console.log('=== VietCMS e2e — SEO + sitemap.xml (US-09) ===');
const ngoc = await login('ngoc@a.vn');
const hai = await login('hai@a.vn');
const edB = await login('ed@b.vn');

async function makeApproved(title, slug) {
  const c = await req('POST', `/sites/${SITE_A}/contents`, ngoc, { kind: 'post', title, slug });
  await req('POST', `/contents/${c.body.id}/versions`, ngoc, { blocks: [{ type: 'heading' }] });
  await req('POST', `/contents/${c.body.id}/submission`, ngoc);
  await req('POST', `/contents/${c.body.id}/approvals`, hai, { result: 'approved' });
  return c.body.id;
}

// create content
const cre = await req('POST', `/sites/${SITE_A}/contents`, ngoc, { kind: 'post', title: 'Bai SEO', slug: 'bai-seo' });
const id = cre.body.id;

// GET seo mặc định (chưa có)
const g0 = await req('GET', `/contents/${id}/seo`, ngoc);
check('GET seo mặc định → score null', g0.status === 200 && g0.body?.score === null, `(status ${g0.status})`);

// PUT seo hợp lệ (title 30-60, desc 50-160, keywords, schema)
const goodTitle = 'Tối ưu tốc độ tải website cho người mới bắt đầu'; // ~46 ký tự
const goodDesc = 'Hướng dẫn chi tiết tối ưu tốc độ tải website, cải thiện Core Web Vitals và thứ hạng SEO cho doanh nghiệp.'; // 50-160
const put = await req('PUT', `/contents/${id}/seo`, ngoc, {
  title: goodTitle, description: goodDesc, keywords: 'seo,toc do,web', schema_json: { '@type': 'Article' },
});
check('PUT seo hợp lệ → 200 + score = 100', put.status === 200 && put.body?.score === 100, `(score ${put.body?.score})`);

// GET seo trả lại giá trị đã lưu
const g1 = await req('GET', `/contents/${id}/seo`, ngoc);
check('GET seo trả title đã lưu', g1.body?.title === goodTitle);

// content.seo_score cập nhật
const det = await req('GET', `/contents/${id}`, ngoc);
check('content.seo_score = 100 sau PUT', det.body?.seo_score === 100, `(seo_score ${det.body?.seo_score})`);

// Validation: title quá dài → 400
const longTitle = 'x'.repeat(201);
const badLen = await req('PUT', `/contents/${id}/seo`, ngoc, { title: longTitle });
check('title > 200 → 400 validation', badLen.status === 400, `(status ${badLen.status})`);

// Validation: schema_json không phải object → 400
const badSchema = await req('PUT', `/contents/${id}/seo`, ngoc, { schema_json: 'notobject' });
check('schema_json không phải object → 400', badSchema.status === 400, `(status ${badSchema.status})`);

// Cross-tenant seo → 404
const cross = await req('GET', `/contents/${id}/seo`, edB);
check('cross-tenant GET seo → 404 (RLS)', cross.status === 404, `(status ${cross.status})`);

// --- sitemap.xml công khai ---
// publish 1 nội dung approved để có URL trong sitemap
const pubId = await makeApproved('Bai da xuat ban', 'bai-da-xuat-ban');
await req('POST', `/contents/${pubId}/publication`, ngoc);

// GET sitemap.xml KHÔNG cần token
const sm = await req('GET', `/sites/${SITE_A}/sitemap.xml`, null);
const ct = sm.headers.get('content-type') || '';
check('sitemap.xml public → 200 (không cần token)', sm.status === 200, `(status ${sm.status})`);
check('Content-Type application/xml', ct.includes('xml'), `(${ct})`);
const xml = typeof sm.body === 'string' ? sm.body : JSON.stringify(sm.body);
check('XML well-formed (urlset)', xml.includes('<?xml') && xml.includes('<urlset'));
check('sitemap chứa URL bài đã publish', xml.includes('bai-da-xuat-ban'));
check('sitemap KHÔNG chứa bài nháp (bai-seo)', !xml.includes('bai-seo'));

console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`);
process.exit(fail === 0 ? 0 : 1);
