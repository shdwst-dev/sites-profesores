'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, Info, BookOpen, FileText, Database, Bell, CheckSquare, Users, Settings, Home } from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';

const navItems = [
    {
        group: 'General',
        items: [
            { href: '/admin/informacion-interes', label: 'Información de Interés', icon: Info },
        ]
    },
    {
        group: 'TIID',
        items: [
            { href: '/admin/tiid/formatos-y-documentos', label: 'Formatos y Documentos', icon: BookOpen },
            { href: '/admin/tiid/recursos-y-avisos', label: 'Recursos y Avisos', icon: FileText },
        ]
    },
    {
        group: 'Sistemas',
        items: [
            { href: '/admin/sistemas/formatos-y-documentos', label: 'Formatos y Documentos', icon: BookOpen },
            { href: '/admin/sistemas/recursos-y-avisos', label: 'Recursos y Avisos', icon: FileText },
        ]
    },
    {
        group: 'Configuración',
        items: [
            { href: '/admin/usuarios', label: 'Gestión de Usuarios', icon: Users },
        ]
    },
];

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    const sidebarContent = (
        <>
            <div className="p-6 border-b border-white/10">
                <Link href="/admin" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
                    <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors">
                        <LayoutDashboard size={20} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Admin Portal</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((section) => (
                    <div key={section.group}>
                        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mt-4 mb-2">{section.group}</p>
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href)
                                            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    href="/home"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-indigo-600/20 hover:text-indigo-400 rounded-xl transition-all w-full"
                >
                    <Home size={18} />
                    <span className="font-medium text-sm">Volver al Portal</span>
                </Link>
                <LogoutButton />
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-slate-800 border border-white/10 rounded-xl text-white shadow-2xl hover:bg-slate-700 transition-colors"
                aria-label="Abrir menú"
            >
                <Menu size={22} />
            </button>

            {/* Desktop sidebar — always visible on lg+ */}
            <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-white/10 flex-col fixed h-full z-10">
                {sidebarContent}
            </aside>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-50 lg:hidden"
                    onClick={() => setOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

                    {/* Sidebar panel */}
                    <aside
                        className="absolute top-0 left-0 w-72 h-full bg-slate-950 border-r border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-5 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Cerrar menú"
                        >
                            <X size={20} />
                        </button>
                        {sidebarContent}
                    </aside>
                </div>
            )}
        </>
    );
}
