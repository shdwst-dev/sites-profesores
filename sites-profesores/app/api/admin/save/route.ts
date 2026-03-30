import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { sendNewContentAlert } from '@/lib/email';

// Tablas permitidas para operaciones admin (whitelist de seguridad)
const ALLOWED_TABLES = new Set([
    'comunicados',
    'fechas_importantes',
    'tramites',
    'tutores_profesores',
    'contactos',
    'entregables',
    'documentos_descarga',
    'encargados_tutorias',
    'coordinaciones',
    'coordinaciones_estancias',
    'coordinaciones_tutores',
    'recursos_genericos',
    'calendario_escolar',
    'lengua_extranjera',
]);

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

// POST /api/admin/save
// Body: { table, operation: 'insert'|'update'|'delete', id?, payload? }
export async function POST(request: Request) {
    // 1. Verificar que sea admin
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
        return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    try {
        const body = await request.json() as {
            table: string;
            operation: 'insert' | 'update' | 'delete';
            id?: string | number;
            payload?: Record<string, unknown>;
            notify?: boolean;
        };

        const { table, operation, id, payload, notify } = body;

        // 2. Validar tabla permitida
        if (!ALLOWED_TABLES.has(table)) {
            return NextResponse.json({ message: 'Tabla no permitida' }, { status: 400 });
        }

        // 3. Ejecutar la operación con supabaseAdmin (bypasa RLS)
        if (operation === 'insert') {
            if (!payload) return NextResponse.json({ message: 'Payload requerido' }, { status: 400 });
            const { data, error } = await supabaseAdmin.from(table).insert([payload]).select();
            if (error) {
                console.error(`[admin/save] Insert error en ${table}:`, error);
                return NextResponse.json({ message: error.message, details: error.details }, { status: 500 });
            }

            // Enviar alerta por correo SOLO si notify es true
            if (notify) {
                console.log(`[admin/save] Disparando alerta de correo para ${table}...`);
                sendNewContentAlert(table, payload).catch(e => console.error('[Alert Integration]:', e));
            }

            return NextResponse.json({ data });
        }

        if (operation === 'update') {
            if (!id || !payload) return NextResponse.json({ message: 'ID y payload requeridos' }, { status: 400 });
            const { data, error } = await supabaseAdmin.from(table).update(payload).eq('id', id).select();
            if (error) {
                console.error(`[admin/save] Update error en ${table}:`, error);
                return NextResponse.json({ message: error.message, details: error.details }, { status: 500 });
            }
            return NextResponse.json({ data });
        }

        if (operation === 'delete') {
            if (!id) return NextResponse.json({ message: 'ID requerido' }, { status: 400 });
            const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
            if (error) {
                console.error(`[admin/save] Delete error en ${table}:`, error);
                return NextResponse.json({ message: error.message, details: error.details }, { status: 500 });
            }
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: 'Operación no válida' }, { status: 400 });
    } catch (err) {
        console.error('[admin/save] Error general:', err);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}
