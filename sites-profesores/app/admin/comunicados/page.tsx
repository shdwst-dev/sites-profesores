'use client';

import { useState, useEffect } from 'react';
import { getComunicados, createComunicado, updateComunicado, deleteComunicado } from '@/lib/api';
import { Comunicado } from '@/types';
import { Plus, Edit2, Trash2, X, Loader2, Save } from 'lucide-react';

export default function AdminComunicados() {
    const [comunicados, setComunicados] = useState<Comunicado[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Comunicado | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        classification: 'Institucional'
    });

    const clasificaciones = ['Institucional', 'Académico', 'Investigación', 'Administrativo'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getComunicados();
            setComunicados(data || []);
        } catch (error) {
            console.error("Error loading comunicados:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: Comunicado) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                description: item.description,
                date: item.date,
                classification: item.classification || 'Institucional'
            });
        } else {
            setEditingItem(null);
            const today = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
            setFormData({ title: '', description: '', date: today, classification: 'Institucional' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingItem) {
                await updateComunicado(editingItem.id, formData);
            } else {
                await createComunicado(formData);
            }
            await loadData();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving:", error);
            alert("Error al guardar. Verifica la consola para más detalles.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string | number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este comunicado?')) return;
        
        try {
            await deleteComunicado(id);
            await loadData();
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error al eliminar.");
        }
    };

    if (loading) {
        return <div className="flex h-64 items-center justify-center text-white"><Loader2 className="animate-spin mr-2"/> Cargando datos...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Comunicados</h1>
                    <p className="text-sm text-gray-400">Gestiona los avisos públicos de la plataforma</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={16} /> Nuevo Comunicado
                </button>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="text-xs uppercase bg-white/5 text-gray-400 font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Clasificación</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {comunicados.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">No hay comunicados registrados o está en modo local.</td>
                                </tr>
                            ) : (
                                comunicados.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white max-w-xs truncate" title={item.title}>{item.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest border border-indigo-500/20 inline-block">
                                                {item.classification}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{item.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(item)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors border border-transparent hover:border-indigo-400/20" title="Editar">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20" title="Eliminar">
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

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                                {editingItem ? <Edit2 size={18} className="text-indigo-400"/> : <Plus size={18} className="text-indigo-400"/>}
                                {editingItem ? 'Editar Comunicado' : 'Nuevo Comunicado'}
                            </h3>
                            <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título del Aviso</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium placeholder:text-gray-600"
                                    placeholder="Ej: Suspensión de labores el día inhábil..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Clasificación</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={formData.classification}
                                            onChange={e => setFormData({...formData, classification: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm appearance-none cursor-pointer font-medium"
                                        >
                                            {clasificaciones.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                                            ▼
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Fecha (Etiqueta)</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium"
                                        placeholder="Ej: 15 Mar"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción Contextual (Opcional)</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm min-h-[100px] resize-y font-medium placeholder:text-gray-600"
                                    placeholder="Detalles adicionales que deben aparecer debajo del aviso..."
                                />
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-xl text-xs uppercase font-black tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs uppercase font-black tracking-widest transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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
