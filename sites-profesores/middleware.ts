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
  
  // Si la sesión es válida, permite continuar
  if (session) {
    return NextResponse.next();
  }

  // Si no hay sesión válida, redirige al login
  const loginUrl = new URL('/', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}
