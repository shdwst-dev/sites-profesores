import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifySessionToken } from './lib/auth';

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = new Set([
  '/',
  '/api/auth/google',
  '/api/auth/me',
  '/api/auth/logout',
]);

// Emails con permisos de administrador (variable de entorno, separados por coma)
// Si no se define ADMIN_EMAILS, el acceso admin queda abierto para cualquier usuario autenticado
const ADMIN_EMAILS: Set<string> | null = process.env.ADMIN_EMAILS
  ? new Set(process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()))
  : null;

// Middleware de protección de rutas
// Intercepta todas las solicitudes y verifica que el usuario esté autenticado
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si es una ruta pública o archivo estático, permite el acceso
  if (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/UPQ-') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Verifica la cookie de sesión
  const sessionToken = request.cookies.get('session_token')?.value;
  const session = await verifySessionToken(sessionToken);
  
  // Si no hay sesión válida, redirige al login
  if (!session) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protección de rutas admin: solo emails autorizados
  if (pathname.startsWith('/admin') && ADMIN_EMAILS) {
    const userEmail = session.email?.toLowerCase();
    if (!userEmail || !ADMIN_EMAILS.has(userEmail)) {
      // Usuario autenticado pero sin permisos de admin → redirige al home
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return NextResponse.next();
}
