'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, FileText, Bell } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/Footer';

export default function SistemasComputacionales() {
    const router = useRouter();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const manejarFormatosDocumentos = () => {
        router.push('tiid/formatos-y-documentos');
    };
    const manejarRecursosAvisos = () => {
        router.push('tiid/recursos-y-avisos');
    }

    return (
        <div style={styles.pageContainer}>
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/home')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-700 cursor-pointer" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Tecnologías de la Información e Innovación Digital</h1>
                                <p className="text-sm text-gray-600">Gestión de carrera</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all cursor-pointer"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </header>

            <main style={styles.main}>
                <div style={styles.cards}>
                    <div 
                        style={styles.card} 
                        onClick={manejarFormatosDocumentos} 
                        className='cursor-pointer'
                        onMouseEnter={() => setHoveredCard(0)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div style={{ ...styles.cardTop, ...styles.redGradient }}>
                            <div
                                style={{
                                    ...styles.iconWrapper,
                                    transform: hoveredCard === 0 ? 'scale(1.2)' : 'scale(1)',
                                }}
                            >
                                <FileText size={36} color="#fff" />
                            </div>
                            <h2 style={styles.cardTitle}>Formatos y Documentos</h2>
                        </div>
                        <div style={styles.cardBottom}>
                            <p style={styles.cardText}>Subir entregables y documentos requeridos</p>
                        </div>
                    </div>

                    <div 
                        style={styles.card}
                        onClick={manejarRecursosAvisos}
                        className='cursor-pointer'
                        onMouseEnter={() => setHoveredCard(1)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div style={{ ...styles.cardTop, ...styles.blueGradient }}>
                            <div
                                style={{
                                    ...styles.iconWrapper,
                                    transform: hoveredCard === 1 ? 'scale(1.2)' : 'scale(1)',
                                }}
                            >
                                <Bell size={36} color="#fff" />
                            </div>
                            <h2 style={styles.cardTitle}>Recursos y Avisos</h2>
                        </div>
                        <div style={styles.cardBottom}>
                            <p style={styles.cardText}>Materiales de apoyo y comunicados</p>
                        </div>
                    </div>
                </div>
                
                {/* Sección Misión */}
                <div style={styles.misionSection}>
                    <div style={styles.misionImage}>
                        <img
                            src="/mision-sistemas.png"
                            alt="Salón de clases"
                            style={styles.image}
                        />
                    </div>
                    <div style={styles.misionContent}>
                        <h2 style={styles.misionTitle}>Misión</h2>
                        <p style={styles.misionText}>
                            Formamos líderes capaces de impulsar el futuro con un enfoque en tecnologías avanzadas. Esta carrera es el puente hacia la innovación, donde la creatividad y la tecnología se unen para transformar industrias, optimizar procesos y mejorar vidas. Con un enfoque en la vanguardia tecnológica, diseñamos soluciones disruptivas y lideramos el cambio en un mundo en constante evolución. ¡El futuro se construye desde aquí!
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        flex: 1,
    },
    main: {
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 24px 40px',
        width: '100%',
    },
    cards: {
        display: 'flex',
        gap: '28px',
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
    },
    card: {
        width: '520px',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
        backgroundColor: '#fff',
    },
    cardTop: {
        padding: '22px 28px 26px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'row' as const,
        gap: '12px',
        alignItems: 'center',
    },
    redGradient: {
        background: 'linear-gradient(135deg, #431d2a 0%, #2d1420 100%)',
    },
    blueGradient: {
        background: 'linear-gradient(135deg, #1e3a5f 0%, #152a45 100%)',
    },
    cardTitle: {
        fontSize: '24px',
        fontWeight: 600,
        margin: 0,
        flex: 1,
    },
    cardBottom: {
        backgroundColor: '#fff',
        padding: '20px 28px 24px',
    },
    cardText: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 600,
        color: '#4a5568',
    },
    iconWrapper: {
        transition: 'transform 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    misionSection: {
        marginTop: '60px',
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap' as const,
        boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
    },
    misionImage: {
        flex: '1 1 400px',
        minWidth: '300px',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        display: 'block',
    },
    misionContent: {
        flex: '1 1 400px',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    misionTitle: {
        fontSize: '28px',
        fontWeight: 600,
        color: '#1a202c',
        marginBottom: '20px',
        marginTop: 0,
    },
    misionText: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '1.7',
        color: '#4a5568',
        textAlign: 'justify' as const,
        margin: 0,
    },
};