'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Header() {
    const router = useRouter();

    const manejarLogout = () => {
        router.push('/');
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
            <button onClick={manejarLogout} style={styles.btnCerrarSesion}>
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
            </button>
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
    },
    btnCerrarSesion: {
        marginLeft: 'auto',
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
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
};
