import Link from 'next/link';
import { Home, FileText, Settings, LogOut, LayoutDashboard, Database, BookOpen, Info } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-900 flex text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-white/10 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors">
                            <LayoutDashboard size={20} />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Admin Portal</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mt-4 mb-2">General</p>
                    <Link href="/admin/informacion-interes" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Info size={18} />
                        <span className="font-medium text-sm">Información de Interés</span>
                    </Link>

                    <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mt-8 mb-2">TIID</p>
                    <Link href="/admin/tiid/formatos-y-documentos" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <BookOpen size={18} />
                        <span className="font-medium text-sm">Formatos y Documentos</span>
                    </Link>
                    <Link href="/admin/tiid/recursos-y-avisos" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <FileText size={18} />
                        <span className="font-medium text-sm">Recursos y Avisos</span>
                    </Link>

                    <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mt-8 mb-2">Sistemas</p>
                    <Link href="/admin/sistemas/formatos-y-documentos" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <BookOpen size={18} />
                        <span className="font-medium text-sm">Formatos y Documentos</span>
                    </Link>
                    <Link href="/admin/sistemas/recursos-y-avisos" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Database size={18} />
                        <span className="font-medium text-sm">Recursos y Avisos</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Salir al Sitio</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
