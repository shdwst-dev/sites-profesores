'use client';

import { useRouter } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { Clock, Calendar, FileText, BookOpen, Table, CheckSquare, Book, Map, NotebookPen, X, Upload, Info, FileDown, ChevronRight, Check, Image as ImageIcon, FileSpreadsheet, Trash2, Menu, ChevronUp, LayoutGrid } from 'lucide-react';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import SubHeader from '@/components/SubHeader';
import { getEntregables, getDocumentosDescarga } from '@/lib/api';
import { Entregable, DocumentoDescarga } from '@/types';

// Helper for file size
const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Helper for dynamic icons
const getIcon = (name: string) => {
    // @ts-ignore
    return LucideIcons[name] || LucideIcons.File;
};

export default function SistemasFormatosDocumentos() {
    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File[] }>({});
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const [success, setSuccess] = useState<{ [key: string]: boolean }>({});
    const [menuOpen, setMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Data State
    const [entregables, setEntregables] = useState<Entregable[]>([]);
    const [descargas, setDescargas] = useState<DocumentoDescarga[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);

            const sections = ['instrucciones', 'entregables', 'formatos'];
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
        { id: 'instrucciones', label: 'Guía de Uso', icon: Info },
        { id: 'entregables', label: 'Entregables Semanales', icon: CheckSquare },
        { id: 'formatos', label: 'Descargas', icon: FileDown },
    ];



    useEffect(() => {
        const loadData = async () => {
            try {
                const [e, d] = await Promise.all([getEntregables('Sistemas'), getDocumentosDescarga('Sistemas')]);
                setEntregables(e);
                setDescargas(d);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const groupedEntregables = entregables.reduce((acc, curr) => {
        const group = acc.find(g => g.titulo === curr.stage);
        if (group) {
            group.items.push({ nombre: curr.title, fecha: curr.deadline });
        } else {
            acc.push({ titulo: curr.stage, items: [{ nombre: curr.title, fecha: curr.deadline }] });
        }
        return acc;
    }, [] as { titulo: string; items: { nombre: string; fecha: string }[] }[]);

    const handleUpload = (taskKey: string) => {
        setUploading(prev => ({ ...prev, [taskKey]: true }));
        // Simular subida
        setTimeout(() => {
            setUploading(prev => ({ ...prev, [taskKey]: false }));
            setSuccess(prev => ({ ...prev, [taskKey]: true }));
            setSelectedFiles(prev => ({ ...prev, [taskKey]: [] }));
            setTimeout(() => {
                setSuccess(prev => ({ ...prev, [taskKey]: false }));
            }, 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#0f172a]">
            <SubHeader
                title="Formatos y Documentos"
                subtitle={activeSection ? sections.find(s => s.id === activeSection)?.label : "Sistemas - Gestión Académica"}
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
                                            ${activeSection === s.id ? 'bg-rose-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}
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

                <main className="flex-1 min-w-0 animate-in fade-in duration-700">
                    {/* Hero / Instructions Section */}
                    <div id="instrucciones" className="scroll-mt-32 grid lg:grid-cols-3 gap-8 mb-16">
                        <div className="lg:col-span-2 bg-gradient-to-br from-rose-900/40 to-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">
                                Guía de <span className="text-rose-400">Uso</span>
                            </h2>
                            <p className="text-gray-400 font-medium mb-8 max-w-2xl leading-relaxed">
                                Por favor, asegúrese de cargar sus documentos en los formatos correctos (PDF preferentemente). Cada sección tiene fechas límites estrictas que deben respetarse para el correcto seguimiento académico.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4">
                                {[
                                    { step: 'Paso 1', title: 'Seleccionar', desc: 'Elige tus archivos locales.' },
                                    { step: 'Paso 2', title: 'Verificar', desc: 'Revisar los nombres y formatos de los archivos.' },
                                    { step: 'Paso 3', title: 'Cargar', desc: 'El archivo se sube a la nube de Drive.' }
                                ].map((s) => (
                                    <div key={s.step} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                        <span className="text-rose-500 font-black text-xl mb-2 block">{s.step}</span>
                                        <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">{s.title}</h4>
                                        <p className="text-gray-500 text-xs leading-tight">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 flex flex-col justify-center">
                            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                                <Info className="text-rose-600" size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Nota importante</h3>
                            <p className="text-slate-600 font-medium text-sm leading-relaxed mb-6">
                                Los archivos se sincronizan automáticamente con la carpeta compartida de la coordinación. No es necesario enviar correos de confirmación.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* Left Column: Deliverables */}
                        <div id="entregables" className="scroll-mt-32 space-y-12">
                            {groupedEntregables.map((grupo) => {
                                const grupoKey = grupo.titulo;

                                return (
                                    <section key={grupo.titulo} className="animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-500/20">
                                                <Calendar className="text-rose-400" size={24} />
                                            </div>
                                            <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                                                {grupo.titulo}
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            {grupo.items.map((item, itemIdx) => {
                                                const taskKey = `${grupo.titulo}-${itemIdx}`;
                                                const currentFiles = selectedFiles[taskKey] || [];
                                                const isUploading = uploading[taskKey];
                                                const isSuccess = success[taskKey];

                                                return (
                                                    <div
                                                        key={item.nombre}
                                                        className="group bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-rose-500/30 rounded-3xl p-6 transition-all duration-300"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                            <div className="flex-1">
                                                                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-rose-400 transition-colors leading-tight">
                                                                    {item.nombre}
                                                                </h4>
                                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                                                    <Clock size={12} />
                                                                    {item.fecha}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <label className={`
                                                                flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95
                                                                ${currentFiles.length > 0
                                                                        ? 'bg-rose-600 text-white shadow-lg'
                                                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                                                    }
                                                            `}>
                                                                    <Upload size={14} />
                                                                    {currentFiles.length > 0 ? `${currentFiles.length} Seleccionados` : 'Elegir'}
                                                                    <input
                                                                        type="file"
                                                                        multiple
                                                                        className="hidden"
                                                                        onChange={(e) => {
                                                                            if (e.target.files) {
                                                                                setSelectedFiles({
                                                                                    ...selectedFiles,
                                                                                    [taskKey]: Array.from(e.target.files)
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>

                                                                <button
                                                                    onClick={() => handleUpload(taskKey)}
                                                                    disabled={currentFiles.length === 0 || isUploading}
                                                                    className={`
                                                                    flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all
                                                                    ${isSuccess
                                                                            ? 'bg-emerald-500 text-white'
                                                                            : currentFiles.length > 0
                                                                                ? 'bg-white text-[#0f172a] hover:bg-rose-400'
                                                                                : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
                                                                        }
                                                                `}
                                                                >
                                                                    {isUploading ? (
                                                                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                                                    ) : isSuccess ? (
                                                                        <Check size={14} />
                                                                    ) : (
                                                                        'Subir'
                                                                    )}
                                                                </button>

                                                                {currentFiles.length > 0 && !isUploading && (
                                                                    <button
                                                                        onClick={() => setSelectedFiles({ ...selectedFiles, [taskKey]: [] })}
                                                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* File Preview */}
                                                        {currentFiles.length > 0 && (
                                                            <div className="mt-6 pt-6 border-t border-white/5 grid gap-3">
                                                                {currentFiles.map((f, i) => {
                                                                    // Determine icon
                                                                    const isImage = f.type.startsWith('image/');
                                                                    const isPdf = f.type === 'application/pdf';
                                                                    const Icon = isImage ? ImageIcon : (isPdf ? FileText : FileSpreadsheet);

                                                                    return (
                                                                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group/file">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isImage ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                                                    <Icon size={20} />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-white text-sm font-medium truncate max-w-[200px]">{f.name}</p>
                                                                                    <p className="text-gray-500 text-xs font-bold uppercase">{formatBytes(f.size)}</p>
                                                                                </div>
                                                                            </div>

                                                                            {!isUploading && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const newFiles = [...currentFiles];
                                                                                        newFiles.splice(i, 1);
                                                                                        setSelectedFiles({ ...selectedFiles, [taskKey]: newFiles });
                                                                                    }}
                                                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover/file:opacity-100"
                                                                                    title="Eliminar archivo"
                                                                                >
                                                                                    <Trash2 size={16} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>

                        {/* Right Column: PDF Formats */}
                        <div id="formatos" className="scroll-mt-32 space-y-8">
                            <section className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 bg-rose-900 rounded-xl">
                                        <FileDown className="text-white" size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Formatos</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {descargas.map((formato, index) => {
                                        const Icon = getIcon(formato.icon);
                                        return (
                                            <a
                                                key={index}
                                                href={formato.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 rounded-[1.25rem] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 ${formato.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                        <Icon className="text-slate-700" size={18} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 group-hover:text-rose-900 transition-colors">
                                                        {formato.title}
                                                    </span>
                                                </div>
                                                <ChevronRight className="text-slate-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" size={16} />
                                            </a>
                                        );
                                    })}
                                </div>


                            </section>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="fixed bottom-8 left-8 xl:hidden z-50">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center justify-center bg-rose-600 text-white rounded-full w-14 h-14 shadow-2xl active:scale-95 transition-all"
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
            )}

            {/* Scroll Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-rose-700 text-white border-none rounded-full w-14 h-14 flex items-center justify-center shadow-2xl transition-all duration-300 z-50 transform hover:scale-110 active:scale-90"
                >
                    <ChevronUp size={24} />
                </button>
            )}

            <Footer />
        </div>
    );
}