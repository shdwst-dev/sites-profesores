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
    getRecursosGenericos,
    getCalendario,
    getLenguaExtranjera
} from '@/lib/api';
import {
    EncargadoTutoria,
    Coordinacion,
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
    const [calendarioData, setCalendarioData] = useState<CalendarioData | null>(null);
    const [lenguaExtranjera, setLenguaExtranjera] = useState<LenguaExtranjeraData | null>(null);
    const [casillerosData, setCasillerosData] = useState<RecursoGenerico | null>(null);
    const [altasBajasLink, setAltasBajasLink] = useState<string>('https://forms.gle/6mzeEmkYbU2MboKBA');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [encargado, pi, calendario, lengua, casilleros, altasBajas] = await Promise.all([
                    getEncargadoTutorias('Sistemas'),
                    getCoordinacionPI('Sistemas'),
                    getCalendario('Sistemas'),
                    getLenguaExtranjera('Sistemas'),
                    getRecursosGenericos('Casilleros', 'Sistemas'),
                    getRecursosGenericos('AltasBajas', 'Sistemas')
                ]);

                setEncargadoTutorias(encargado);
                setCoordinacionPI(pi);
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

            const sections = ['encargado', 'estancias', 'proyectos', 'etc', 'calendario', 'altasbajas', 'lengua', 'casilleros'];
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(id);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sections = [
        { id: 'encargado', label: 'Encargada Tutorías', icon: Users },
        { id: 'estancias', label: 'Estancias y Estadías', icon: Briefcase },
        { id: 'proyectos', label: 'Proyectos Integradores', icon: LayoutGrid },
        { id: 'etc', label: 'Criterios ETC', icon: Info },
        { id: 'calendario', label: 'Calendario', icon: Calendar },
        { id: 'altasbajas', label: 'Altas y Bajas', icon: BookOpen },
        { id: 'lengua', label: 'Inglés', icon: GraduationCap },
        { id: 'casilleros', label: 'Casilleros', icon: MapPin },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#0f172a] selection:bg-rose-500/30">
            <SubHeader
                title="Recursos y Avisos"
                subtitle="Sistemas - Información Académica"
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

                    {/* Section: Estancias y Estadías / Tutorías */}
                    <section id="estancias" className="scroll-mt-32 grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center group">
                            <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 p-4">
                                <Image
                                    src="/coordinacionEstanciasEstadias.jpg"
                                    alt="Estancias"
                                    unoptimized
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tighter">Estancias y Estadías</h3>
                            <p className="text-slate-500 text-xs font-bold mb-4 uppercase">Coordinación</p>
                            <p className="text-rose-700 font-bold text-sm">Responsable de Vinculación</p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center group">
                            <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-4">
                                <Image
                                    src="/coordinacionTutorias.jpg"
                                    alt="Tutorías"
                                    unoptimized
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tighter">Acción Tutorial</h3>
                            <p className="text-slate-500 text-xs font-bold mb-4 uppercase">Coordinación</p>
                            <p className="text-slate-700 font-bold text-sm">Gestión de Docentes</p>
                        </div>
                    </section>

                    {/* Section: Proyectos Integradores */}
                    {/* Section: Proyectos Integradores */}
                    {coordinacionPI && (
                        <section id="proyectos" className="scroll-mt-32">
                            <div className="bg-gradient-to-br from-rose-900 to-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 group">
                                <div className="md:w-1/2 relative min-h-[400px] bg-white group-hover:scale-[1.02] transition-transform duration-1000">
                                    <Image
                                        src={coordinacionPI.image}
                                        alt="Logo Proyectos"
                                        unoptimized
                                        fill
                                        className="p-12 object-contain"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-rose-900/10"></div>
                                </div>
                                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                                    <span className="text-rose-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Coordinación General</span>
                                    <h3 className="text-3xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">{coordinacionPI.title}</h3>
                                    <p className="text-white font-bold text-xl mb-6">{coordinacionPI.name}</p>
                                    <div className="space-y-4">
                                        <a href={`mailto:${coordinacionPI.correo}`} className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/10 rounded-2xl text-white font-bold text-xs hover:bg-white hover:text-rose-900 transition-all">
                                            <Mail size={14} /> Enviar Mensaje
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

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
                                            onClick={() => setMenuOpen(false)}
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