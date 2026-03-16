'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle, Calendar, BookOpen, Plus, Trash2, Edit2, X } from 'lucide-react';
import {
    getEntregables,
    getDocumentosDescarga,
    createEntregable,
    updateEntregable,
    deleteEntregable,
    createDocumentoDescarga,
    updateDocumentoDescarga,
    deleteDocumentoDescarga
} from '@/lib/api';
import { Entregable, DocumentoDescarga } from '@/types';
import FileInput from '@/components/admin/FileInput';

type SectionType = 'entregables' | 'descargas';

export default function AdminTIIDFormatosDocumentos() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Data State
    const [entregables, setEntregables] = useState<Entregable[]>([]);
    const [descargas, setDescargas] = useState<DocumentoDescarga[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionType | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [ent, doc] = await Promise.all([
                getEntregables('TIID'),
                getDocumentosDescarga('TIID')
            ]);
            setEntregables(ent || []);
            setDescargas(doc || []);
        } catch (error) {
            console.error("Error loading data", error);
            setMessage({ type: 'error', text: 'Error al cargar los datos. Recargue la página.' });
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleOpenModal = (section: SectionType, item: any = null) => {
        setActiveSection(section);
        setEditingItem(item);
        if (item) {
            setFormData({ ...item });
        } else {
            if (section === 'entregables') setFormData({ stage: 'Nueva Etapa', title: 'Nuevo Entregable', deadline: 'Selecciona una fecha', department: 'TIID' });
            else if (section === 'descargas') setFormData({ title: 'Nuevo Documento', link: '', icon: 'FileText', color: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300', department: 'TIID' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setActiveSection(null);
        setFormData({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (activeSection === 'entregables') {
                if (editingItem) await updateEntregable(editingItem.id, formData);
                else await createEntregable({ ...formData, department: 'TIID' });
            } else if (activeSection === 'descargas') {
                if (editingItem) await updateDocumentoDescarga(editingItem.id, formData);
                else await createDocumentoDescarga({ ...formData, department: 'TIID' });
            }
            await loadData();
            showMessage('success', 'Cambios guardados correctamente.');
            handleCloseModal();
        } catch (error) {
            console.error("Error saving:", error);
            showMessage('error', 'Error al guardar los cambios.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (section: SectionType, id: string | number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;
        try {
            if (section === 'entregables') await deleteEntregable(id);
            else if (section === 'descargas') await deleteDocumentoDescarga(id);
            
            await loadData();
            showMessage('success', 'Elemento eliminado correctamente.');
        } catch (error) {
            console.error("Error deleting:", error);
            showMessage('error', 'Error al eliminar el elemento.');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-96 text-white"><Loader2 className="animate-spin" /> Cargando...</div>;

    const renderTable = (
        section: SectionType,
        icon: React.ReactNode,
        title: string,
        description: string,
        data: any[],
        columns: { key: string, label: string, render?: (item: any) => React.ReactNode }[],
        color: string
    ) => {
        const bgColors: Record<string, string> = { indigo: 'bg-indigo-600', blue: 'bg-blue-600' };
        const textColors: Record<string, string> = { indigo: 'text-indigo-400', blue: 'text-blue-400' };
        
        const bgColor = bgColors[color] || 'bg-indigo-600';
        const txtColor = textColors[color] || 'text-indigo-400';

        return (
            <div className={`bg-slate-900 border border-${color}-500/20 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-500`}>
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 ${bgColor} rounded-xl`}>{icon}</div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                            <p className="text-sm text-gray-400">{description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal(section)}
                        className={`flex items-center gap-2 ${bgColor} hover:brightness-110 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-${color}-500/20`}
                    >
                        <Plus size={16} /> Nuevo
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300 border-collapse">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold tracking-widest">
                            <tr>
                                {columns.map(col => <th key={col.key} className="px-6 py-4">{col.label}</th>)}
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500 font-medium">No hay registros.</td>
                                </tr>
                            ) : (
                                data.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-white/5 transition-colors">
                                        {columns.map(col => (
                                            <td key={`${item.id}-${col.key}`} className="px-6 py-4 font-medium max-w-[200px] truncate" title={item[col.key]}>
                                                {col.render ? col.render(item) : item[col.key]}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(section, item)} className={`p-2 ${txtColor} hover:bg-white/5 rounded-lg transition-colors border border-transparent`} title="Editar">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(section, item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent" title="Eliminar">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10 pb-20">
            <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Formatos y Documentos TIID</h1>
                    <p className="text-sm text-gray-400 mt-1">Actualiza la información visible en la página de TIID.</p>
                </div>
                {message && (
                    <div className={`px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in duration-300 font-medium shadow-lg ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}
            </header>

            {/* Tablas de Secciones */}
            <div className="space-y-8">
                {renderTable('entregables', <Calendar className="text-white" size={20} />, 'Entregables TIID', 'Tabla de fechas y entregas importantes', entregables, [
                    { key: 'stage', label: 'Etapa / Semana' },
                    { key: 'title', label: 'Título / Descripción' },
                    { key: 'deadline', label: 'Fecha Límite' }
                ], 'indigo')}

                {renderTable('descargas', <BookOpen className="text-white" size={20} />, 'Documentos de Descarga TIID', 'Formatos y guías para descargar', descargas, [
                    { key: 'title', label: 'Título del Documento' },
                    { key: 'link', label: 'Enlace', render: (i) => i.link ? <span className="text-indigo-400 text-xs underline">Enlace configurado</span> : <span className="text-gray-500 text-xs">Sin enlace</span> },
                    { key: 'icon', label: 'Icono' },
                    { key: 'color', label: 'Color' }
                ], 'blue')}
            </div>

            {/* Modal Dinámico */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                                {editingItem ? <Edit2 size={18} className="text-indigo-400"/> : <Plus size={18} className="text-indigo-400"/>}
                                {editingItem ? 'Editar Registro' : 'Nuevo Registro'}
                            </h3>
                            <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                            
                            {/* --- FORMULARIO ENTREGABLES --- */}
                            {activeSection === 'entregables' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Etapa / Semana</label>
                                            <input required type="text" value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" placeholder="Ej: Semana 1" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Fecha Límite</label>
                                            <input required type="text" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" placeholder="Ej: Cierre: Fin de Semana 1" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título / Descripción</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" />
                                    </div>
                                </>
                            )}

                            {/* --- FORMULARIO DOCUMENTOS DE DESCARGA --- */}
                            {activeSection === 'descargas' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título Documento</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div className="pt-2">
                                        {/* FileInput for Google Drive URL */}
                                        <FileInput 
                                            label="Enlace del Archivo" 
                                            value={formData.link || ''} 
                                            onChange={v => setFormData({...formData, link: v})} 
                                            department="TIID"
                                            category="Documentos"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Icono (Lucide)</label>
                                            <input type="text" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Ej: FileText" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Color Tailwind</label>
                                            <input type="text" value={formData.color || ''} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Ej: bg-indigo-50 border-indigo-100..." />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="pt-6 border-t border-white/5 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl text-xs uppercase font-black tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs uppercase font-black tracking-widest transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
