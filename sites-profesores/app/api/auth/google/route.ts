import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { signSession } from '@/lib/auth';

// Verifica que el token de Google sea válido
async function verifyGoogleToken(idToken: string) {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!res.ok) {
        throw new Error('Invalid Google token');
    }
    const data = (await res.json()) as {
        email: string;
        email_verified?: string;
        name?: string;
        picture?: string;
        sub?: string;
    };
    if (!data.email || data.email_verified === 'false') {
        throw new Error('Email not verified');
    }
    return {
        email: data.email,
        name: data.name,
        picture: data.picture,
        sub: data.sub,
    };
}

// POST /api/auth/google
// Autentica con Google: verifica token → valida correo → crea usuario → retorna sesión
export async function POST(request: Request) {
    try {
        const { credential } = (await request.json()) as { credential?: string };
        if (!credential) {
            return NextResponse.json({ message: 'Missing credential' }, { status: 400 });
        }

        // 1. Verifica que el token de Google sea válido
        const googleUser = await verifyGoogleToken(credential);

        // 2. Valida que el correo esté en la lista blanca (emails_permitidos)
        const { data: allowed } = await supabaseAdmin
            .from('emails_permitidos')
            .select('email')
            .eq('email', googleUser.email)
            .maybeSingle();

        if (!allowed) {
            return NextResponse.json({ message: 'Correo no autorizado' }, { status: 403 });
        }

        // 3. Crea o actualiza el usuario en la tabla usuarios
        const { data: upserted, error: upsertError } = await supabaseAdmin
            .from('usuarios')
            .upsert(
                {
                    email: googleUser.email,
                    nombre: googleUser.name,
                    google_id: googleUser.sub,
                    foto_perfil: googleUser.picture,
                },
                { onConflict: 'email' }
            )
            .select('id, email, nombre, foto_perfil')
            .maybeSingle();

        if (upsertError) {
            console.error(upsertError);
            return NextResponse.json({ message: 'Error al registrar usuario' }, { status: 500 });
        }

        // 4. Genera un token de sesión firmado (httpOnly cookie)
        const sessionToken = await signSession({
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            sub: googleUser.sub,
        });

        const response = NextResponse.json({
            user: {
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
                id: upserted?.id,
            },
        });

        // 5. Setea la cookie de sesión (httpOnly = no accesible desde JS)
        response.cookies.set('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error('Auth error', error);
        return NextResponse.json({ message: 'No se pudo autenticar' }, { status: 401 });
    }
}
