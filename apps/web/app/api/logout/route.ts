import { cookies } from 'next/headers';

export async function POST() {
  const c = cookies();
  c.delete('vt');
  c.delete('role');
  return Response.json({ ok: true });
}
