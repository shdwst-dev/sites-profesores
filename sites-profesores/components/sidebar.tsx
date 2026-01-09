// components/Sidebar.tsx
import Link from 'next/link';
import { Home, FolderOpen, Users, LogOut, Settings } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold tracking-wider">UPQ <span className="text-blue-400">Docente</span></h1>
            </div>

            {/* Menú de Navegación */}
            <nav className="flex-1 p-4 space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white transition-all shadow-md">
                    <Home size={20} />
                    <span className="font-medium">Inicio</span>
                </Link>

                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase">Departamentos</p>
                </div>

                <Link href="/sistemas" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                    <FolderOpen size={20} />
                    <span>Sistemas Comp.</span>
                </Link>

                <Link href="/ti" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                    <FolderOpen size={20} />
                    <span>Tecnologías Info.</span>
                </Link>
            </nav>

            {/* Pie de página del sidebar */}
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full transition-colors">
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}