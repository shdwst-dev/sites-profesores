'use client';

import { useRouter } from 'next/navigation';
import { ChevronUp, Menu, X, Mail, Phone, Users, Calendar, AlertCircle, Info, BookOpen, GraduationCap, MapPin, ExternalLink, ChevronRight, LayoutGrid, Check } from 'lucide-react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import SubHeader from '@/components/SubHeader';
import {
    getEncargadoTutorias,
    getCoordinacionPI,
    getCoordinacionEstancias,
    getCoordinacionTutores,
    getRecursosGenericos,
    getCalendario,
    getLenguaExtranjera
} from '@/lib/api';
import {
    EncargadoTutoria,
    Coordinacion,
    CoordinacionTutores,
    RecursoGenerico,
    CalendarioData,
    LenguaExtranjeraData
} from '@/types';

export default function TIIDRecursosAvisos() {
    const router = useRouter();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Data State
    const [encargadoTutorias, setEncargadoTutorias] = useState<EncargadoTutoria | null>(null);
    const [coordinacionPI, setCoordinacionPI] = useState<Coordinacion | null>(null);
    const [coordinacionEstancias, setCoordinacionEstancias] = useState<Coordinacion | null>(null);
    const [coordinacionTutores, setCoordinacionTutores] = useState<CoordinacionTutores | null>(null);
    const [casillerosData, setCasillerosData] = useState<RecursoGenerico | null>(null);
    const [altasBajasLink, setAltasBajasLink] = useState<string>('');
    const [altasBajasRules, setAltasBajasRules] = useState<string[]>([]);
    const [criteriosETC, setCriteriosETC] = useState<any[]>([]);
    const [recursamientosSteps, setRecursamientosSteps] = useState<{ step: string; text: string }[]>([]);
    const [recursamientosFecha, setRecursamientosFecha] = useState<string>('');
    const [recursamientosCosto, setRecursamientosCosto] = useState<string>('');
    const [lenguaExNiveles, setLenguaExNiveles] = useState<string[]>([]);
    const [calendarioData, setCalendarioData] = useState<CalendarioData | null>(null);
    const [lenguaExtranjera, setLenguaExtranjera] = useState<LenguaExtranjeraData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [encargado, pi, estancias, tutores, casilleros, calendario, lengua, altasBajas, criterios, recursamientos] = await Promise.all([
                    getEncargadoTutorias(),
                    getCoordinacionPI(),
                    getCoordinacionEstancias(),
                    getCoordinacionTutores(),
                    getRecursosGenericos('Casilleros'),
                    getCalendario(),
                    getLenguaExtranjera(),
                    getRecursosGenericos('AltasBajas'),
                    getRecursosGenericos('CriteriosETC'),
                    getRecursosGenericos('Recursamientos')
                ]);

                setEncargadoTutorias(encargado);
                setCoordinacionPI(pi);
                setCoordinacionEstancias(estancias);
                setCoordinacionTutores(tutores);
                setCasillerosData(casilleros);
                setCalendarioData(calendario);
                setLenguaExtranjera(lengua);

                // Altas y Bajas
                if (altasBajas && altasBajas.link) setAltasBajasLink(altasBajas.link);
                else setAltasBajasLink('https://forms.gle/6mzeEmkYbU2MboKBA');
                if (altasBajas?.content?.rules) setAltasBajasRules(altasBajas.content.rules);
                else setAltasBajasRules([
                    'Revisión obligatoria de carga académica con tutor.',
                    'Restricción de cambio de ciclo con materias reprobadas.',
                    'Solicitud formal mediante formato de ALTAS Y BAJAS.',
                    'Prohibición de múltiples estancias simultáneas.'
                ]);

                // Criterios ETC
                if (criterios?.content?.criterios) setCriteriosETC(criterios.content.criterios);
                else setCriteriosETC([
                    { title: 'Parciales', description: 'Aprobar al menos 2 parciales en curso normal.' },
                    { title: 'Historial', description: 'No haber solicitado ETC previo de la materia.' },
                    { title: 'Promedio', description: 'Tener un promedio mínimo acumulado de 7.0.' }
                ]);

                // Recursamientos
                if (recursamientos?.content?.steps) setRecursamientosSteps(recursamientos.content.steps);
                else setRecursamientosSteps([
                    { step: '01', text: 'Descarga de Solicitud en portal de documentos.' },
                    { step: '02', text: 'Obtención de firma de tutor y Director de Programa.' },
                    { step: '03', text: 'Pago oficial en portal de finanzas institucional.' },
                    { step: '04', text: 'Carga de comprobante y solicitud firmada.' }
                ]);
                if (recursamientos?.content?.fecha) setRecursamientosFecha(recursamientos.content.fecha);
                else setRecursamientosFecha('12 al 16 de Mayo, 2025');
                if (recursamientos?.content?.costo) setRecursamientosCosto(recursamientos.content.costo);
                else setRecursamientosCosto('$450.00 MXN');

                // Lengua Extranjera niveles
                if (lengua?.reports && (recursamientos?.content?.niveles || criterios?.content)) {
                    // niveles from lengua content if available
                }
                setLenguaExNiveles([
                    'Niveles 1-3: Alumnos de 2do/3er ciclo.',
                    'Niveles 4-6: Alumnos de 3er ciclo.',
                    'Niveles 7-9: Generación 18 y anteriores.'
                ]);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);

            const sections = ['encargado', 'coordinaciones', 'recursamientos', 'altasbajas', 'etc', 'calendario', 'lengua', 'casilleros'];
            const candidates: string[] = [];

            for (const id of sections) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        candidates.push(id);
                    }
                }
            }

            if (candidates.length > 0) {
                setActiveSection(prev => {
                    if (candidates.includes(prev)) return prev;
                    return candidates[0];
                });
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    const handleSectionClick = (id: string, e: React.MouseEvent) => {
        setActiveSection(id);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sections = [
        { id: 'encargado', label: 'Encargada de Tutorías', icon: Users },
        { id: 'coordinaciones', label: 'Coordinaciones', icon: LayoutGrid },
        { id: 'recursamientos', label: 'Recursamientos', icon: AlertCircle },
        { id: 'altasbajas', label: 'Altas y Bajas', icon: BookOpen },
        { id: 'etc', label: 'Criterios ETC', icon: Info },
        { id: 'calendario', label: 'Calendario Escolar', icon: Calendar },
        { id: 'lengua', label: 'Lengua Extranjera', icon: GraduationCap },
        { id: 'casilleros', label: 'Casilleros', icon: MapPin },
    ];

    if (loading) {
        return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Cargando recursos...</div>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#0f172a] selection:bg-indigo-500/30">
            <SubHeader
                title="Recursos y Avisos"
                subtitle={activeSection ? sections.find(s => s.id === activeSection)?.label : "TIID - Información Académica"}
                accentColor="#1e3a5f"
                backPath="/tiid"
            />

            <div className="flex-1 w-full max-w-[1400px] mx-auto flex gap-8 px-4 sm:px-6 lg:px-8 py-10">
                {/* Floating Table of Contents for Desktop */}
                <aside className="hidden xl:block w-64 shrink-0 sticky top-32 h-fit">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-2">Contenidos</h3>
                        <nav className="space-y-1">
                            {sections.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <a
                                        key={s.id}
                                        href={`#${s.id}`}
                                        onClick={(e) => handleSectionClick(s.id, e)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group
                                            ${activeSection === s.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                        `}
                                    >
                                        <Icon size={16} className={activeSection === s.id ? 'text-white' : 'group-hover:text-indigo-400'} />
                                        {s.label}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <div id="recursos-content" className="space-y-24">

                    {/* Section: Encargado */}
                    {encargadoTutorias && (
                        <section id="encargado" className="scroll-mt-32">
                            <div className="relative p-6 sm:p-10 bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                    <div className="w-32 h-32 rounded-3xl bg-indigo-600 shadow-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform overflow-hidden relative">
                                        {encargadoTutorias.image ? (
                                            <Image
                                                src={encargadoTutorias.image}
                                                alt={encargadoTutorias.name}
                                                unoptimized
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Users size={48} className="text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-3">Coordinación de Tutorías</span>
                                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">{encargadoTutorias.name}</h2>
                                        <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400">
                                            <a href={`mailto:${encargadoTutorias.correo}`} className="flex items-center gap-2 hover:text-indigo-400 transition-colors font-bold text-sm">
                                                <Mail size={16} /> {encargadoTutorias.correo}
                                            </a>
                                            <div className="hidden md:block w-1 h-1 bg-gray-700 rounded-full"></div>
                                            <div className="flex items-center gap-2 font-bold text-sm">
                                                <Phone size={16} /> Ext. {encargadoTutorias.ext}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Section: Coordinaciones */}
                    <section id="coordinaciones" className="scroll-mt-32 space-y-12">
                        {/* Proyecto integrador */}
                        {/* Proyecto integrador */}
                        {coordinacionPI && (
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-gray-100 group">
                                <div className="md:w-1/2 relative min-h-[300px] bg-slate-50 border-b md:border-b-0 md:border-r border-gray-50">
                                    <Image
                                        src={coordinacionPI.image}
                                        alt="Logo Proyectos"
                                        unoptimized
                                        fill
                                        className="p-8 object-contain group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white">
                                    <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-3 block">Innovación & Calidad</span>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">{coordinacionPI.title}</h3>
                                    <p className="text-slate-700 font-bold text-lg mb-6">{coordinacionPI.name}</p>
                                    <a href={`mailto:${coordinacionPI.correo}`} className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                                        <Mail size={14} /> {coordinacionPI.correo} <ChevronRight size={14} />
                                    </a>
                                </div>
                            </div>
                        )}
                        {/* Estancias y estadías */}
                        {coordinacionEstancias && (
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col-reverse md:flex-row border border-gray-100 group">
                                <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white">
                                    <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-3 block">Vinculación Académica</span>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">{coordinacionEstancias.title}</h3>
                                    <p className="text-slate-700 font-bold text-lg mb-6">{coordinacionEstancias.name}</p>
                                    {coordinacionEstancias.correo && (
                                        <a href={`mailto:${coordinacionEstancias.correo}`} className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                                            <Mail size={14} /> {coordinacionEstancias.correo} <ChevronRight size={14} />
                                        </a>
                                    )}
                                </div>
                                <div className="md:w-1/2 relative min-h-[300px] bg-slate-50 border-b md:border-b-0 md:border-l border-gray-50">
                                    <Image
                                        src={coordinacionEstancias.image}
                                        alt="Logo Estancias"
                                        unoptimized
                                        fill
                                        className="p-8 object-contain group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        )}


                        {coordinacionTutores && (
                            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/5">
                                <div className="lg:w-2/5 flex flex-col justify-center p-10 relative">
                                    <span className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-3 block">Asignación Académica</span>
                                    <h3 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">{coordinacionTutores.title}</h3>
                                    <h4 className="text-xl font-bold text-indigo-400 mb-8 opacity-80">{coordinacionTutores.period}</h4>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Nota</p>
                                            <p className="text-white font-medium text-sm leading-relaxed">{coordinacionTutores.note}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`lg:w-3/5 relative flex flex-col ${coordinacionTutores.tutors ? 'bg-slate-900/50' : 'bg-white min-h-[300px]'}`}>
                                    {coordinacionTutores.tutors ? (
                                        <div className="flex-1 w-full overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-indigo-500/20">
                                                        <th className="p-6 text-base font-black uppercase tracking-widest border-b border-indigo-500/50 w-32 sticky top-0 backdrop-blur-sm z-10 text-indigo-200">Grupo</th>
                                                        <th className="p-6 text-base font-black uppercase tracking-widest border-b border-indigo-500/50 sticky top-0 backdrop-blur-sm z-10 text-indigo-200">Tutor/a</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {coordinacionTutores.tutors.map((t, idx) => (
                                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                                            <td className="p-6 text-white font-bold text-sm border-r border-white/5">{t.group}</td>
                                                            <td className="p-6 text-gray-300 font-medium text-sm group-hover:text-white transition-colors">{t.tutor}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        coordinacionTutores.image && (
                                            <>
                                                <Image
                                                    src={coordinacionTutores.image}
                                                    alt="Tabla de Tutores TIID"
                                                    unoptimized
                                                    fill
                                                    className="object-cover md:object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-900/10 pointer-events-none"></div>
                                            </>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Section: Recursamientos */}
                    <section id="recursamientos" className="scroll-mt-32">
                        <div className="p-6 sm:p-10 bg-indigo-600 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                            {/* Background Decoration */}
                            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-12">
                                <div className="md:w-1/2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                        <AlertCircle size={14} /> Atención Académica
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-none">Proceso de <br /><span className="text-indigo-200">Recursamientos</span></h2>
                                    <p className="text-indigo-100 font-medium leading-relaxed mb-8">
                                        Para aquellos alumnos que requieren retomar asignaturas, se ha establecido un calendario y normativa específica.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="bg-white/10 border border-white/20 p-6 rounded-[2rem]">
                                            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Calendar size={14} /> Fecha Límite
                                            </h4>
                                            <p className="text-white text-xl font-bold">{recursamientosFecha}</p>
                                        </div>
                                        <div className="bg-white/15 p-6 rounded-[2rem]">
                                            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <AlertCircle size={14} /> Costo Unitario
                                            </h4>
                                            <p className="text-white text-xl font-bold">{recursamientosCosto}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-1/2 space-y-4">
                                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Pasos a seguir</h4>
                                    {recursamientosSteps.map((step) => (
                                        <div key={step.step} className="flex gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors border border-white/5">
                                            <span className="text-indigo-300 font-black text-sm">{step.step}</span>
                                            <p className="text-white text-sm font-bold leading-snug">{step.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Altas y Bajas */}
                    <section id="altasbajas" className="scroll-mt-32">
                        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-xl p-6 sm:p-10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <BookOpen size={28} />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Altas y Bajas</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    {altasBajasRules.map((text, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check size={14} />
                                            </div>
                                            <p className="text-slate-600 font-bold text-sm leading-relaxed">{text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                    <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-4">Registro Digital</h4>
                                    <p className="text-slate-500 text-xs font-medium mb-6">Complete el formulario de registro oficial para procesar su solicitud en tiempo y forma.</p>
                                    <a
                                        href={altasBajasLink}
                                        target="_blank"
                                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition-all group"
                                    >
                                        <span className="font-black text-xs uppercase tracking-widest">Portal de Registro</span>
                                        <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Criterios ETC */}
                    <section id="etc" className="scroll-mt-32">
                        <div className="bg-[#431d2a] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
                            <h2 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter">
                                <Info size={32} className="text-rose-400" />
                                Criterios ETC
                            </h2>
                            <div className="grid sm:grid-cols-3 gap-6">
                                {criteriosETC.map((c, i) => (
                                    <div key={i} className="p-6 bg-white/10 border border-white/5 rounded-3xl backdrop-blur-sm">
                                        <h4 className="text-rose-400 font-black text-xs uppercase tracking-widest mb-3">{c.title}</h4>
                                        <p className="text-white font-medium text-sm leading-relaxed opacity-80">{c.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section: Calendario */}
                    {calendarioData && (
                        <section id="calendario" className="scroll-mt-32">
                            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-xl p-6 sm:p-10">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                            <Calendar size={28} />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Calendario Institucional</h2>
                                    </div>
                                    <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">{calendarioData.cycle}</span>
                                </div>
                                <div className="relative w-full h-[350px] sm:h-[600px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200 group">
                                    <Image
                                        src={calendarioData.image}
                                        alt="Calendario Escolar"
                                        unoptimized
                                        fill
                                        className="object-contain p-4 group-hover:scale-[1.02] transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Section: Lengua Extranjera */}
                    {lenguaExtranjera && (
                        <section id="lengua" className="scroll-mt-32">
                            <div className="bg-slate-900 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 shadow-3xl text-white">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 bg-indigo-600 rounded-2xl">
                                        <GraduationCap size={28} />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">{lenguaExtranjera.title}</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4">Intensivos</h4>
                                            <div className="space-y-3">
                                                {lenguaExNiveles.map((t, i) => (
                                                    <div key={i} className="flex gap-3 text-sm font-medium opacity-80">
                                                        <div className="w-1 h-1 bg-indigo-400 rounded-full mt-2"></div>
                                                        {t}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Informes</p>
                                            <p className="text-white font-bold text-lg mb-1">{lenguaExtranjera.reports.name}</p>
                                            <p className="text-indigo-400 text-sm font-medium italic underline">{lenguaExtranjera.reports.correo}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex flex-col justify-between">
                                        <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-6">Solicitud Formal</h4>
                                        <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">Debe registrar su solicitud de ETC de Inglés en el formato oficial compartido por la academia.</p>
                                        <a
                                            href={lenguaExtranjera.requestLink}
                                            target="_blank"
                                            className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                                        >
                                            Acceder al Registro <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Section: Casilleros */}
                    {casillerosData && (
                        <section id="casilleros" className="scroll-mt-32 pb-20">
                            <div className="bg-gradient-to-br from-slate-200 to-slate-300 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 shadow-xl flex flex-col md:flex-row items-center gap-6 sm:gap-10">
                                <div className="md:w-1/2">
                                    <div className="p-3 bg-white rounded-2xl w-fit mb-6 shadow-sm">
                                        <MapPin size={28} className="text-slate-900" />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">{casillerosData.title}</h2>
                                    <p className="text-slate-600 font-bold text-sm leading-relaxed">{casillerosData.description}</p>
                                </div>
                                <div className="md:w-1/2 w-full">
                                    <a
                                        href={casillerosData.link}
                                        target="_blank"
                                        className="flex items-center justify-center gap-4 w-full py-6 bg-slate-900 text-white hover:bg-black rounded-3xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                                    >
                                        <LayoutGrid size={20} /> Solicitar espacio
                                    </a>
                                </div>
                            </div>
                        </section>
                    )}

                </div> {/* End recursos-content */}
            </div> {/* End flex wrapper */}

            {/* Mobile Menu Trigger */}
            <div className="fixed bottom-8 left-8 xl:hidden z-50">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-14 h-14 shadow-2xl active:scale-95 transition-all"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Backdrop */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md z-[60] xl:hidden flex items-center justify-center p-6 animate-in fade-in"
                    onClick={() => setMenuOpen(false)}
                >
                    <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-3xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white tracking-tight uppercase">Dashboard</h3>
                            <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <nav className="grid gap-3">
                            {sections.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <a
                                        key={s.id}
                                        href={`#${s.id}`}
                                        onClick={(e) => {
                                            setMenuOpen(false);
                                            handleSectionClick(s.id, e);
                                        }}
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl text-gray-300 font-bold hover:bg-indigo-600 hover:text-white transition-all"
                                    >
                                        <Icon size={20} />
                                        {s.label}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            {/* Scroll Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-indigo-600 text-white border-none rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-3xl transition-all duration-300 z-50 transform hover:scale-110 hover:shadow-indigo-500/40 active:scale-90"
                    title="Volver arriba"
                >
                    <ChevronUp size={24} />
                </button>
            )}

            <Footer />
        </div>
    );
}