'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck, Search, Moon, Sun } from 'lucide-react';
import SearchModal from '@/components/SearchModal';
import { useTheme } from '@/components/ThemeProvider';

interface User {
    name?: string;
    picture?: string;
    email?: string;
    rol?: string | null;
}

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    // Obtiene los datos del usuario desde el backend (/api/auth/me)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (!res.ok) {
                    router.push('/');
                    return;
                }
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error('Error al obtener usuario', error);
                router.push('/');
            }
        };

        fetchUser();
    }, [router]);

    // Global keyboard shortcut: Ctrl+K or ⌘+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Cierra la sesión
    const manejarLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                cache: 'no-store',
            });
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        } finally {
            router.replace('/');
        }
    };

    return (
        <>
            <header className="flex items-center px-4 sm:px-8 py-2 bg-white shadow-sm justify-between">
                <div className="flex items-center gap-3 shrink-0">
                    <Image
                        src="/UPQ-Logo.png"
                        alt="Logo UPQ"
                        width={70}
                        height={70}
                        className="w-14 h-14 sm:w-[70px] sm:h-[70px]"
                    />
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Search button */}
                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-all active:scale-95 border border-gray-200"
                        title="Buscar (Ctrl+K)"
                    >
                        <Search size={16} />
                        <span className="hidden sm:inline text-gray-400">Buscar...</span>
                        <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded">
                            ⌘K
                        </kbd>
                    </button>

                    {/* Theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg cursor-pointer transition-all active:scale-90 border border-gray-200"
                        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* User info */}
                    {user && (
                        <div className="flex items-center gap-2">
                            {user.picture && (
                                <Image
                                    src={user.picture}
                                    alt="Foto de perfil"
                                    width={36}
                                    height={36}
                                    className="rounded-full border-2 border-gray-200 w-8 h-8 sm:w-9 sm:h-9"
                                />
                            )}
                            <span className="text-sm text-gray-700 font-medium hidden sm:inline max-w-[150px] truncate">
                                {user.name || user.email}
                            </span>
                        </div>
                    )}
                    
                    {/* Admin panel button */}
                    {user?.rol === 'admin' && (
                        <button
                            type="button"
                            onClick={() => router.push('/admin')}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-all hover:bg-indigo-700 active:scale-95"
                        >
                            <ShieldCheck size={18} />
                            <span className="hidden sm:inline">Panel Admin</span>
                        </button>
                    )}

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={manejarLogout}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#c41e3a] text-white rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-all hover:bg-[#a31830] active:scale-95"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Cerrar Sesión</span>
                    </button>
                </div>
            </header>

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
