import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseServer';

// GET /api/auth/me
// Retorna los datos del usuario actual si la sesión es válida
export async function GET(request: Request) {
  // Lee la cookie de sesión
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionToken = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('session_token='))
    ?.split('=')[1];

  // Verifica que el token sea válido
  const session = await verifySessionToken(sessionToken);
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  // Consulta el rol del usuario en la tabla usuarios
  const { data: usuario } = await supabaseAdmin
    .from('usuarios')
    .select('rol')
    .eq('email', session.email)
    .maybeSingle();

  // Retorna los datos del usuario autenticado incluyendo el rol
  return NextResponse.json({
    email: session.email,
    name: session.name,
    picture: session.picture,
    sub: session.sub,
    rol: usuario?.rol ?? null,
  });
}
