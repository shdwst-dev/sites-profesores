import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Verifica que el usuario tenga sesión válida y rol admin
async function verifyAdmin(request: Request): Promise<boolean> {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionToken = cookieHeader
        .split(';')
        .map((p) => p.trim())
        .find((p) => p.startsWith('session_token='))
        ?.split('=')[1];

    const session = await verifySessionToken(sessionToken);
    if (!session) return false;

    const { data } = await supabaseAdmin
        .from('usuarios')
        .select('rol')
        .eq('email', session.email)
        .maybeSingle();

    return data?.rol === 'admin';
}

// GET /api/admin/users — Lista usuarios de emails_permitidos con join a usuarios para rol
export async function GET(request: Request) {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
        return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    try {
        // Obtener todos los emails permitidos
        const { data: emails, error: emailsError } = await supabaseAdmin
            .from('emails_permitidos')
            .select('*')
            .order('email', { ascending: true });

        if (emailsError) {
            return NextResponse.json({ message: emailsError.message }, { status: 500 });
        }

        // Obtener todos los usuarios registrados (que ya hicieron login)
        const { data: usuarios, error: usersError } = await supabaseAdmin
            .from('usuarios')
            .select('email, nombre, rol, picture, last_login');

        if (usersError) {
            return NextResponse.json({ message: usersError.message }, { status: 500 });
        }

        // Combinar: cada email_permitido + info del usuario si existe
        const combined = (emails || []).map((ep: any) => {
            const user = (usuarios || []).find((u: any) => u.email === ep.email);
            return {
                id: ep.id,
                email: ep.email,
                rol: user?.rol || 'profesor',
                nombre: user?.nombre || null,
                picture: user?.picture || null,
                last_login: user?.last_login || null,
                registered: !!user,
            };
        });

        return NextResponse.json(combined);
    } catch (err) {
        console.error('[admin/users] Error:', err);
        return NextResponse.json({ message: 'Error interno' }, { status: 500 });
    }
}

// POST /api/admin/users — Crear, actualizar rol o eliminar usuario
export async function POST(request: Request) {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
        return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    try {
        const body = await request.json() as {
            operation: 'invite' | 'update_role' | 'revoke';
            email: string;
            rol?: string;
        };

        const { operation, email, rol } = body;

        if (!email) {
            return NextResponse.json({ message: 'Email requerido' }, { status: 400 });
        }

        if (operation === 'invite') {
            // Verificar si ya existe
            const { data: existing } = await supabaseAdmin
                .from('emails_permitidos')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            if (existing) {
                return NextResponse.json({ message: 'Este email ya está registrado' }, { status: 409 });
            }

            const { error } = await supabaseAdmin
                .from('emails_permitidos')
                .insert([{ email }]);

            if (error) {
                return NextResponse.json({ message: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Usuario invitado exitosamente' });
        }

        if (operation === 'update_role') {
            if (!rol || !['admin', 'profesor'].includes(rol)) {
                return NextResponse.json({ message: 'Rol inválido (admin o profesor)' }, { status: 400 });
            }

            // Actualizar rol en tabla usuarios
            const { error } = await supabaseAdmin
                .from('usuarios')
                .update({ rol })
                .eq('email', email);

            if (error) {
                return NextResponse.json({ message: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: `Rol actualizado a ${rol}` });
        }

        if (operation === 'revoke') {
            // Eliminar de emails_permitidos
            const { error } = await supabaseAdmin
                .from('emails_permitidos')
                .delete()
                .eq('email', email);

            if (error) {
                return NextResponse.json({ message: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Acceso revocado' });
        }

        return NextResponse.json({ message: 'Operación no válida' }, { status: 400 });
    } catch (err) {
        console.error('[admin/users] Error:', err);
        return NextResponse.json({ message: 'Error interno' }, { status: 500 });
    }
}
