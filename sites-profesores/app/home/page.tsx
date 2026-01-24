'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Cpu, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
    const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);
    const router = useRouter();

    const manejarInfoDeInteres = () => {
        router.push('/Informacion-interes');
    };
    const manejarSistemasComputacionales = () => {
        router.push('/sistemas-computacionales');
    }

    return (
        <div style={styles.page}>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.titulo}>Bienvenido al portal</h1>
                <h2 style={styles.subtitulo}>Seleccione una opción para continuar </h2>
            </div>
            <main>
                <div style={styles.opciones}>
                    <div
                        style={styles.opcion}
                        onMouseEnter={() => setHoveredIcon(0)}
                        onMouseLeave={() => setHoveredIcon(null)}
                    >
                        <div style={{ ...styles.opcionHeader, backgroundColor: '#004a8f' }} onClick={manejarInfoDeInteres}>
                            <div
                                className="icono-wrapper"
                                style={{
                                    ...styles.iconoWrapper,
                                    transform: hoveredIcon === 0 ? 'scale(1.2)' : 'scale(1)',
                                }}
                            >
                                <Info size={48} color="#fff" />
                            </div>
                            <h3 style={styles.opcionTitulo}>Información de Interés</h3>
                        </div>
                        <p style={styles.opcionDescripcion}>Avisos, comunicados y noticias importantes</p>
                    </div>
                    <div
                        style={styles.opcion}
                        onMouseEnter={() => setHoveredIcon(1)}
                        onMouseLeave={() => setHoveredIcon(null)}
                    >
                        <div style={{ ...styles.opcionHeader, backgroundColor: '#c41e3a' }} onClick={manejarSistemasComputacionales}>
                            <div
                                style={{
                                    ...styles.iconoWrapper,
                                    transform: hoveredIcon === 1 ? 'scale(1.2)' : 'scale(1)',
                                }}
                            >
                                <Cpu size={48} color="#fff" />
                            </div>
                            <h3 style={styles.opcionTitulo}>Sistemas Computacionales</h3>
                        </div>
                        <p style={styles.opcionDescripcion}>Gestión de documentos y recursos de la carrera</p>
                    </div>
                    <div
                        style={styles.opcion}
                        onMouseEnter={() => setHoveredIcon(2)}
                        onMouseLeave={() => setHoveredIcon(null)}
                    >
                        <div style={{ ...styles.opcionHeader, backgroundColor: '#004a8f' }}>
                            <div
                                style={{
                                    ...styles.iconoWrapper,
                                    transform: hoveredIcon === 2 ? 'scale(1.2)' : 'scale(1)',
                                }}
                            >
                                <Globe size={48} color="#fff" />
                            </div>
                            <h3 style={styles.opcionTitulo}>TIID</h3>
                        </div>
                        <p style={styles.opcionDescripcion}>Gestión de documentos y recursos de la carrera</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        display: 'flex',
        flexDirection: 'column' as const,
        flex: 1,
    },
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '4rem',
        marginBottom: '2rem',
    },
    titulo: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '0.5rem',
    },
    subtitulo: {
        fontSize: '18px',
        color: '#666',
        marginTop: '0.5rem',
    },
    opciones: {
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'center',
        gap: '2rem',
        padding: '1rem 2rem',
        flexWrap: 'wrap' as const,
    },
    opcion: {
        display: 'flex',
        flexDirection: 'column' as const,
        width: '380px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.2s',
    },
    opcionTitulo: {
        fontSize: '20px',
        fontWeight: 600,
        color: '#ffffff',
        margin: 0,
        textAlign: 'center' as const,
    },
    opcionHeader: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        gap: '1rem',
        minHeight: '160px',
    },
    opcionDescripcion: {
        fontSize: '16px',
        color: '#666',
        padding: '1.5rem',
        textAlign: 'center' as const,
        margin: 0,
    },
    iconoWrapper: {
        transition: 'transform 0.3s ease',
        cursor: 'pointer'
    }
};