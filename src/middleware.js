import { NextResponse } from "next/server";

const publicRotas = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const publicRota = publicRotas.find(route => route.path === path);
  const authToken = request.cookies.get('token');

  if (!authToken && publicRota) {
    return NextResponse.next();
  }

  if (!authToken && !publicRota) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRota && publicRota.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRota) {
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/perfil/:path*','/labs/:path*', '/turmas/:path*', '/reservas/:path*', '/relatorio/:path*', '/backups/:path*' ],
};