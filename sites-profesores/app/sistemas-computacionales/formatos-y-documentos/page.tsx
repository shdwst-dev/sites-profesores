'use client';

import { useRouter } from 'next/navigation';
import { Calendar, BookOpen, ExternalLink, ChevronUp, Menu, X, UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import { useState, useEffect, useRef } from 'react';
import SubHeader from '@/components/SubHeader';
import { getEntregables, getDocumentosDescarga } from '@/lib/api';
import { Entregable, DocumentoDescarga } from '@/types';

export default function SistemasFormatosDocumentos() {
    const router = useRouter();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    const [entregables, setEntregables] = useState<Entregable[]>([]);
    const [descargas, setDescargas] = useState<DocumentoDescarga[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [ent, desc] = await Promise.all([
                    getEntregables('Sistemas'),
                    getDocumentosDescarga('Sistemas')
                ]);

                setEntregables(ent);
                setDescargas(desc);
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

            const sectionsList = ['entregables', 'descargas'];
            const candidates: string[] = [];

            for (const id of sectionsList) {
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
        { id: 'entregables', label: 'Entregables', icon: Calendar },
        { id: 'descargas', label: 'Descargas', icon: BookOpen },
    ];

    if (loading) {
        return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Cargando recursos...</div>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#0f172a] selection:bg-rose-500/30">
            <SubHeader
                title="Formatos y Documentos"
                subtitle={activeSection ? sections.find(s => s.id === activeSection)?.label : "Sistemas - Recursos Oficiales"}
                accentColor="#881337"
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

                <div id="formatos-content" className="space-y-24 w-full">

                    {/* Section: Entregables */}
                    {entregables.length > 0 && (
                        <section id="entregables" className="scroll-mt-32">
                            <div className="bg-gradient-to-br from-rose-900/40 to-slate-900 border border-white/10 p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden group">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                                            <Calendar size={28} />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">Entregables</h2>
                                    </div>
                                    <a
                                        href="https://drive.google.com/drive/folders/1uEvZZy3jhXpj0_67CGelYYyq5cBh45cq?usp=drive_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all shadow-lg hover:shadow-white/10 border border-white/10 text-sm"
                                    >
                                        <ExternalLink size={18} /> Verificar subidas en Drive
                                    </a>
                                </div>
                                <div className="space-y-4">
                                    {entregables.map((item) => (
                                        <EntregableRow key={item.id} item={item} department="Sistemas" />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Section: Descargas */}
                    {descargas.length > 0 && (
                        <section id="descargas" className="scroll-mt-32">
                            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-xl p-5 sm:p-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                                        <BookOpen size={28} />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Formatos de Descarga</h2>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {descargas.map((item, idx) => {
                                        return (
                                            <a key={idx} href={item.link} target="_blank" className={`p-6 rounded-3xl border ${item.color || 'bg-slate-50 border-slate-100 hover:border-rose-300'} transition-all group hover:scale-[1.02] shadow-sm flex flex-col items-center text-center gap-4`}>
                                                <div className="bg-white p-4 rounded-full shadow-sm text-rose-600 group-hover:scale-110 transition-transform">
                                                    <ExternalLink size={24} />
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                </div>
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
                    className="fixed bottom-8 right-8 bg-rose-600 text-white border-none rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-3xl transition-all duration-300 z-50 transform hover:scale-110 hover:shadow-rose-500/40 active:scale-90"
                    title="Volver arriba"
                >
                    <ChevronUp size={24} />
                </button>
            )}

            <Footer />
        </div>
    );
}

// Componente individual para manejar el estado de subida de cada fila
function EntregableRow({ item, department }: { item: Entregable, department: string }) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [successCount, setSuccessCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError(null);
        setSuccessCount(0);

        const totalFiles = files.length;
        setUploadProgress({ current: 0, total: totalFiles });

        let uploaded = 0;
        const errors: string[] = [];

        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            setUploadProgress({ current: i + 1, total: totalFiles });

            const formData = new FormData();
            formData.append('file', file);
            formData.append('department', department);
            formData.append('category', `Entregas - ${item.title}`);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `Error al subir ${file.name}`);
                }

                uploaded++;
            } catch (err: any) {
                console.error(`Upload error (${file.name}):`, err);
                errors.push(`${file.name}: ${err.message || 'Error'}`);
            }
        }

        setSuccessCount(uploaded);

        if (errors.length > 0) {
            setError(`${errors.length} archivo(s) fallaron: ${errors[0]}${errors.length > 1 ? ` y ${errors.length - 1} más` : ''}`);
        }

        setUploading(false);
        setUploadProgress({ current: 0, total: 0 });

        if (uploaded > 0) {
            setTimeout(() => setSuccessCount(0), 5000);
        }

        if (fileRef.current) fileRef.current.value = '';
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors items-center">
            <div className="md:w-1/4 w-full">
                <span className="text-rose-400 font-black text-xs uppercase tracking-widest">{item.stage}</span>
            </div>
            <div className="flex-1 w-full">
                <p className="text-white font-bold">{item.title}</p>
                {uploading && (
                    <p className="text-rose-300 text-xs font-bold mt-2 flex items-center gap-1">
                        <Loader2 size={14} className="animate-spin" />
                        Subiendo {uploadProgress.current} de {uploadProgress.total} archivo(s)...
                    </p>
                )}
                {error && <p className="text-red-400 text-xs font-bold mt-2">{error}</p>}
                {successCount > 0 && !uploading && (
                    <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">
                        <CheckCircle2 size={14} /> {successCount === 1 ? '¡Entregado con éxito!' : `¡${successCount} archivos entregados con éxito!`}
                    </p>
                )}
            </div>
            <div className="md:w-1/4 w-full flex items-center gap-4 justify-between md:justify-end">
                <span className="text-rose-400 font-bold text-sm bg-rose-500/10 px-4 py-2 rounded-full inline-block shrink-0">
                    {item.deadline}
                </span>

                <input type="file" ref={fileRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.zip" multiple />

                <button
                    onClick={() => !uploading && fileRef.current?.click()}
                    disabled={uploading}
                    title="Subir archivo(s)"
                    className={`p-2.5 rounded-xl transition-all shrink-0 ${uploading
                        ? 'bg-rose-600/50 text-white cursor-wait'
                        : successCount > 0
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95'
                        }`}
                >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : (successCount > 0 ? <CheckCircle2 size={18} /> : <UploadCloud size={18} />)}
                </button>
            </div>
        </div>
    );
}