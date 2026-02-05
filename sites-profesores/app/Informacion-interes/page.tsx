'use client';

import { useRouter } from 'next/navigation';
import { Bell, Calendar, FileText, Users, ExternalLink, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import SubHeader from '@/components/SubHeader';

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
            category: 'Institucional',
            color: 'bg-blue-600'
        },
        {
            id: 2,
            title: 'Actualización Sistema de Evaluación',
            date: '9 de Enero de 2026',
            content: 'Se han implementado mejoras en el sistema de captura de calificaciones. Revisa el manual actualizado.',
            category: 'Académico',
            color: 'bg-emerald-600'
        },
        {
            id: 3,
            title: 'Convocatoria Proyectos de Investigación',
            date: '8 de Enero de 2026',
            content: 'Abierta la convocatoria para proyectos de investigación aplicada. Plazo de inscripción hasta el 31 de enero.',
            category: 'Investigación',
            color: 'bg-purple-600'
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
        <div className="min-h-screen flex flex-col">
            <SubHeader
                title="Información de Interés"
                subtitle="Comunicados y Fechas"
                accentColor="#1e3a5f"
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-700">
                <div className="grid lg:grid-cols-3 gap-10">

                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Comunicados Section */}
                        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                            <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold text-white">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <Bell className="w-6 h-6 text-white" />
                                </div>
                                Comunicados Recientes
                            </h2>
                            <div className="space-y-6">
                                {comunicados.map((comm) => (
                                    <div
                                        key={comm.id}
                                        className="group rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`rounded-full ${comm.color} px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider`}>
                                                {comm.category}
                                            </span>
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {comm.date}
                                            </div>
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{comm.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{comm.content}</p>
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                                            <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline group/btn">
                                                Leer más <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trámites Section */}
                        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 p-8 shadow-2xl">
                            <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold text-white">
                                <div className="p-2 bg-amber-500 rounded-lg">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                Trámites y Procedimientos
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {tramites_y_procedimientos.map((procedure, index) => (
                                    <div
                                        key={index}
                                        className="group relative rounded-2xl bg-white/95 p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-b-4 border-amber-500/0 hover:border-amber-500"
                                    >
                                        <h3 className="mb-3 font-extrabold text-gray-800 text-lg group-hover:text-amber-600 transition-colors uppercase tracking-tight">{procedure.title}</h3>
                                        <p className="text-sm font-medium text-gray-600 leading-snug">{procedure.description}</p>
                                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-amber-600 text-xs font-bold flex items-center gap-1">
                                                Ver requisitos <ChevronRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tutores y Profesores Section */}
                        <div className="rounded-2xl bg-[#431d2a]/30 backdrop-blur-sm border border-white/10 p-2 shadow-2xl">
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Tutores Box */}
                                <div className="rounded-xl bg-white shadow-xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-[#431d2a] rounded-lg">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-black text-gray-800 tracking-tighter">Tutores</h2>
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-2">
                                                <a
                                                    href="https://www.youtube.com/watch?v=1oin1h4kdOg"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 font-bold text-gray-700 hover:text-[#431d2a] transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                                    <span className="text-sm">¿Qué son las tutorías académicas?</span>
                                                </a>
                                            </li>
                                            <li className="flex items-start gap-2 text-gray-400">
                                                <span className="text-xs italic font-medium">Recursos adicionales próximamente...</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="h-48 bg-gray-200 relative overflow-hidden mt-auto">
                                        <img
                                            src="/tutores-image.jpg"
                                            alt="Imagen Tutores"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                </div>

                                {/* Profesores Box */}
                                <div className="rounded-xl bg-white shadow-xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="h-48 bg-gray-200 relative overflow-hidden mb-auto">
                                        <img
                                            src="/profesores.jpg"
                                            alt="Imagen Profesores"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-[#1e3a5f] rounded-lg">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-black text-gray-800 tracking-tighter">Profesores</h2>
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-2">
                                                <a
                                                    href="https://www.uniandes.edu.co/es/oferta-academica"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 font-bold text-gray-700 hover:text-[#1e3a5f] transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                                    <span className="text-sm">Estrategias didácticas de vanguardia</span>
                                                </a>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <a
                                                    href="https://www.enso.edu.co/biblionline/archivos/3280.pdf"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 font-bold text-gray-700 hover:text-[#1e3a5f] transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                                    <span className="text-sm">Mejora de la disciplina en el aula</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Fechas Importantes Section */}
                        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 shadow-2xl">
                            <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
                                <Calendar className="w-6 h-6 text-purple-400" />
                                Fechas Importantes
                            </h2>
                            <div className="space-y-4">
                                {fechas_importantes.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`group rounded-xl p-4 transition-all duration-300 bg-white border-l-[6px] shadow-md hover:shadow-xl hover:-translate-x-1 ${item.urgent ? 'border-red-500' : 'border-purple-500'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`text-center min-w-[50px] flex flex-col items-center justify-center h-12 rounded-lg ${item.urgent ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'
                                                }`}>
                                                <span className="font-black text-lg leading-none">{item.date.split(' ')[0]}</span>
                                                <span className="text-[10px] font-bold uppercase">{item.date.split(' ')[1] || ''}</span>
                                            </div>
                                            <p className={`text-sm font-bold leading-tight ${item.urgent ? 'text-gray-900' : 'text-gray-800'}`}>
                                                {item.event}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contactos Section */}
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-8 border border-yellow-200/50 shadow-xl relative overflow-hidden group">
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-amber-900 tracking-tight">
                                <Users className="w-6 h-6 text-amber-600" />
                                Contactos
                            </h3>
                            <div className="space-y-6">
                                <div className="relative z-10">
                                    <p className="font-extrabold text-amber-900 text-sm uppercase tracking-wider mb-1">Dirección de Carrera</p>
                                    <p className="text-amber-800 font-bold mb-1">direccion@upq.edu.mx</p>
                                    <div className="inline-block px-2 py-0.5 bg-amber-200 rounded text-[10px] font-black text-amber-900">EXT. 100</div>
                                </div>
                                <div className="relative z-10 pt-4 border-t border-amber-900/10">
                                    <p className="font-extrabold text-amber-900 text-sm uppercase tracking-wider mb-1">Servicios Escolares</p>
                                    <p className="text-amber-800 font-bold mb-1">escolares@upq.edu.mx</p>
                                    <div className="inline-block px-2 py-0.5 bg-amber-200 rounded text-[10px] font-black text-amber-900">EXT. 200</div>
                                </div>
                                <div className="relative z-10 pt-4 border-t border-amber-900/10">
                                    <p className="font-extrabold text-amber-900 text-sm uppercase tracking-wider mb-1">Soporte Técnico</p>
                                    <p className="text-amber-800 font-bold mb-1">soporte@upq.edu.mx</p>
                                    <div className="inline-block px-2 py-0.5 bg-amber-200 rounded text-[10px] font-black text-amber-900">EXT. 300</div>
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