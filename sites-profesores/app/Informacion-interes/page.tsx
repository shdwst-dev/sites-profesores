'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, Bell, Calendar, FileText, Users } from 'lucide-react';
import Footer from '@/components/Footer';

export default function InfoPage() {
    const router = useRouter();


    const fechas_importantes = [
        { date: '12 Ene', event: 'Fecha límite: Solicitudes y Cartas ETC (Tutores)', urgent: true },
        { date: '16 Ene', event: 'Fecha límite: Altas y bajas de materias', urgent: true },
        { date: '17 Ene', event: 'Reunión de Academia', urgent: false },
        { date: '20-24 Ene', event: 'Semana 3: Entrega Plan de actividades ETC', urgent: false },
        { date: '10 Feb', event: 'Primer corte de evaluación', urgent: false }
    ];

    const comunicados = [
        {
            id: 1,
            title: 'Comunicado Dirección General',
            date: '11 de Enero de 2026',
            content: 'Se informa sobre las nuevas políticas de movilidad académica y convenios internacionales para el año 2026.',
            category: 'Institucional'
        },
        {
            id: 2,
            title: 'Actualización Sistema de Evaluación',
            date: '9 de Enero de 2026',
            content: 'Se han implementado mejoras en el sistema de captura de calificaciones. Revisa el manual actualizado.',
            category: 'Académico'
        },
        {
            id: 3,
            title: 'Convocatoria Proyectos de Investigación',
            date: '8 de Enero de 2026',
            content: 'Abierta la convocatoria para proyectos de investigación aplicada. Plazo de inscripción hasta el 31 de enero.',
            category: 'Investigación'
        }
    ];

    const tramites_y_procedimientos = [
        {
            title: 'Justificantes de Estudiantes',
            description: 'Proceso para validar justificantes médicos y administrativos'
        },
        {
            title: 'Solicitud de Material Didáctico',
            description: 'Requisitos para solicitar material y equipo de laboratorio'
        },
        {
            title: 'Registro de Actividades Extracurriculares',
            description: 'Formato para documentar actividades complementarias'
        },
        {
            title: 'Asesorías y Tutorías',
            description: 'Lineamientos para el registro de horas de asesoría'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
                                <h1 className="text-xl font-bold text-gray-900">Información de Interés</h1>
                                <p className="text-sm text-gray-600">Comunicados y fechas importantes</p>
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


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-8">
                        <div style={{ backgroundColor: '#1e3a5f', color: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'inherit', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Bell />
                                Comunicados Recientes
                            </h2>
                            <div className="space-y-4">
                                {comunicados.map((comm) => (
                                    <div
                                        key={comm.id}
                                        className="rounded-xl shadow-sm border p-6 hover:shadow-md transition-all"
                                        style={{ backgroundColor: '#f9f9f9', borderColor: '#e5e7eb' }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 style={{ fontWeight: 600, fontSize: '18px', color: '#333', margin: 0 }}>{comm.title}</h3>
                                            <span className="px-3 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: '#1e3a5f', color: '#fff' }}>
                                                {comm.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm mb-3" style={{ color: '#666' }}>
                                            <Calendar />
                                            {comm.date}
                                        </div>
                                        <p style={{ color: '#333' }}>{comm.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div style={{ backgroundColor: '#e1dfdb', padding: '30px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '24px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#333', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText />
                                Trámites y Procedimientos
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {tramites_y_procedimientos.map((procedure, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl shadow-sm border p-5 hover:shadow-md transition-all cursor-pointer"
                                        style={{ backgroundColor: '#f9f9f9', borderColor: '#e5e7eb' }}
                                    >
                                        <h3 className="font-bold mb-2" style={{ color: '#333' }}>{procedure.title}</h3>
                                        <p className="text-sm" style={{ color: '#666' }}>{procedure.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tutores y Profesores */}
                        <div className="grid md:grid-cols-2 gap-6" style={{ backgroundColor: '#431d2a', padding: '30px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '24px' }}>
                            <div className="rounded-xl shadow-sm border overflow-hidden flex flex-col" style={{ backgroundColor: '#f9f9f9'}}>
                                {/* Tutores */}
                                <div className="p-6">
                                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#333', marginBottom: '24px' }}>Tutores</h2>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold" style={{ color: '#431d2a' }}>•</span>
                                            <a
                                                href="https://www.youtube.com/watch?v=1oin1h4kdOg"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-semibold hover:underline transition-colors"
                                                style={{ color: '#431d2a' }}
                                            >
                                                ¿Qué son las tutorías académicas?
                                            </a>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold" style={{ color: '#431d2a' }}>•</span>
                                            <a 
                                                href="https://www.youtube.com/watch?v=sDk1pTDPROI" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="font-semibold hover:underline transition-colors"
                                                style={{ color: '#431d2a' }}
                                            >
                                                Todo el mundo debería saber programar.
                                            </a>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold" style={{ color: '#431d2a' }}>•</span>
                                            <a 
                                                href="https://www.youtube.com/watch?v=fYJ9VtBt7lQ" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="font-semibold hover:underline transition-colors"
                                                style={{ color: '#431d2a' }}
                                            >
                                                La vida es maravillosa.
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex-1 bg-gray-200 relative overflow-hidden">
                                    <img 
                                        src="/profesores.jpg" 
                                        alt="Tutores" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Profesores */}
                            <div className="rounded-xl shadow-sm border overflow-hidden flex flex-col" style={{ backgroundColor: '#f9f9f9'}}>
                                <div className="flex-1 bg-gray-200 relative overflow-hidden">
                                    <img 
                                        src="/tutores-image.jpg" 
                                        alt="Profesores" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#333', marginBottom: '24px' }}>Profesores</h2>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold" style={{ color: '#431d2a' }}>•</span>
                                            <a 
                                                href="https://www.uniandes.edu.co/es/oferta-academica" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="font-semibold hover:underline transition-colors"
                                                style={{ color: '#431d2a' }}
                                            >
                                                Estrategias didácticas
                                            </a>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold" style={{ color: '#431d2a' }}>•</span>
                                            <a 
                                                href="https://www.youtube.com/watch?v=ejemplo2" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="font-semibold hover:underline transition-colors"
                                                style={{ color: '#431d2a' }}
                                            >
                                                Manual - Estrategias didácticas **LINK PENDIENTE**
                                            </a>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold" style={{ color: '#431d2a' }}>•</span>
                                            <a 
                                                href="https://www.enso.edu.co/biblionline/archivos/3280.pdf" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="font-semibold hover:underline transition-colors"
                                                style={{ color: '#431d2a' }}
                                            >
                                                Mejorar la disciplina en el aula
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#333', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar />
                                Fechas Importantes
                            </h2>
                            <div className="space-y-3">
                                {fechas_importantes.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-xl p-4 border-l-4 ${item.urgent
                                            ? 'bg-red-50 border-red-500'
                                            : 'bg-purple-50 border-purple-500 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`text-center min-w-[60px] ${item.urgent ? 'text-red-700' : 'text-purple-700'
                                                }`}>
                                                <div className="font-bold text-lg">{item.date.split(' ')[0]}</div>
                                                <div className="text-xs">{item.date.split(' ')[1] || ''}</div>
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${item.urgent ? 'text-red-900' : 'text-purple-900'
                                                    }`}>
                                                    {item.event}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                            <h3 style={{ fontWeight: 600, fontSize: '18px', color: '#874d33', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users className="w-5 h-5" />
                                Contactos Importantes
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium text-yellow-900">Dirección de Carrera</p>
                                    <p className="text-yellow-800">direccion@upq.edu.mx</p>
                                    <p className="text-yellow-700">Ext. 100</p>
                                </div>
                                <div className="border-t border-yellow-200 pt-3">
                                    <p className="font-medium text-yellow-900">Servicios Escolares</p>
                                    <p className="text-yellow-800">escolares@upq.edu.mx</p>
                                    <p className="text-yellow-700">Ext. 200</p>
                                </div>
                                <div className="border-t border-yellow-200 pt-3">
                                    <p className="font-medium text-yellow-900">Soporte Técnico</p>
                                    <p className="text-yellow-800">soporte@upq.edu.mx</p>
                                    <p className="text-yellow-700">Ext. 300</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}