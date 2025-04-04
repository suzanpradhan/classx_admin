import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  if (req.nextUrl.pathname.startsWith('/_next/')) {
    return true;
  }
  if (token) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return;
  } else {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (pathname === '/login') {
      return;
    }
    return NextResponse.redirect(
      new URL('/login' + '?callback=' + req.url, req.nextUrl.origin)
    );
  }
}

export const config = {
  matcher: ['/', '/admin/:path*', '/login'],
};
