import { NextResponse } from 'next/server';
import { signSession } from '@/lib/auth';

// POST /api/auth/google
// Maneja el login después de que el usuario se autentica con el botón de Google
export async function POST(request: Request) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ message: 'Token de Google no recibido' }, { status: 400 });
    }

    // Verifica el token con Google API (Token Info)
    // Usamos el endpoint público de Google para verificar el ID Token
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    
    if (!googleRes.ok) {
      return NextResponse.json({ message: 'Token de Google inválido' }, { status: 401 });
    }

    const payload = await googleRes.json();

    // El payload contiene: email, name, picture, sub, etc.
    const { email, name, picture, sub, aud } = payload;

    // EL aud (audience) debe coincidir con tu GOOGLE_CLIENT_ID
    if (aud !== process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        return NextResponse.json({ message: 'Audience mismatch' }, { status: 401 });
    }

    // Crea el token de sesión interno
    const sessionToken = await signSession({
      email,
      name,
      picture,
      sub,
    });

    // Crea la respuesta y setea la cookie
    const response = NextResponse.json({ success: true, email });
    
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Error interno en el servidor' }, { status: 500 });
  }
}
