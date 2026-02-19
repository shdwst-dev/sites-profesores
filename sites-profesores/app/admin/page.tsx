import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="space-y-12">
            <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">Bienvenido al Panel de Administración</h1>
                <p className="text-lg text-indigo-300 max-w-2xl mx-auto">
                    Seleccione una sección en el menú lateral para comenzar a editar la información del sitio.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Link href="/admin/tiid/recursos-y-avisos" className="group">
                    <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 hover:bg-slate-800 transition-colors h-full flex flex-col items-center text-center">
                        <h3 className="text-2xl font-black text-white mb-4">TIID</h3>
                        <p className="text-gray-400">Gestionar recursos, avisos, coordinaciones y calendarios del departamento TIID.</p>
                        <span className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Editar</span>
                    </div>
                </Link>

                <Link href="/admin/sistemas/recursos-y-avisos" className="group">
                    <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 hover:bg-slate-800 transition-colors h-full flex flex-col items-center text-center">
                        <h3 className="text-2xl font-black text-rose-500 mb-4">Sistemas</h3>
                        <p className="text-gray-400">Gestionar recursos, avisos, coordinaciones y calendarios del departamento de Sistemas.</p>
                        <span className="mt-8 px-6 py-2 bg-rose-600 text-white rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Editar</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
