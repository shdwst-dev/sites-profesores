'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Calendar, BookOpen, Plus, Trash2, Edit2, X } from 'lucide-react';
import Toast, { ToastMessage } from '@/components/Toast';
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

export default function AdminSistemasFormatosDocumentos() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<ToastMessage>(null);

    // Data State
    const [entregables, setEntregables] = useState<Entregable[]>([]);
    const [descargas, setDescargas] = useState<DocumentoDescarga[]>([]);

    // Modal State (formulario)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionType | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    // Modal de confirmación de borrado
    const [deleteTarget, setDeleteTarget] = useState<{ section: SectionType; id: string | number; label: string } | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [ent, doc] = await Promise.all([
                getEntregables('Sistemas'),
                getDocumentosDescarga('Sistemas')
            ]);
            setEntregables(ent || []);
            setDescargas(doc || []);
        } catch (error) {
            console.error('Error loading data', error);
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
            if (section === 'entregables') setFormData({ stage: 'Nueva Etapa', title: 'Nuevo Entregable', deadline: 'Selecciona una fecha', department: 'Sistemas' });
            else if (section === 'descargas') setFormData({ title: 'Nuevo Documento', link: '', icon: 'FileText', color: 'bg-rose-50 border-rose-100 hover:border-rose-300', department: 'Sistemas' });
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
                if (editingItem) await updateEntregable(editingItem.id, formData, 'Sistemas');
                else await createEntregable({ ...formData, department: 'Sistemas' }, 'Sistemas');
            } else if (activeSection === 'descargas') {
                if (editingItem) await updateDocumentoDescarga(editingItem.id, formData, 'Sistemas');
                else await createDocumentoDescarga({ ...formData, department: 'Sistemas' }, 'Sistemas');
            }
            await loadData();
            showMessage('success', 'Cambios guardados correctamente.');
            handleCloseModal();
        } catch (error) {
            console.error('Error saving:', error);
            showMessage('error', 'Error al guardar los cambios.');
        } finally {
            setSaving(false);
        }
    };

    const requestDelete = (section: SectionType, id: string | number, label: string) => {
        setDeleteTarget({ section, id, label });
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const { section, id } = deleteTarget;
        setDeleteTarget(null);
        try {
            if (section === 'entregables') await deleteEntregable(id);
            else if (section === 'descargas') await deleteDocumentoDescarga(id);
            await loadData();
            showMessage('success', 'Elemento eliminado correctamente.');
        } catch (error) {
            console.error('Error deleting:', error);
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
        accentColor: 'rose' | 'pink'
    ) => {
        const colors = {
            rose: { bg: 'bg-rose-600', text: 'text-rose-400', shadow: 'shadow-rose-500/20', border: 'border-rose-500/20' },
            pink: { bg: 'bg-pink-600', text: 'text-pink-400', shadow: 'shadow-pink-500/20', border: 'border-pink-500/20' },
        };
        const c = colors[accentColor];

        return (
            <div className={`bg-slate-900 border ${c.border} rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-500`}>
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 ${c.bg} rounded-xl`}>{icon}</div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                            <p className="text-sm text-gray-400">{description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal(section)}
                        className={`flex items-center gap-2 ${c.bg} hover:brightness-110 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${c.shadow}`}
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
                                                <button
                                                    onClick={() => handleOpenModal(section, item)}
                                                    className={`p-2 ${c.text} hover:bg-white/5 rounded-lg transition-colors border border-transparent`}
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => requestDelete(section, item.id, item.title || item.stage || 'este elemento')}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent"
                                                    title="Eliminar"
                                                >
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
        <div className="space-y-10 pb-20 selection:bg-rose-500/30">
            <Toast message={message} onClose={() => setMessage(null)} />

            <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-8">
                <div>
                    <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">Formatos y Documentos Sistemas</h1>
                    <p className="text-sm text-gray-400 mt-1">Actualiza la información visible en la página de Sistemas Computacionales.</p>
                </div>
            </header>

            <div className="space-y-8">
                {renderTable('entregables', <Calendar className="text-white" size={20} />, 'Entregables Sistemas', 'Tabla de fechas y entregas importantes del departamento', entregables, [
                    { key: 'stage', label: 'Etapa / Semana' },
                    { key: 'title', label: 'Título / Descripción' },
                    { key: 'deadline', label: 'Fecha Límite' }
                ], 'rose')}

                {renderTable('descargas', <BookOpen className="text-white" size={20} />, 'Documentos de Descarga Sistemas', 'Formatos y guías para descargar', descargas, [
                    { key: 'title', label: 'Título del Documento' },
                    { key: 'link', label: 'Enlace', render: (i) => i.link ? <span className="text-rose-400 text-xs underline">Enlace configurado</span> : <span className="text-gray-500 text-xs">Sin enlace</span> },
                    { key: 'icon', label: 'Icono' },
                ], 'pink')}
            </div>

            {/* Modal de Formulario */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                                {editingItem ? <Edit2 size={18} className="text-rose-400" /> : <Plus size={18} className="text-rose-400" />}
                                {editingItem ? 'Editar Registro' : 'Nuevo Registro'}
                            </h3>
                            <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                            {activeSection === 'entregables' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Etapa / Semana</label>
                                            <input required type="text" value={formData.stage || ''} onChange={e => setFormData({ ...formData, stage: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm font-medium" placeholder="Ej: Semana 1" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Fecha Límite</label>
                                            <input required type="text" value={formData.deadline || ''} onChange={e => setFormData({ ...formData, deadline: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm font-medium" placeholder="Ej: Fin de Semana 1" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título / Descripción</label>
                                        <input required type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm font-medium" />
                                    </div>
                                </>
                            )}

                            {activeSection === 'descargas' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título Documento</label>
                                        <input required type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div className="pt-2">
                                        <FileInput
                                            label="Enlace del Archivo"
                                            value={formData.link || ''}
                                            onChange={v => setFormData({ ...formData, link: v })}
                                            department="Sistemas"
                                            category="Documentos"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Icono (Lucide)</label>
                                            <input type="text" value={formData.icon || ''} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 transition-all text-sm font-medium" placeholder="Ej: FileText" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Color Tailwind</label>
                                            <input type="text" value={formData.color || ''} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 transition-all text-sm font-medium" placeholder="Ej: bg-rose-50..." />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="pt-6 border-t border-white/5 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl text-xs uppercase font-black tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs uppercase font-black tracking-widest transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-red-500/30 rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-500/10 rounded-xl">
                                <Trash2 size={22} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">¿Eliminar registro?</h3>
                                <p className="text-sm text-gray-400 mt-0.5">Esta acción no se puede deshacer.</p>
                            </div>
                        </div>
                        <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-white/5">
                            <p className="text-sm text-gray-300 font-medium">
                                <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">Elemento</span>
                                {deleteTarget.label}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl text-xs uppercase font-black tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs uppercase font-black tracking-widest transition-all shadow-lg shadow-red-500/20"
                            >
                                <Trash2 size={14} /> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
