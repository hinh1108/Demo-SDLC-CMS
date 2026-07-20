import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { BACKEND_URL } from '@/lib/backend';

// Proxy same-origin → API, đính Bearer từ httpOnly cookie (server-side).
// Token KHÔNG bao giờ ra tới JS trình duyệt.
async function handler(req: NextRequest, ctx: { params: { path: string[] } }) {
  const token = cookies().get('vt')?.value;
  const path = ctx.params.path.join('/');
  const qs = req.nextUrl.search || '';
  const init: RequestInit = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  if (!['GET', 'HEAD', 'DELETE'].includes(req.method)) {
    init.body = await req.text();
  }
  const r = await fetch(`${BACKEND_URL}/${path}${qs}`, init);
  const body = await r.text();
  return new Response(body, {
    status: r.status,
    headers: { 'Content-Type': r.headers.get('content-type') || 'application/json' },
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
