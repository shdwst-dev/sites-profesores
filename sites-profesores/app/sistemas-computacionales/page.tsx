'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, FileText, Bell } from 'lucide-react';

export default function SistemasComputacionales() {
    const router = useRouter();

    return (
        <div>
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
                <div>
                    <h2>Información de la carrera</h2>
                    <h3>Objetivo</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro eos aperiam totam qui autem quam exercitationem magni commodi! Nisi ipsam maxime voluptatibus nostrum explicabo a recusandae facilis dolores ipsum in?</p>
                    <h3>Áreas de competencia</h3>
                    <ul>
                        <li>- Área 1</li>
                        <li>- Área 2</li>
                        <li>- Área 3</li>
                    </ul>
                    <ul>
                        <li>- Área 4</li>
                        <li>- Área 5</li>
                    </ul>
                    <h3>Datos de Contacto</h3>
                    <p>Coordinación:</p>
                    <p>Teléfono:</p>
                    <p>Horario de atención:</p>
                </div>
            </main>
        </div>
    );
}

const styles = {
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 24px 40px',
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
}