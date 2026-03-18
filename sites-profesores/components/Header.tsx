'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface User {
    name?: string;
    picture?: string;
    email?: string;
}

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    // Obtiene los datos del usuario desde el backend (/api/auth/me)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (!res.ok) {
                    // Si /api/auth/me devuelve error, no hay sesión → ir a login
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

    // Cierra la sesión: borra la cookie en el servidor y redirige al login
    const manejarLogout = async () => {
        try {
            // Llama al endpoint de logout y fuerza limpieza de cookie
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                cache: 'no-store',
            });
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        } finally {
            // Redirige al login y evita quedarte en la ruta protegida
            router.replace('/');
        }
    };

    return (
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
            
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Muestra la foto de perfil y nombre del usuario */}
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
    );
}
