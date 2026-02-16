'use client';

import { useRouter } from 'next/navigation';
import { ChevronUp, Menu, X, Mail, Phone, Users, Calendar, AlertCircle, Info, BookOpen, GraduationCap, MapPin, ExternalLink, ChevronRight, LayoutGrid, Briefcase, Check } from 'lucide-react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import SubHeader from '@/components/SubHeader';

import Link from 'next/link';
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

export default function SistemasRecursosAvisos() {
    const router = useRouter();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Data State
    const [encargadoTutorias, setEncargadoTutorias] = useState<EncargadoTutoria | null>(null);
    const [coordinacionPI, setCoordinacionPI] = useState<Coordinacion | null>(null);
    const [coordinacionEstancias, setCoordinacionEstancias] = useState<Coordinacion | null>(null);
    const [coordinacionTutores, setCoordinacionTutores] = useState<CoordinacionTutores | null>(null);
    const [calendarioData, setCalendarioData] = useState<CalendarioData | null>(null);
    const [lenguaExtranjera, setLenguaExtranjera] = useState<LenguaExtranjeraData | null>(null);
    const [casillerosData, setCasillerosData] = useState<RecursoGenerico | null>(null);
    const [altasBajasLink, setAltasBajasLink] = useState<string>('https://forms.gle/6mzeEmkYbU2MboKBA');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [encargado, pi, estancias, tutores, calendario, lengua, casilleros, altasBajas] = await Promise.all([
                    getEncargadoTutorias('Sistemas'),
                    getCoordinacionPI('Sistemas'),
                    getCoordinacionEstancias('Sistemas'),
                    getCoordinacionTutores('Sistemas'),
                    getCalendario('Sistemas'),
                    getLenguaExtranjera('Sistemas'),
                    getRecursosGenericos('Casilleros', 'Sistemas'),
                    getRecursosGenericos('AltasBajas', 'Sistemas')
                ]);

                setEncargadoTutorias(encargado);
                setCoordinacionPI(pi);
                setCoordinacionEstancias(estancias);
                setCoordinacionTutores(tutores);
                setCalendarioData(calendario);
                setLenguaExtranjera(lengua);
                setCasillerosData(casilleros);
                if (altasBajas && altasBajas.link) setAltasBajasLink(altasBajas.link);

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

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#0f172a] selection:bg-rose-500/30">
            <SubHeader
                title="Recursos y Avisos"
                subtitle={activeSection ? sections.find(s => s.id === activeSection)?.label : "Sistemas - Información Académica"}
                accentColor="#431d2a"
                backPath="/sistemas-computacionales"
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
                                            ${activeSection === s.id ? 'bg-rose-700 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                        `}
                                    >
                                        <Icon size={16} className={activeSection === s.id ? 'text-white' : 'group-hover:text-rose-400'} />
                                        {s.label}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <div id="recursos-content" className="flex-1 min-w-0 space-y-24 animate-in fade-in duration-700">

                    {/* Section: Encargado */}
                    {/* Section: Encargado */}
                    {encargadoTutorias && (
                        <section id="encargado" className="scroll-mt-32">
                            <div className="relative p-10 bg-gradient-to-br from-rose-950/60 to-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                    <div className="w-32 h-32 rounded-3xl bg-rose-700 shadow-2xl flex items-center justify-center transform group-hover:-rotate-3 transition-transform overflow-hidden relative">
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
                                        <span className="inline-block px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-3">Dirección de Tutorías</span>
                                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{encargadoTutorias.name}</h2>
                                        <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400">
                                            <a href={`mailto:${encargadoTutorias.correo}`} className="flex items-center gap-2 hover:text-rose-400 transition-colors font-bold text-sm">
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
                        {coordinacionPI && (
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-gray-100 group">
                                <div className="md:w-1/2 relative min-h-[300px] bg-rose-50 border-b md:border-b-0 md:border-r border-gray-50">
                                    <Image
                                        src={coordinacionPI.image}
                                        alt="Logo Proyectos"
                                        unoptimized
                                        fill
                                        className="p-8 object-contain group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white">
                                    <span className="text-rose-600 font-black text-[10px] uppercase tracking-widest mb-3 block">Innovación & Calidad</span>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">{coordinacionPI.title}</h3>
                                    <p className="text-slate-700 font-bold text-lg mb-6">{coordinacionPI.name}</p>
                                    <a href={`mailto:${coordinacionPI.correo}`} className="inline-flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                                        <Mail size={14} /> {coordinacionPI.correo} <ChevronRight size={14} />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Estancias y estadías */}
                        {coordinacionEstancias && (
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col-reverse md:flex-row border border-gray-100 group">
                                <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white">
                                    <span className="text-rose-600 font-black text-[10px] uppercase tracking-widest mb-3 block">Vinculación Académica</span>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">{coordinacionEstancias.title}</h3>
                                    <p className="text-slate-700 font-bold text-lg mb-6">{coordinacionEstancias.name}</p>
                                    {coordinacionEstancias.correo && (
                                        <a href={`mailto:${coordinacionEstancias.correo}`} className="inline-flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                                            <Mail size={14} /> {coordinacionEstancias.correo} <ChevronRight size={14} />
                                        </a>
                                    )}
                                </div>
                                <div className="md:w-1/2 relative min-h-[300px] bg-rose-50 border-b md:border-b-0 md:border-l border-gray-50">
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

                        {/* Tutores Table */}
                        {coordinacionTutores && (
                            <div className="bg-gradient-to-br from-slate-900 to-rose-950 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/5">
                                <div className="lg:w-2/5 flex flex-col justify-center p-10 relative">
                                    <span className="text-rose-400 font-black text-[10px] uppercase tracking-widest mb-3 block">Asignación Académica</span>
                                    <h3 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">{coordinacionTutores.title}</h3>
                                    <h4 className="text-xl font-bold text-rose-400 mb-8 opacity-80">{coordinacionTutores.period}</h4>
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
                                                    <tr className="bg-rose-500/20">
                                                        <th className="p-6 text-base font-black uppercase tracking-widest border-b border-rose-500/50 w-32 sticky top-0 backdrop-blur-sm z-10 text-rose-200">Grupo</th>
                                                        <th className="p-6 text-base font-black uppercase tracking-widest border-b border-rose-500/50 sticky top-0 backdrop-blur-sm z-10 text-rose-200">Tutor/a</th>
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
                                                    alt="Tabla de Tutores Sistemas"
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
                        <div className="p-10 bg-rose-600 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                            {/* Background Decoration */}
                            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-12">
                                <div className="md:w-1/2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                        <AlertCircle size={14} /> Atención Académica
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-none">Proceso de <br /><span className="text-rose-200">Recursamientos</span></h2>
                                    <p className="text-rose-100 font-medium leading-relaxed mb-8">
                                        Para aquellos alumnos que requieren retomar asignaturas, se ha establecido un calendario y normativa específica.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="bg-white/10 border border-white/20 p-6 rounded-[2rem]">
                                            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Calendar size={14} /> Fecha Límite
                                            </h4>
                                            <p className="text-white text-xl font-bold">12 al 16 de Mayo, 2025</p>
                                        </div>
                                        <div className="bg-white/15 p-6 rounded-[2rem]">
                                            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <AlertCircle size={14} /> Costo Unitario
                                            </h4>
                                            <p className="text-white text-xl font-bold">$450.00 MXN</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-1/2 space-y-4">
                                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Pasos a seguir</h4>
                                    {[
                                        { step: '01', text: 'Descarga de Solicitud en portal de documentos.' },
                                        { step: '02', text: 'Obtención de firma de tutor y Director de Programa.' },
                                        { step: '03', text: 'Pago oficial en portal de finanzas institucional.' },
                                        { step: '04', text: 'Carga de comprobante y solicitud firmada.' }
                                    ].map((step) => (
                                        <div key={step.step} className="flex gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors border border-white/5">
                                            <span className="text-rose-300 font-black text-sm">{step.step}</span>
                                            <p className="text-white text-sm font-bold leading-snug">{step.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Altas y Bajas */}
                    <section id="altasbajas" className="scroll-mt-32">
                        <div className="bg-gradient-to-br from-rose-900/80 to-slate-950 p-12 rounded-[3rem] border border-white/10 shadow-3xl text-white">
                            <h2 className="text-3xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter">
                                <div className="p-3 bg-white/10 rounded-2xl"><BookOpen size={28} /></div>
                                Proceso Administrativo
                            </h2>
                            <div className="grid md:grid-cols-2 gap-12">
                                <ul className="space-y-5">
                                    {[
                                        'Validación previa con tutor académico.',
                                        'Restricción para alumnos con adeudos.',
                                        'Uso obligatorio del formato institucional.',
                                        'Revisión de carga al 100% en SII.'
                                    ].map((step, i) => (
                                        <li key={i} className="flex gap-4 items-start text-sm font-bold border-b border-white/5 pb-4">
                                            <span className="text-rose-400">0{i + 1}</span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex flex-col justify-between">
                                    <h4 className="text-rose-400 font-black text-[10px] uppercase tracking-widest mb-4">Registro Externo</h4>
                                    <p className="text-gray-400 text-xs font-medium mb-8">Acceda al formulario oficial para el registro de solicitudes de altas y bajas del cuatrimestre.</p>
                                    <a
                                        href={altasBajasLink}
                                        target="_blank"
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-white text-rose-900 hover:bg-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
                                    >
                                        Portal SII Forms <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: ETC */}
                    <section id="etc" className="scroll-mt-32">
                        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl"></div>
                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                <div className="md:w-1/3">
                                    <div className="p-6 bg-rose-700/20 border border-rose-500/30 rounded-[2rem] w-fit mb-6">
                                        <Info className="text-rose-400" size={32} />
                                    </div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4">Criterios <br />de <span className="text-rose-400">ETC</span></h2>
                                    <p className="text-gray-400 text-sm font-medium leading-relaxed">Lineamientos obligatorios para la Evaluación a Título de Competencia en Sistemas.</p>
                                </div>
                                <div className="md:w-2/3 grid gap-4">
                                    {[
                                        { text: 'Aprobar al menos dos parciales en el curso ordinario.', icon: Check },
                                        { text: 'No haber solicitado ETC previamente para la misma asignatura.', icon: Check },
                                        { text: 'Tener un promedio mínimo de 7.0 en la asignatura.', icon: Check }
                                    ].map((c, i) => (
                                        <div key={i} className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                                                <c.icon size={14} />
                                            </div>
                                            <p className="text-white font-bold text-sm">{c.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Calendario */}
                    {calendarioData && (
                        <section id="calendario" className="scroll-mt-32">
                            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-12">
                                <div className="flex items-center justify-between mb-12">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Cronograma Escolar</h2>
                                    <div className="px-5 py-2 bg-rose-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Vigente: {calendarioData.cycle}</div>
                                </div>
                                <div className="relative w-full h-[600px] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-200 group">
                                    <Image
                                        src={calendarioData.image}
                                        alt="Calendario Escolar"
                                        unoptimized
                                        fill
                                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Section: Lengua Extranjera */}
                    {/* Section: Lengua Extranjera */}
                    {lenguaExtranjera && (
                        <section id="lengua" className="scroll-mt-32">
                            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl p-12">
                                <div className="flex items-center gap-5 mb-12">
                                    <div className="p-4 bg-rose-50 rounded-2xl text-rose-700 shadow-sm">
                                        <GraduationCap size={32} />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{lenguaExtranjera.title}</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                        <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-6">Información General</h4>
                                        <div className="space-y-4">
                                            <p className="text-slate-600 text-sm font-bold flex gap-3">
                                                <span className="w-1.5 h-1.5 bg-rose-700 rounded-full mt-2"></span>
                                                Exámenes TOEFL / Certificaciones acreditables.
                                            </p>
                                            <p className="text-slate-600 text-sm font-bold flex gap-3">
                                                <span className="w-1.5 h-1.5 bg-rose-700 rounded-full mt-2"></span>
                                                Intensivos de Inglés (Niveles 1 al 9).
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Contacto Directo</p>
                                        <p className="text-slate-900 font-black text-2xl mb-1">{lenguaExtranjera.reports.name}</p>
                                        <a href={`mailto:${lenguaExtranjera.reports.correo}`} className="text-rose-700 font-bold hover:underline">{lenguaExtranjera.reports.correo}</a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Section: Casilleros */}
                    {/* Section: Casilleros */}
                    {casillerosData && (
                        <section id="casilleros" className="scroll-mt-32 pb-20">
                            <div className="bg-slate-900 p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-3xl">
                                <div className="md:w-3/5">
                                    <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">{casillerosData.title}</h2>
                                    <p className="text-gray-400 font-medium leading-relaxed">{casillerosData.description}</p>
                                </div>
                                <div className="md:w-2/5 w-full">
                                    <a
                                        href={casillerosData.link}
                                        target="_blank"
                                        className="flex items-center justify-center gap-4 w-full py-6 bg-rose-700 hover:bg-rose-600 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105"
                                    >
                                        <MapPin size={20} /> Solicitar Casillero
                                    </a>
                                </div>
                            </div>
                        </section>
                    )}
                </div> {/* End resources-content */}
            </div> {/* End flex wrapper */}

            {/* Mobile Menu Trigger */}
            <div className="fixed bottom-8 left-8 xl:hidden z-50">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center justify-center bg-rose-700 text-white rounded-full w-14 h-14 shadow-2xl active:scale-95 transition-all"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Backdrop */}
            {
                menuOpen && (
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
                                            className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl text-gray-300 font-bold hover:bg-rose-600 hover:text-white transition-all"
                                        >
                                            <Icon size={20} />
                                            {s.label}
                                        </a>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                )
            }

            {/* Scroll Top Button */}
            {
                showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 bg-rose-700 text-white border-none rounded-full w-14 h-14 flex items-center justify-center shadow-2xl transition-all duration-300 z-50 transform hover:scale-110 active:scale-90"
                    >
                        <ChevronUp size={24} />
                    </button>
                )
            }

            <Footer />
        </div >
    );
}