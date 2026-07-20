import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Bảo vệ route: chưa đăng nhập → /login; đã đăng nhập mà vào /login → /content
export function middleware(req: NextRequest) {
  const token = req.cookies.get('vt')?.value;
  const { pathname } = req.nextUrl;
  const isProtected = pathname === '/' || pathname.startsWith('/content') || pathname.startsWith('/approvals');
  if (isProtected && !token) return NextResponse.redirect(new URL('/login', req.url));
  if (pathname === '/login' && token) return NextResponse.redirect(new URL('/content', req.url));
  if (pathname === '/') return NextResponse.redirect(new URL('/content', req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/', '/login', '/content/:path*', '/approvals/:path*'] };
