'use client';

import { useRouter } from 'next/navigation';
import { AlignCenter, ArrowLeft, LogOut, ChevronUp, Menu, X } from 'lucide-react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { text } from 'stream/consumers';
import { useState, useEffect } from 'react';

export default function RecursosAvisos() {
    const router = useRouter();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={styles.pageContainer}>
            <style jsx>{`
                .sidebar-link:hover {
                    text-decoration: underline;
                    background-color: rgba(255, 255, 255, 0.1);
                }
                .menu-button:hover {
                    background-color: #2a4a6f;
                }
                .close-button:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
            `}</style>
            {/* Header con navegación */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/sistemas-computacionales')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-700 cursor-pointer" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Recursos y avisos</h1>
                                <p className="text-sm text-gray-600">Sistemas computacionales</p>
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

            {/* Botón para abrir menú */}
            <div style={styles.menuButtonContainer}>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={styles.menuButton}
                    className="menu-button"
                    title="Tabla de contenidos"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    <span style={{ marginLeft: '8px' }}>Contenidos</span>
                </button>
            </div>

            {/* Menú desplegable */}
            {menuOpen && (
                <>
                    <div style={styles.overlay} onClick={() => setMenuOpen(false)} />
                    <aside style={styles.sidebarDropdown}>
                        <div style={styles.sidebarHeader}>
                            <h3 style={styles.sidebarTitle}>Tabla de Contenidos</h3>
                            <button onClick={() => setMenuOpen(false)} style={styles.closeButton} className="close-button">
                                <X size={20} />
                            </button>
                        </div>
                        <ul style={styles.sidebarList}>
                            <li>
                                <a href="#encargado" style={styles.sidebarLink} className="sidebar-link" onClick={() => setMenuOpen(false)}>
                                    Encargado
                                </a>
                            </li>
                            <li>
                                <a href="#coordinaciones" style={styles.sidebarLink} className="sidebar-link" onClick={() => setMenuOpen(false)}>
                                    Coordinaciones
                                </a>
                            </li>
                            <li>
                                <a href="#etc" style={styles.sidebarLink} className="sidebar-link" onClick={() => setMenuOpen(false)}>
                                    ETC
                                </a>
                            </li>
                            <li>
                                <a href="#calendario" style={styles.sidebarLink} className="sidebar-link" onClick={() => setMenuOpen(false)}>
                                    Calendario
                                </a>
                            </li>
                            <li>
                                <a href="#altasbajas" style={styles.sidebarLink} className="sidebar-link" onClick={() => setMenuOpen(false)}>
                                    Altas y Bajas
                                </a>
                            </li>
                            <li>
                                <a href="#lengua" style={styles.sidebarLink} className="sidebar-link" onClick={() => setMenuOpen(false)}>
                                    Lengua Extranjera
                                </a>
                            </li>
                            <li>
                                <a href="#casilleros" style={styles.sidebarLink} className="sidebar-link" onClick={() => setMenuOpen(false)}>
                                    Casilleros
                                </a>
                            </li>
                        </ul>
                    </aside>
                </>
            )}

            {/* Contenido principal */}
            <main style={styles.main}>
                <h1 className="text-2xl font-bold mb-4">Recursos y Avisos</h1>

                    <div id="encargado" style={styles.contenedorEncargadoSistemas}>
                        <p style={styles.contenedorEncargadoNombre}>
                            <strong>ISC Lilia Jimenez Cruz</strong>
                        </p>
                        <p style={styles.contenedorEncargadoContacto}>
                            Contacto: <a href="mailto:lilia.jimenez@upq.edu.mx" style={{ color: 'inherit', textDecoration: 'underline' }}>lilia.jimenez@upq.edu.mx</a>
                        </p>
                    </div>
                {/* Coordinación de Estancias y Estadías, Coordinación de Tutorías */}
                <div id="coordinaciones" style={styles.contenedorCoordinacion}>
                    <div style={styles.tarjeta}>
                        <div style={styles.imagenContenedor}>
                            <Image
                                src="/coordinacionEstanciasEstadias.jpg"
                                alt="Logo Estancias"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>

                        <p style={styles.tarjetaTitulo}>
                            <strong>Coordinación de Estancias y Estadías</strong>
                        </p>
                        <p style={styles.tarjetaTitulo}>
                            <strong>"Nombre de la persona"</strong>
                        </p>
                    </div>
                    <div style={styles.tarjeta}>
                        <div style={styles.imagenContenedor}>
                            <Image
                                src="/coordinacionTutorias.jpg"
                                alt="Logo Tutorías"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <p style={styles.tarjetaTitulo}>
                            <strong>Coordinación de Tutorías</strong>
                        </p>
                        <p style={styles.tarjetaTitulo}>
                            <strong>"Nombre de la persona"</strong>
                        </p>
                    </div>
                </div>
                {/* Coordinación de Proyectos Integradores */}
                <div style={styles.tarjetaProyectos}>
                    <div style={styles.imagenContenedorProyectos}>
                        <Image
                            src="/coordinacionPI.png"
                            alt="Logo Proyectos"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div style={styles.contenidoProyectos}>
                        <p style={styles.tarjetaTituloGrande}>
                            <strong>Coordinación de Proyectos Integradores</strong>
                        </p>
                        <p style={styles.tarjetaTitulo}>
                            <strong>Dra Cecilia Alvarado Salayanda</strong>
                        </p>
                        <p style={styles.tarjetaTitulo}>
                            Contacto: <a href="mailto:cecilia.alvarado@upq.mx" style={{ color: 'inherit', textDecoration: 'underline' }}>cecilia.alvarado@upq.mx</a>
                        </p>
                    </div>
                </div>
                {/* Criterios para solicitar un ETC */}
                <div id="etc" style={styles.contenedorETC}>
                    <h2 style={styles.tarjetaTituloGrande}>
                        <strong>Criterios para solicitar un ETC</strong>
                    </h2>
                    <ul className='list-disc list-inside mt-4 text-lg'>
                        <li>Haber aprobado al menos dos parciales cuando cursó la asignatura por primera vez.</li>
                        <li>No haber solicitado un ETC anteriormente para la misma asignatura.</li>
                        <li>Tener un promedio mínimo de 7.0 en la asignatura.</li>
                    </ul>
                </div>
                {/* Calendario Escolar */}
                <div id="calendario" style={styles.contenedorCalendario}>
                    <h2 style={styles.tarjetaTituloGrande}>
                        <strong>Calendario Escolar</strong>
                    </h2>
                    <div style={styles.imagenContenedorCalendario}>
                        <Image
                            src="/calendario2025-2026.png"
                            alt="Calendario Escolar"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>
                {/*Altas y bajas de materias*/}
                <div id="altasbajas" style={styles.contenedorAltasBajasMaterias}>
                    <h2 style={styles.tarjetaTituloGrande}>
                        <strong>Altas y Bajas de Materias</strong>
                    </h2>
                    <ul className='list-disc list-inside mt-4 text-lg'>
                        <li>Revisar carga académica con su tutor.</li>
                        <li>Si tiene asignaturas reprobadas o sin cursar en el ciclo anterior, no podrá cambiar de ciclo de formación.</li>
                        <li>Si hay materias del ciclo que cursará que no le aparecen en el SII, el tutor deberá solicitarlas con el Formato de ALTAS Y BAJAS  a la Dirección de Programa.</li>
                        <li>No es posible dar de alta varias Estancias en el mismo cuatrimestre.</li>
                        <li>Revisar carga académica con sus estudiantes - semana 1</li>
                        <li>Asegurarse de que todos sus alumnos tengan su carga académica al 100% antes de cerrar el período de altas y bajas indicado en el calendario.</li>
                        <li>Pueden solicitar ETC's de INGLÉS</li>
                        <li>Este cuatrimestre se abrirán todos los intensivos de INGLÉS ( Motivemos a que los estudiantes salgan del rezago de inglés)</li>
                        <li>Formulario de Registro:   <a href="https://forms.gle/6mzeEmkYbU2MboKBA" style={{ textDecoration: 'underline', color: '#431d2a' }}>https://forms.gle/6mzeEmkYbU2MboKBA</a> </li>
                        <li>Si alguien puede acreditar su inglés con TOEFL, Certificaciones o algún otro curso externo, acercarse a Lengua Extranjera para que validen el caso</li>
                    </ul>
                </div>
                {/*Avisos de lengua extranjera*/}
                <div id="lengua" style={styles.contenedorAvisosLenguaExtranjera}>
                    <h2 style={styles.tarjetaTituloGrande}>
                        <strong>Avisos de Lengua Extranjera</strong>
                    </h2>
                    <ul className='list-disc list-inside mt-4 text-lg'>
                        <li>
                            Solicitar ETC's de Inglés en:
                            <a href="https://docs.google.com/spreadsheets/d/1UmV92-deFOLvl4mZ1KyE5tYnue3bbDLACB3cYxPIhCk/edit?usp=sharing" style={{ textDecoration: 'underline', marginLeft: 4, color: 'inherit' }}>
                                https://docs.google.com/spreadsheets/d/1UmV92-deFOLvl4mZ1KyE5tYnue3bbDLACB3cYxPIhCk/edit?usp=sharing
                            </a>
                        </li>
                        <li>
                            Intensivos de Inglés — FECHA LÍMITE PARA SOLICITAR:
                            <ul className='list-disc list-inside mt-2 ml-4'>
                                <li>Niveles 1-2-3 — Alumnos de 2do y 3er ciclo, generaciones anteriores — Lunes a viernes de 11:10am a 1:40pm.</li>
                                <li>Niveles 4-5-6 — Alumnos de 3er ciclo, generaciones anteriores — Lunes a viernes de 11:10am a 1:40pm.</li>
                                <li>Niveles 7-8-9 — Generaciones 18 y anteriores — Lunes a viernes de 6:10pm a 8:40pm.</li>
                            </ul>
                        </li>
                        <li>
                            Informes: juana.aguilera@upq.mx (Srita. Gabriela Aguilera)
                        </li>
                        <li>Inicio: 16 de septiembre.</li>
                    </ul>
                </div>
                {/* Solicitudes de casilleros para profesores */}
                <div id="casilleros" style={styles.contenedorSolicitudesCasilleros}>
                    <h2 style={styles.tarjetaTituloGrande}>
                        <strong>Solicitudes de Casilleros para Profesores</strong>
                    </h2>
                    <p style={{ marginTop: '16px', fontSize: '18px', lineHeight: '1.8', color: '#333' }}>
                        Solicitar en el siguiente enlace:
                        <br />
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSejOw3kEc2K9DtocoxcX3g83LEYWTugt8H3I02LyYtM4jjgIw/viewform " style={{ textDecoration: 'underline', marginLeft: 4, color: '#431d2a' }}>
                            https://docs.google.com/forms/d/e/1FAIpQLSejOw3kEc2K9DtocoxcX3g83LEYWTugt8H3I02LyYtM4jjgIw/viewform
                        </a>
                    </p>
                </div>
            </main>

            {/* Botón Volver Arriba */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    style={styles.scrollTopButton}
                    title="Volver al inicio"
                >
                    <ChevronUp size={24} />
                </button>
            )}

            <Footer />
        </div>
    );
}

