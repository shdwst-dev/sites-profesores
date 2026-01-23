'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, Clock, Calendar, FileText, BookOpen, Table, CheckSquare, Book, Map, NotebookPen } from 'lucide-react';
import Footer from '@/components/Footer';

export default function FormatosDocumentos() {
    const router = useRouter();

    const entregables = [{
        titulo: 'Semana 1',
        items: [
            { nombre : 'Plan y Guía de asignatura firmados por estudiantes', fecha: 'Semana 1'},
            { nombre : 'Acta de trabajo en academia', fecha: 'Semana 1'},
            { nombre : 'Registrar códigos, plataformas, fechas de exámenes', fecha: 'Semana 1'}
        ],
    },
    {
        titulo: 'Plazos especiales',
        items: [
            { nombre : 'Altas y bajas de materias', fecha : 'Hasta el 16 de Enero de 2026'},
        ],
    },
    {
        titulo: 'Solo tutores',
        items: [
            { nombre : 'Solicitudes de ETC / Solo tutores', fecha : 'Hasta el 12 de Enero de 2026'},
            { nombre : 'Cartas de ETC / Solo tutores', fecha : 'Hasta el 12 de Enero de 2026'},
        ],
    },
    {
        titulo: 'Semana 3',
        items: [
            { nombre : 'Plan de actividades ETC', fecha : 'Semana 3'},
        ],
    }
    ];
    
    const formatos = [
        { nombre: 'Calendario 25 - 26', icono: Calendar, url: '/formatos/calendario.pdf' },
        { nombre: 'CARTA ETC - Evaluación a Título de Competencia', icono: FileText, url: '/formatos/carta-etc.pdf' },
        { nombre: 'Formato Academia', icono: BookOpen, url: '/formatos/formato-academia.pdf' },
        { nombre: 'Grupos y Horarios ENERO-ABRIL 2026', icono: Table, url: '/formatos/grupos-horarios.pdf' },
        { nombre: 'Guía Asignatura', icono: Book, url: '/formatos/guia-asignatura.pdf' },
        { nombre: 'Información Estancias y Estadías', icono: FileText, url: '/formatos/estancias-estadias.pdf' },
        { nombre: 'Lista de Asistencias Tutorías', icono: CheckSquare, url: '/formatos/lista-asistencias.pdf' },
        { nombre: 'Manuales de Asignatura', icono: BookOpen, url: '/formatos/manuales.pdf' },
        { nombre: 'Mapa Curricular', icono: Map, url: '/formatos/mapa-curricular.pdf' },
        { nombre: 'Plan de Asignatura', icono: NotebookPen, url: '/formatos/plan-asignatura.pdf' },
    ];

    return (
        <div style={styles.pageContainer}>
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
                                <h1 className="text-xl font-bold text-gray-900">Formatos y Documentos</h1>
                                <p className="text-sm text-gray-600">Sistemas Computacionales</p>
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

            {/* Contenido principal */}
            <main style={styles.main}>
                <h1 style={styles.titulo}>Entregables del cuatrimestre</h1>
                <h2 style={styles.subtitulo}>Sube tus entregables antes de la fecha límite indicada</h2>
                
                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {entregables.map((grupo) => (
                        <section key={grupo.titulo} style={styles.section}>
                            <div style={styles.sectionHeader}>
                                <span style={styles.sectionIcon}><Clock /></span>
                                <h3 style={styles.sectionTitle}>{grupo.titulo}</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {grupo.items.map((item) => (
                                    <div key={item.nombre} style={styles.card}>
                                        <div>
                                            <p style={styles.cardTitle}>{item.nombre}</p>
                                            <p style={styles.cardMeta}>
                                                <span style={{ marginRight: 4 }}><Clock /></span>
                                                {item.fecha}
                                            </p>
                                        </div>
                                        <div style={styles.actions}>
                                            <label style={styles.fileButton}>
                                                Seleccionar archivo
                                                <input type="file" style={{ display: 'none' }} />
                                            </label>
                                            <button style={styles.uploadButton}>Subir</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                    <br />
                </div>
                
                <h1 style={styles.titulo}>Consultar formatos</h1>
                <div style={styles.formatosList}>
                    {formatos.map((formato, index) => {
                        const IconComponent = formato.icono;
                        return (
                            <div 
                                key={`${formato.nombre}-${index}`} 
                                style={styles.formatoRow}
                                className='formato-row'
                                onClick={() => window.open(formato.url, '_blank')}
                            >
                                <IconComponent size={22} color="#1a4fb0" />
                                <span style={styles.formatoNombre} className='formato-nombre'>{formato.nombre}</span>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Footer reutilizable */}
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
        padding: '24px',
        width: '100%',
    },
    titulo: {
        fontSize: '24px',
        fontWeight: 600,
        color: '#333',
    },
    subtitulo: {
        fontSize: '18px',
        color: '#666',
        marginTop: '8px',
    },
    section: {
        background: '#f7f9fc',
        border: '1px solid #e5eaf2',
        borderRadius: 12,
        padding: 16,
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        color: '#1a4fb0',
        fontWeight: 700,
    },
    sectionIcon: { 
        fontSize: 16 
    },
    sectionTitle: { 
        fontSize: 16, 
        margin: 0 
    },
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        border: '1px solid #e8edf5',
        borderRadius: 10,
        padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        gap: 16,
        flexWrap: 'wrap' as const,
    },
    cardTitle: { 
        margin: 0, 
        fontWeight: 600, 
        color: '#1f2937',
        fontSize: '15px',
    },
    cardMeta: { 
        margin: 0, 
        fontSize: 12, 
        color: '#6b7280',
        display: 'flex',
        alignItems: 'center',
        marginTop: 4,
    },
    actions: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8 
    },
    fileButton: {
        background: '#f3f6fb',
        color: '#1f2937',
        border: '1px solid #e5eaf2',
        borderRadius: 8,
        padding: '8px 14px',
        fontSize: 13,
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.2s',
    },
    uploadButton: {
        background: '#e5e9f2',
        color: '#6b7280',
        border: 'none',
        borderRadius: 8,
        padding: '8px 16px',
        fontSize: 13,
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.2s',
    },
    formatosList: {
        marginTop: 20,
        marginBottom: 40,
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    formatoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'color 0.2s, transform 0.15s',
    },
    formatoNombre: {
        fontSize: 18,
        fontWeight: 600,
        color: '#374151',  
    },

};