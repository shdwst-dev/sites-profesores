'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, FileText, Bell } from 'lucide-react';
import Footer from '@/components/Footer';

export default function SistemasComputacionales() {
    const router = useRouter();

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
                                <h1 className="text-xl font-bold text-gray-900">Sistemas Computacionales</h1>
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
                    {/* Card 1 */}
                    <div style={styles.card}>
                        <div style={{ ...styles.cardTop, ...styles.redGradient }}>
                            <FileText size={36} color="#fff" />
                            <h2 style={styles.cardTitle}>Formatos y Documentos</h2>
                        </div>
                        <div style={styles.cardBottom}>
                            <p style={styles.cardText}>Subir entregables y documentos requeridos</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div style={styles.card}>
                        <div style={{ ...styles.cardTop, ...styles.blueGradient }}>
                            <Bell size={36} color="#fff" />
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
                            Formamos profesionales capaces de diseñar, construir y gestionar sistemas de tecnología de la información que transformen organizaciones y mejoren vidas. Con un enfoque en la innovación, la eficiencia y el factor humano, preparémoslos para liderar en un mundo globalizado, creando soluciones que no solo funcionen, sino que inspiren. ¡El futuro es suyo para construirlo!
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
        flexDirection: 'column' as const,
        gap: '12px',
    },
    redGradient: {
        background: 'linear-gradient(135deg, #d80f32 0%, #a10c28 100%)',
    },
    blueGradient: {
        background: 'linear-gradient(135deg, #0a4a8c 0%, #06396b 100%)',
    },
    cardTitle: {
        fontSize: '22px',
        fontWeight: 700,
        margin: 0,
    },
    cardBottom: {
        backgroundColor: '#fff',
        padding: '20px 28px 24px',
    },
    cardText: {
        margin: 0,
        fontSize: '17px',
        color: '#4a5568',
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
        fontSize: '32px',
        fontWeight: 700,
        color: '#1a202c',
        marginBottom: '20px',
        marginTop: 0,
    },
    misionText: {
        fontSize: '16px',
        lineHeight: '1.7',
        color: '#4a5568',
        textAlign: 'justify' as const,
        margin: 0,
    },
}