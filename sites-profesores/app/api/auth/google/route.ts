import { NextResponse } from 'next/server';
import { signSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseServer';

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

    // Verifica que el correo esté registrado en la tabla emails_permitidos
    const { data: allowedEmail, error: dbError } = await supabaseAdmin
      .from('emails_permitidos')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (dbError) {
      console.error('Error al consultar emails_permitidos:', dbError);
      return NextResponse.json({ message: 'Error al verificar permisos' }, { status: 500 });
    }

    if (!allowedEmail) {
      return NextResponse.json({ message: 'Tu correo no tiene permiso para acceder. Contacta al administrador.' }, { status: 403 });
    }

    // Actualiza o crea el registro en la tabla 'usuarios' para marcarlo como Activo
    const emailLower = email.toLowerCase();
    const { data: existingUser } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', emailLower)
      .maybeSingle();

    if (existingUser) {
      await supabaseAdmin
        .from('usuarios')
        .update({
          nombre: name,
          picture: picture,
          last_login: new Date().toISOString(),
        })
        .eq('email', emailLower);
    } else {
      await supabaseAdmin
        .from('usuarios')
        .insert([{
          email: emailLower,
          nombre: name,
          picture: picture,
          rol: 'profesor',
          last_login: new Date().toISOString(),
        }]);
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
