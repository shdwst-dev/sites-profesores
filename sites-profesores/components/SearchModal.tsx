'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, X, Bell, Calendar, FileText, Users, Phone,
    BookOpen, Loader2, ArrowRight, Command
} from 'lucide-react';
import {
    getComunicados, getFechasImportantes, getTramites,
    getTutoresProfesores, getContactos, getEntregables,
    getDocumentosDescarga
} from '@/lib/api';

interface SearchResult {
    id: string | number;
    title: string;
    subtitle?: string;
    category: string;
    icon: any;
    color: string;
    path: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [allData, setAllData] = useState<SearchResult[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Load all data once when modal opens
    useEffect(() => {
        if (!isOpen || dataLoaded) return;

        const loadAll = async () => {
            setLoading(true);
            try {
                const [comunicados, fechas, tramites, tutores, contactos, entregablesTIID, entregablesSist, docsTIID, docsSist] = await Promise.all([
                    getComunicados(),
                    getFechasImportantes(),
                    getTramites(),
                    getTutoresProfesores(),
                    getContactos(),
                    getEntregables('TIID'),
                    getEntregables('Sistemas'),
                    getDocumentosDescarga('TIID'),
                    getDocumentosDescarga('Sistemas'),
                ]);

                const mapped: SearchResult[] = [
                    ...(comunicados || []).map(c => ({
                        id: c.id, title: c.title, subtitle: c.description,
                        category: 'Comunicados', icon: Bell, color: 'text-blue-400',
                        path: '/Informacion-interes#comunicados'
                    })),
                    ...(fechas || []).map(f => ({
                        id: f.id, title: f.title, subtitle: `Fecha: ${f.date}`,
                        category: 'Fechas Importantes', icon: Calendar, color: 'text-purple-400',
                        path: '/Informacion-interes#fechas'
                    })),
                    ...(tramites || []).map(t => ({
                        id: t.id, title: t.title, subtitle: t.description,
                        category: 'Trámites', icon: FileText, color: 'text-amber-400',
                        path: '/Informacion-interes#tramites'
                    })),
                    ...(tutores || []).map(t => ({
                        id: t.id, title: t.title, subtitle: t.classification,
                        category: 'Tutores/Profesores', icon: Users, color: 'text-emerald-400',
                        path: '/Informacion-interes#tutores'
                    })),
                    ...(contactos || []).map(c => ({
                        id: c.id, title: c.title, subtitle: `${c.correo} — Ext. ${c.ext}`,
                        category: 'Contactos', icon: Phone, color: 'text-yellow-400',
                        path: '/Informacion-interes#contactos'
                    })),
                    ...(entregablesTIID || []).map(e => ({
                        id: e.id, title: e.title, subtitle: `${e.stage} — ${e.deadline}`,
                        category: 'Entregables TIID', icon: BookOpen, color: 'text-pink-400',
                        path: '/tiid/formatos-y-documentos'
                    })),
                    ...(entregablesSist || []).map(e => ({
                        id: e.id, title: e.title, subtitle: `${e.stage} — ${e.deadline}`,
                        category: 'Entregables Sistemas', icon: BookOpen, color: 'text-cyan-400',
                        path: '/sistemas-computacionales/formatos-y-documentos'
                    })),
                    ...(docsTIID || []).map(d => ({
                        id: d.id, title: d.title, subtitle: 'Documento descargable',
                        category: 'Documentos TIID', icon: FileText, color: 'text-pink-400',
                        path: '/tiid/formatos-y-documentos'
                    })),
                    ...(docsSist || []).map(d => ({
                        id: d.id, title: d.title, subtitle: 'Documento descargable',
                        category: 'Documentos Sistemas', icon: FileText, color: 'text-cyan-400',
                        path: '/sistemas-computacionales/formatos-y-documentos'
                    })),
                ];

                setAllData(mapped);
                setDataLoaded(true);
            } catch (error) {
                console.error('Error loading search data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAll();
    }, [isOpen, dataLoaded]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Filter results based on query
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSelectedIndex(0);
            return;
        }

        const timer = setTimeout(() => {
            const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const filtered = allData.filter(item => {
                const title = (item.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const subtitle = (item.subtitle || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const category = (item.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return title.includes(q) || subtitle.includes(q) || category.includes(q);
            });
            setResults(filtered.slice(0, 20));
            setSelectedIndex(0);
        }, 200);

        return () => clearTimeout(timer);
    }, [query, allData]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            e.preventDefault();
            navigateTo(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    }, [results, selectedIndex, onClose]);

    const navigateTo = (result: SearchResult) => {
        onClose();
        router.push(result.path);
    };

    // Group results by category
    const grouped = results.reduce<Record<string, SearchResult[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    if (!isOpen) return null;

    let flatIndex = -1;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
            <div
                className="w-full max-w-2xl bg-slate-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'slideUp 0.2s ease-out' }}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                    <Search size={20} className="text-gray-400 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar comunicados, trámites, fechas, contactos..."
                        className="flex-1 bg-transparent text-white text-base placeholder-gray-500 outline-none font-medium"
                    />
                    {loading && <Loader2 size={18} className="text-indigo-400 animate-spin shrink-0" />}
                    <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-gray-500 bg-white/5 border border-white/10 rounded-md">
                        ESC
                    </kbd>
                </div>

                {/* Results Area */}
                <div className="max-h-[50vh] overflow-y-auto">
                    {/* Empty state - no query */}
                    {!query.trim() && !loading && (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                                <Search size={24} className="text-indigo-400" />
                            </div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Busca en todo el portal</p>
                            <p className="text-gray-600 text-xs">
                                Comunicados, fechas, trámites, contactos, entregables y documentos
                            </p>
                        </div>
                    )}

                    {/* No results */}
                    {query.trim() && results.length === 0 && !loading && (
                        <div className="p-8 text-center">
                            <p className="text-gray-400 text-sm font-medium">No se encontraron resultados</p>
                            <p className="text-gray-600 text-xs mt-1">Intenta con otro término de búsqueda</p>
                        </div>
                    )}

                    {/* Grouped results */}
                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category}>
                            <div className="px-5 py-2 bg-white/[0.02]">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">
                                    {category}
                                </span>
                            </div>
                            {items.map((item) => {
                                flatIndex++;
                                const idx = flatIndex;
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={`${item.category}-${item.id}`}
                                        onClick={() => navigateTo(item)}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${
                                            selectedIndex === idx
                                                ? 'bg-indigo-600/20 border-l-2 border-indigo-500'
                                                : 'border-l-2 border-transparent hover:bg-white/5'
                                        }`}
                                    >
                                        <Icon size={16} className={`shrink-0 ${item.color}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                                            {item.subtitle && (
                                                <p className="text-xs text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                                            )}
                                        </div>
                                        {selectedIndex === idx && (
                                            <ArrowRight size={14} className="text-indigo-400 shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-600 font-bold">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[9px]">↑↓</kbd> Navegar</span>
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[9px]">↵</kbd> Abrir</span>
                    </div>
                    <span>{results.length > 0 ? `${results.length} resultado${results.length !== 1 ? 's' : ''}` : ''}</span>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