// Estilos básicos
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
        padding: '24px',
        width: '100%',
    },
    menuButtonContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 24px 0 24px',
        width: '100%',
    },
    menuButton: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1e3a5f',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '16px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(30, 58, 95, 0.2)',
        transition: 'all 0.3s ease',
    },
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
    sidebarDropdown: {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1e3a5f',
        color: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: 101,
        minWidth: '300px',
        maxWidth: '90%',
        maxHeight: '80vh',
        overflowY: 'auto' as const,
    },
    sidebarHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    sidebarTitle: {
        fontSize: '18px',
        fontWeight: 700,
        margin: 0,
        color: 'inherit',
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        transition: 'all 0.2s',
    },
    sidebarList: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
    },
    sidebarLink: {
        display: 'block',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 500,
        padding: '12px 16px',
        transition: 'all 0.2s',
        borderRadius: '6px',
        marginBottom: '4px',
    },
    scrollTopButton: {
        position: 'fixed' as const,
        bottom: '32px',
        right: '32px',
        backgroundColor: '#1e3a5f',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(30, 58, 95, 0.3)',
        transition: 'all 0.3s ease',
        zIndex: 50,
    },
    contenedorEncargadoSistemas: {
        marginBottom: 16,
        paddingTop: '30px',
        paddingBottom: '30px',
        paddingLeft: '30px',
        paddingRight: '30px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        backgroundColor: '#1e3a5f',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contenedorCoordinacion: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginTop: '24px',
        padding: '24px',
        borderRadius: 8,
        backgroundColor: '#e1dfdb',
    },
    tarjeta: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        textAlign: 'center' as const,
        backgroundColor: '#f9f9f9',
        transition: 'all 0.3s ease',
    },
    imagenContenedor: {
        position: 'relative' as const,
        width: '100%',
        height: '250px',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    tarjetaTitulo: {
        marginTop: '16px',
        fontSize: 18,
        fontWeight: 600,
        color: 'inherit',
    },
    tarjetaTituloGrande: {
        marginTop: '16px',
        fontSize: 24,
        fontWeight: 600,
        color: 'inherit',
        textAlign: 'center' as const,
    },
    contenedorEncargadoNombre: {
        fontSize: 18,
        fontWeight: 600,
    },
    contenedorEncargadoContacto: {
        fontSize: 18,
        fontWeight: 600,
    },
    tarjetaProyectos: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        backgroundColor: '#431d2a',
        color: '#fff',
        transition: 'all 0.3s ease',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        marginTop: '24px',
    },
    imagenContenedorProyectos: {
        position: 'relative' as const,
        flex: 1,
        height: '450px',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    contenidoProyectos: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'flex-start',
        textAlign: 'center' as const,
        flex: 1,
    },
    contenedorETC: {
        marginTop: '24px',
        paddingBottom: '30px',
        paddingLeft: '30px',
        paddingRight: '30px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        backgroundColor: '#e1dfdb',
    },
    contenedorCalendario: {
        marginTop: '24px',
        paddingTop: '30px',
        paddingBottom: '30px',
        paddingLeft: '30px',
        paddingRight: '30px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        backgroundColor: '#1e3a5f',
        color: '#fff',
    },
    imagenContenedorCalendario: {
        position: 'relative' as const,
        width: '100%',
        height: '800px',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '20px',
    },
    contenedorAltasBajasMaterias: {
        marginTop: '24px',
        paddingBottom: '30px',
        paddingLeft: '30px',
        paddingRight: '30px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        backgroundColor: '#e1dfdb',
    },
    contenedorAvisosLenguaExtranjera: {
        marginTop: '24px',
        paddingBottom: '30px',
        paddingLeft: '30px',
        paddingRight: '30px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        backgroundColor: '#1e3a5f',
        color: '#fff',
    },
    contenedorSolicitudesCasilleros: {
        marginTop: '24px',
        marginBottom: '40px',
        paddingBottom: '30px',
        paddingLeft: '30px',
        paddingRight: '30px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        backgroundColor: '#e1dfdb',
    },
};