'use client';

import { useState, useEffect } from 'react';
import { 
    getEntregables, createEntregable, updateEntregable, deleteEntregable,
    getDocumentosDescarga, createDocumentoDescarga, updateDocumentoDescarga, deleteDocumentoDescarga
} from '@/lib/api';
import { Entregable, DocumentoDescarga } from '@/types';
import { Plus, Edit2, Trash2, X, Loader2, Save, ExternalLink, Calendar, BookOpen } from 'lucide-react';
import FileInput from '@/components/admin/FileInput';

export default function AdminEntregables() {
    const [activeTab, setActiveTab] = useState<'entregables' | 'descargas'>('entregables');
    const [entregables, setEntregables] = useState<Entregable[]>([]);
    const [descargas, setDescargas] = useState<DocumentoDescarga[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Modal state for both
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Entregables forms
    const [editingEntregable, setEditingEntregable] = useState<Entregable | null>(null);
    const [formDataEntregable, setFormDataEntregable] = useState<Omit<Entregable, 'id'>>({
        stage: 'Semana 1',
        title: '',
        deadline: ''
    });

    // Descargas forms
    const [editingDescarga, setEditingDescarga] = useState<DocumentoDescarga | null>(null);
    const [formDataDescarga, setFormDataDescarga] = useState<Omit<DocumentoDescarga, 'id'>>({
        icon: 'BookOpen',
        title: '',
        link: '',
        color: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [entData, descData] = await Promise.all([
                getEntregables('TIID'),
                getDocumentosDescarga('TIID')
            ]);
            setEntregables(entData || []);
            setDescargas(descData || []);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Entregables Handlers ---
    const handleOpenEntregableModal = (item?: Entregable) => {
        if (item) {
            setEditingEntregable(item);
            setFormDataEntregable({
                stage: item.stage,
                title: item.title,
                deadline: item.deadline || ''
            });
        } else {
            setEditingEntregable(null);
            setFormDataEntregable({ stage: 'Semana 1', title: '', deadline: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmitEntregable = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingEntregable) {
                await updateEntregable(editingEntregable.id, formDataEntregable, 'TIID');
            } else {
                await createEntregable(formDataEntregable, 'TIID');
            }
            await loadData();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving:", error);
            alert("Error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteEntregable = async (id: string | number) => {
        if (!window.confirm('¿Eliminar este entregable?')) return;
        try {
            await deleteEntregable(id);
            await loadData();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar.");
        }
    };

    // --- Descargas Handlers ---
    const handleOpenDescargaModal = (item?: DocumentoDescarga) => {
        if (item) {
            setEditingDescarga(item);
            setFormDataDescarga({
                icon: item.icon || 'BookOpen',
                title: item.title,
                link: item.link || '',
                color: item.color || ''
            });
        } else {
            setEditingDescarga(null);
            setFormDataDescarga({ icon: 'FileText', title: '', link: '', color: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmitDescarga = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingDescarga) {
                await updateDocumentoDescarga(editingDescarga.id, formDataDescarga, 'TIID');
            } else {
                await createDocumentoDescarga(formDataDescarga, 'TIID');
            }
            await loadData();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving:", error);
            alert("Error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteDescarga = async (id: string | number) => {
        if (!window.confirm('¿Eliminar esta descarga?')) return;
        try {
            await deleteDocumentoDescarga(id);
            await loadData();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar.");
        }
    };


    if (loading) {
        return <div className="flex h-64 items-center justify-center text-white"><Loader2 className="animate-spin mr-2"/> Cargando datos...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Recursos y Documentos</h1>
                    <p className="text-sm text-gray-400">Gestiona fechas de entregables y formatos descargables</p>
                </div>
                
                {/* Tabs */}
                <div className="flex bg-slate-800/50 p-1 rounded-xl w-full md:w-auto overflow-hidden">
                    <button 
                        onClick={() => setActiveTab('entregables')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex-1 ${
                            activeTab === 'entregables' 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Calendar size={16} /> Entregables
                    </button>
                    <button 
                        onClick={() => setActiveTab('descargas')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex-1 ${
                            activeTab === 'descargas' 
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <BookOpen size={16} /> Descargas (Drive)
                    </button>
                </div>
            </div>

            {/* TAB: ENTREGABLES */}
            {activeTab === 'entregables' && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={() => handleOpenEntregableModal()}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Plus size={16} /> Añadir Entregable
                        </button>
                    </div>
                    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="text-xs uppercase bg-white/5 text-gray-400 font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Etapa</th>
                                    <th className="px-6 py-4">Título</th>
                                    <th className="px-6 py-4">Fecha Límite</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {entregables.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">No hay entregables registrados.</td></tr>
                                ) : (
                                    entregables.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-indigo-400 uppercase tracking-wider text-xs">{item.stage}</td>
                                            <td className="px-6 py-4 font-bold text-white">{item.title}</td>
                                            <td className="px-6 py-4"><span className="bg-white/5 px-3 py-1.5 rounded-lg font-medium tracking-tight border border-white/10 inline-block">{item.deadline}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleOpenEntregableModal(item)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors border border-transparent hover:border-indigo-400/20"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDeleteEntregable(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: DESCARGAS */}
            {activeTab === 'descargas' && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={() => handleOpenDescargaModal()}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
                        >
                            <Plus size={16} /> Añadir Documento
                        </button>
                    </div>
                    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="text-xs uppercase bg-white/5 text-gray-400 font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Documento</th>
                                    <th className="px-6 py-4">Link (Drive)</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {descargas.length === 0 ? (
                                    <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500 font-medium">No hay formatos de descarga registrados.</td></tr>
                                ) : (
                                    descargas.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white">{item.title}</span>
                                                    <span className="text-xs text-gray-500">Icono: {item.icon}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-bold uppercase tracking-widest hover:underline w-fit">
                                                        Abrir Archivo <ExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500 text-xs italic">Sin enlace</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleOpenDescargaModal(item)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors border border-transparent hover:border-indigo-400/20"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDeleteDescarga(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal para Entregables */}
            {isModalOpen && activeTab === 'entregables' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                {editingEntregable ? 'Editar Entregable' : 'Nuevo Entregable'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmitEntregable} className="p-6 overflow-y-auto space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Etapa (Semana o Plazo)</label>
                                <input required type="text" value={formDataEntregable.stage} onChange={e => setFormDataEntregable({...formDataEntregable, stage: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 font-medium" placeholder="Ej: Semana 1, Solo Tutores..."/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título del Entregable</label>
                                <input required type="text" value={formDataEntregable.title} onChange={e => setFormDataEntregable({...formDataEntregable, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 font-medium" placeholder="Ej: Plan y Guía de asignatura..."/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Fecha Límite</label>
                                <input required type="text" value={formDataEntregable.deadline} onChange={e => setFormDataEntregable({...formDataEntregable, deadline: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 font-medium" placeholder="Ej: Cierre: Fin de Semana 1"/>
                            </div>
                            <div className="flex justify-end pt-4 mt-6">
                                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs">
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para Descargas */}
            {isModalOpen && activeTab === 'descargas' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                {editingDescarga ? 'Editar Formato Descargable' : 'Nuevo Formato Descargable'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmitDescarga} className="p-6 overflow-y-auto space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título del Documento</label>
                                <input required type="text" value={formDataDescarga.title} onChange={e => setFormDataDescarga({...formDataDescarga, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 font-medium" placeholder="Ej: Formato Reporte Tutorías..."/>
                            </div>
                            
                            <div className="pt-2">
                                {/* Componente de Subida a Google Drive integrado aquí */}
                                <FileInput 
                                    label="Archivo (Subir directo a Google Drive)"
                                    value={formDataDescarga.link || ''}
                                    onChange={(url) => setFormDataDescarga({...formDataDescarga, link: url})}
                                    department="TIID"
                                    category="Formatos de Descarga"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                                />
                            </div>

                            <div className="flex justify-end pt-4 mt-6">
                                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs">
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
