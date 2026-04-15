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

// GET /api/admin/stats
export async function GET(request: Request) {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
        return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    try {
        // Ejecutar todas las consultas de conteo en paralelo
        const [
            comunicados,
            fechas,
            tramites,
            contactos,
            entregablesTIID,
            entregablesSistemas,
            docsTIID,
            docsSistemas,
            emailsPermitidos,
        ] = await Promise.all([
            supabaseAdmin.from('comunicados').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('fechas_importantes').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('tramites').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('contactos').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('entregables').select('id', { count: 'exact', head: true }).eq('department', 'TIID'),
            supabaseAdmin.from('entregables').select('id', { count: 'exact', head: true }).eq('department', 'Sistemas'),
            supabaseAdmin.from('documentos_descarga').select('id', { count: 'exact', head: true }).eq('department', 'TIID'),
            supabaseAdmin.from('documentos_descarga').select('id', { count: 'exact', head: true }).eq('department', 'Sistemas'),
            supabaseAdmin.from('emails_permitidos').select('id', { count: 'exact', head: true }),
        ]);

        return NextResponse.json({
            comunicados: comunicados.count ?? 0,
            fechas: fechas.count ?? 0,
            tramites: tramites.count ?? 0,
            contactos: contactos.count ?? 0,
            entregablesTIID: entregablesTIID.count ?? 0,
            entregablesSistemas: entregablesSistemas.count ?? 0,
            docsTIID: docsTIID.count ?? 0,
            docsSistemas: docsSistemas.count ?? 0,
            emailsPermitidos: emailsPermitidos.count ?? 0,
        });
    } catch (error) {
        console.error('[admin/stats] Error:', error);
        return NextResponse.json({ message: 'Error interno' }, { status: 500 });
    }
}
