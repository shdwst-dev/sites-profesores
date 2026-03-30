import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import AdminSidebar from '@/components/admin/AdminSidebar';

// Server Component: verifica sesión y rol antes de renderizar el panel admin
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Leer la cookie de sesión desde el servidor
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;
    const session = await verifySessionToken(sessionToken);

    // 2. Si no hay sesión válida, redirige al login
    if (!session) {
        redirect('/');
    }

    // 3. Consultar el rol del usuario en la base de datos
    const { data: usuario } = await supabaseAdmin
        .from('usuarios')
        .select('rol')
        .eq('email', session.email)
        .maybeSingle();

    // 4. Si no tiene el rol 'admin', redirige al home sin acceso
    if (usuario?.rol !== 'admin') {
        redirect('/home');
    }

    return (
        <div className="min-h-screen bg-slate-900 flex text-white font-sans">
            <AdminSidebar />

            {/* Main Content — offset on desktop, full width on mobile */}
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
