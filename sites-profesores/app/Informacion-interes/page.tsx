'use client';

import { useRouter } from 'next/navigation';
import { Bell, Calendar, FileText, Users, ExternalLink, ChevronRight, Menu, X, ChevronUp, LayoutGrid } from 'lucide-react';
import Footer from '@/components/Footer';
import SubHeader from '@/components/SubHeader';
import { useState, useEffect } from 'react';
import {
    getComunicados,
    getFechasImportantes,
    getTramites,
    getTutoresProfesores,
    getContactos
} from '@/lib/api';
import {
    Comunicado,
    FechaImportante,
    Tramite,
    TutorProfesor,
    Contacto
} from '@/types';

export default function InfoPage() {
    const router = useRouter();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Data State
    const [comunicados, setComunicados] = useState<Comunicado[]>([]);
    const [fechasImportantes, setFechasImportantes] = useState<FechaImportante[]>([]);
    const [tramites, setTramites] = useState<Tramite[]>([]);
    const [tutoresProfesores, setTutoresProfesores] = useState<TutorProfesor[]>([]);
    const [contactos, setContactos] = useState<Contacto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [c, f, t, tp, co] = await Promise.all([
                    getComunicados(),
                    getFechasImportantes(),
                    getTramites(),
                    getTutoresProfesores(),
                    getContactos()
                ]);
                setComunicados(c);
                setFechasImportantes(f);
                setTramites(t);
                setTutoresProfesores(tp);
                setContactos(co);
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

            const sections = ['comunicados', 'tramites', 'tutores', 'fechas', 'contactos'];
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
        { id: 'comunicados', label: 'Comunicados', icon: Bell },
        { id: 'tramites', label: 'Trámites', icon: FileText },
        { id: 'tutores', label: 'Tutores/Profesores', icon: Users },
        { id: 'fechas', label: 'Fechas Importantes', icon: Calendar },
        { id: 'contactos', label: 'Contactos', icon: Users },
    ];

    // Helper to determine color based on classification (optional, can be moved to data or utils)
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Institucional': return 'bg-blue-600';
            case 'Académico': return 'bg-emerald-600';
            case 'Investigación': return 'bg-purple-600';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0f172a]">
            <SubHeader
                title="Información de Interés"
                subtitle="Comunicados y Fechas"
                accentColor="#1e3a5f"
                backPath="/home"
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

                <main className="flex-1 min-w-0 animate-in fade-in duration-700">
                    <div className="grid lg:grid-cols-3 gap-10">

                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Comunicados Section */}
                            <div id="comunicados" className="scroll-mt-32 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 shadow-2xl relative overflow-hidden">
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
                                                <span className={`rounded-full ${getCategoryColor(comm.classification)} px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider`}>
                                                    {comm.classification}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                                    <Calendar className="w-4 h-4" />
                                                    {comm.date}
                                                </div>
                                            </div>
                                            <h3 className="mb-3 text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{comm.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{comm.description}</p>
                                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                                                <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline group/btn">
                                                    Leer más <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {loading && comunicados.length === 0 && (
                                        <div className="text-center text-gray-400 py-8">Cargando comunicados...</div>
                                    )}
                                </div>
                            </div>

                            {/* Trámites Section */}
                            <div id="tramites" className="scroll-mt-32 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 p-8 shadow-2xl">
                                <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold text-white">
                                    <div className="p-2 bg-amber-500 rounded-lg">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    Trámites y Procedimientos
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {tramites.map((procedure, index) => (
                                        <a
                                            key={index}
                                            href={procedure.link || '#'}
                                            className="group relative rounded-2xl bg-white/95 p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-b-4 border-amber-500/0 hover:border-amber-500 block"
                                        >
                                            <h3 className="mb-3 font-extrabold text-gray-800 text-lg group-hover:text-amber-600 transition-colors uppercase tracking-tight">{procedure.title}</h3>
                                            <p className="text-sm font-medium text-gray-600 leading-snug">{procedure.description}</p>
                                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-amber-600 text-xs font-bold flex items-center gap-1">
                                                    Ver requisitos <ChevronRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Tutores y Profesores Section */}
                            <div id="tutores" className="scroll-mt-32 rounded-2xl bg-[#431d2a]/30 backdrop-blur-sm border border-white/10 p-8 shadow-2xl">
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
                                                {tutoresProfesores.filter(t => t.classification === 'Tutor').map((item) => (
                                                    <li key={item.id} className="flex items-start gap-2">
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 font-bold text-gray-700 hover:text-[#431d2a] transition-colors"
                                                        >
                                                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                                            <span className="text-sm">{item.title}</span>
                                                        </a>
                                                    </li>
                                                ))}
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
                                                {tutoresProfesores.filter(t => t.classification === 'Profesor').map((item) => (
                                                    <li key={item.id} className="flex items-start gap-2">
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 font-bold text-gray-700 hover:text-[#1e3a5f] transition-colors"
                                                        >
                                                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                                            <span className="text-sm">{item.title}</span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Fechas Importantes Section */}
                            <div id="fechas" className="scroll-mt-32 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 shadow-2xl">
                                <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
                                    <Calendar className="w-6 h-6 text-purple-400" />
                                    Fechas Importantes
                                </h2>
                                <div className="space-y-4">
                                    {fechasImportantes.map((item, index) => (
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
                                                    {item.title}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contactos Section */}
                            <div id="contactos" className="scroll-mt-32 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-8 border border-yellow-200/50 shadow-xl relative overflow-hidden group">
                                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                                <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-amber-900 tracking-tight">
                                    <Users className="w-6 h-6 text-amber-600" />
                                    Contactos
                                </h3>
                                <div className="space-y-6">
                                    {contactos.map((contact, index) => (
                                        <div key={contact.id} className={`relative z-10 ${index > 0 ? 'pt-4 border-t border-amber-900/10' : ''}`}>
                                            <p className="font-extrabold text-amber-900 text-sm uppercase tracking-wider mb-1">{contact.title}</p>
                                            <p className="text-amber-800 font-bold mb-1">{contact.correo}</p>
                                            <div className="inline-block px-2 py-0.5 bg-amber-200 rounded text-[10px] font-black text-amber-900">EXT. {contact.ext}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

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
                            <h3 className="text-xl font-black text-white tracking-tight uppercase">Contenidos</h3>
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