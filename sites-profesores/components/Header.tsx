'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck } from 'lucide-react';

interface User {
    name?: string;
    picture?: string;
    email?: string;
    rol?: string | null;
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
        <header style={styles.header}>
            <div style={styles.brand}>
                <Image
                    src="/UPQ-Logo.png"
                    alt="Logo UPQ"
                    width={90}
                    height={90}
                />
            </div>
            
            <div style={styles.userSection}>
                {/* Muestra la foto de perfil y nombre del usuario */}
                {user && (
                    <div style={styles.userInfo}>
                        {user.picture && (
                            <Image
                                src={user.picture}
                                alt="Foto de perfil"
                                width={40}
                                height={40}
                                style={styles.profilePic}
                            />
                        )}
                        <span style={styles.userName}>{user.name || user.email}</span>
                    </div>
                )}
                
                {/* Botón de Panel Admin: solo visible para usuarios con rol 'admin' */}
                {user?.rol === 'admin' && (
                    <button
                        type="button"
                        onClick={() => router.push('/admin')}
                        style={styles.btnAdmin}
                    >
                        <ShieldCheck size={20} />
                        <span>Panel Admin</span>
                    </button>
                )}

                <button type="button" onClick={manejarLogout} style={styles.btnCerrarSesion}>
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 2rem',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
        justifyContent: 'space-between',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    profilePic: {
        borderRadius: '50%',
        border: '2px solid #ddd',
    } as const,
    userName: {
        fontSize: '0.95rem',
        color: '#333',
        fontWeight: 500 as const,
    },
    btnAdmin: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#1e40af',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 500 as const,
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.1s',
    },
    btnCerrarSesion: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#c41e3a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 500 as const,
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.1s',
    },
};
