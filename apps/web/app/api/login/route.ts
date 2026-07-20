import { cookies } from 'next/headers';
import { BACKEND_URL, roleFromToken } from '@/lib/backend';

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const r = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) {
    return Response.json(data || { title: 'Login failed' }, { status: r.status });
  }
  const token: string = data.access_token;
  const role = roleFromToken(token);
  const c = cookies();
  // Token trong httpOnly cookie → JS trình duyệt KHÔNG đọc được (chống XSS đánh cắp token)
  c.set('vt', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 900 });
  // role không nhạy cảm → cookie thường để UI ẩn/hiện nút (quyền thật enforce ở API)
  c.set('role', role, { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 900 });
  return Response.json({ ok: true, role });
}
