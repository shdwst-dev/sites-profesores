'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
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
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all w-full"
        >
            <LogOut size={18} />
            <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
    );
}
