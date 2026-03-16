'use client';

import { useState, useEffect } from 'react';
import {
    Save, Loader2, CheckCircle, AlertCircle, Plus, Trash2,
    Bell, Calendar, FileText, Users, Phone, Edit2, X
} from 'lucide-react';
import {
    getComunicados, getFechasImportantes, getTramites, getTutoresProfesores, getContactos,
    createComunicado, updateComunicado, deleteComunicado,
    createFechaImportante, updateFechaImportante, deleteFechaImportante,
    createTramite, updateTramite, deleteTramite,
    createTutorProfesor, updateTutorProfesor, deleteTutorProfesor,
    createContacto, updateContacto, deleteContacto
} from '@/lib/api';
import { Comunicado, FechaImportante, Tramite, TutorProfesor, Contacto } from '@/types';

type SectionType = 'comunicados' | 'fechas' | 'tramites' | 'tutores' | 'contactos';

export default function AdminInfoInteres() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Data State
    const [comunicados, setComunicados] = useState<Comunicado[]>([]);
    const [fechas, setFechas] = useState<FechaImportante[]>([]);
    const [tramites, setTramites] = useState<Tramite[]>([]);
    const [tutoresProfs, setTutoresProfs] = useState<TutorProfesor[]>([]);
    const [contactos, setContactos] = useState<Contacto[]>([]);

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
            const [c, f, t, tp, co] = await Promise.all([
                getComunicados(),
                getFechasImportantes(),
                getTramites(),
                getTutoresProfesores(),
                getContactos()
            ]);
            setComunicados(c || []);
            setFechas(f || []);
            setTramites(t || []);
            setTutoresProfs(tp || []);
            setContactos(co || []);
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
            // Estructuras por defecto para nuevos elementos
            const today = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
            if (section === 'comunicados') setFormData({ title: '', description: '', date: today, classification: 'Institucional' });
            else if (section === 'fechas') setFormData({ date: '', title: '', urgent: false });
            else if (section === 'tramites') setFormData({ title: '', description: '', link: '' });
            else if (section === 'tutores') setFormData({ classification: 'Tutor', title: '', link: '' });
            else if (section === 'contactos') setFormData({ title: '', correo: '', ext: '' });
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
            if (activeSection === 'comunicados') {
                if (editingItem) await updateComunicado(editingItem.id, formData);
                else await createComunicado(formData);
            } else if (activeSection === 'fechas') {
                if (editingItem) await updateFechaImportante(editingItem.id, formData);
                else await createFechaImportante(formData);
            } else if (activeSection === 'tramites') {
                if (editingItem) await updateTramite(editingItem.id, formData);
                else await createTramite(formData);
            } else if (activeSection === 'tutores') {
                if (editingItem) await updateTutorProfesor(editingItem.id, formData);
                else await createTutorProfesor(formData);
            } else if (activeSection === 'contactos') {
                if (editingItem) await updateContacto(editingItem.id, formData);
                else await createContacto(formData);
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
            if (section === 'comunicados') await deleteComunicado(id);
            else if (section === 'fechas') await deleteFechaImportante(id);
            else if (section === 'tramites') await deleteTramite(id);
            else if (section === 'tutores') await deleteTutorProfesor(id);
            else if (section === 'contactos') await deleteContacto(id);
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
        icon: any,
        title: string,
        description: string,
        data: any[],
        columns: { key: string, label: string, render?: (item: any) => React.ReactNode }[],
        color: string
    ) => {
        const colorClasses: Record<string, { bg: string, text: string, button: string, border: string }> = {
            blue: { bg: 'bg-blue-600', text: 'text-blue-400', button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20', border: 'border-blue-500/20' },
            purple: { bg: 'bg-purple-600', text: 'text-purple-400', button: 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20', border: 'border-purple-500/20' },
            amber: { bg: 'bg-amber-600', text: 'text-amber-400', button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20', border: 'border-amber-500/20' },
            emerald: { bg: 'bg-emerald-600', text: 'text-emerald-400', button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20', border: 'border-emerald-500/20' },
            yellow: { bg: 'bg-yellow-600', text: 'text-yellow-400', button: 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-500/20', border: 'border-yellow-500/20' },
        };
        const c = colorClasses[color];

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
                        className={`flex items-center gap-2 ${c.button} text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg`}
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
                                data.map(item => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        {columns.map(col => (
                                            <td key={`${item.id}-${col.key}`} className="px-6 py-4 font-medium max-w-[200px] truncate" title={item[col.key]}>
                                                {col.render ? col.render(item) : item[col.key]}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(section, item)} className={`p-2 ${c.text} hover:bg-white/5 rounded-lg transition-colors border border-transparent`} title="Editar">
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
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Información de Interés</h1>
                    <p className="text-sm text-gray-400 mt-1">Administra fechas, comunicados, trámites y contactos globales.</p>
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
                {renderTable('comunicados', <Bell className="text-white" size={20} />, 'Comunicados', 'Avisos de interés general', comunicados, [
                    { key: 'title', label: 'Título' },
                    { key: 'classification', label: 'Tipo', render: (i) => <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-widest">{i.classification}</span> },
                    { key: 'date', label: 'Fecha' }
                ], 'blue')}

                {renderTable('fechas', <Calendar className="text-white" size={20} />, 'Fechas Importantes', 'Próximos eventos y entregas', fechas, [
                    { key: 'date', label: 'Fecha' },
                    { key: 'title', label: 'Título' },
                    { key: 'urgent', label: 'Estado', render: (i) => i.urgent ? <span className="text-red-400 text-xs font-bold uppercase flex items-center gap-1"><AlertCircle size={12}/> Urgente</span> : <span className="text-gray-500 text-xs font-bold uppercase">Normal</span> }
                ], 'purple')}

                {renderTable('tramites', <FileText className="text-white" size={20} />, 'Trámites', 'Procedimientos y enlaces', tramites, [
                    { key: 'title', label: 'Trámite' },
                    { key: 'description', label: 'Descripción' },
                    { key: 'link', label: 'Enlace', render: (i) => i.link ? <a href={i.link} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Ver link</a> : '-' }
                ], 'amber')}

                {renderTable('tutores', <Users className="text-white" size={20} />, 'Tutores / Profesores', 'Recursos para docentes', tutoresProfs, [
                    { key: 'classification', label: 'Dirigido a', render: (i) => <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-widest border ${i.classification === 'Tutor' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'}`}>{i.classification}</span> },
                    { key: 'title', label: 'Recurso' },
                    { key: 'link', label: 'Enlace', render: (i) => i.link ? <a href={i.link} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Ver link</a> : '-' }
                ], 'emerald')}

                {renderTable('contactos', <Phone className="text-white" size={20} />, 'Directorio de Contactos', 'Correos y extensiones', contactos, [
                    { key: 'title', label: 'Área / Nombre' },
                    { key: 'correo', label: 'Correo Electrónico', render: (i) => <a href={`mailto:${i.correo}`} className="text-yellow-400 hover:underline">{i.correo}</a> },
                    { key: 'ext', label: 'Extensión' }
                ], 'yellow')}
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
                            {/* --- FORMULARIO COMUNICADOS --- */}
                            {activeSection === 'comunicados' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Clasificación</label>
                                            <select value={formData.classification} onChange={e => setFormData({...formData, classification: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium">
                                                <option value="Institucional">Institucional</option>
                                                <option value="Académico">Académico</option>
                                                <option value="Investigación">Investigación</option>
                                                <option value="Otros">Otros</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Fecha</label>
                                            <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción</label>
                                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm min-h-[100px] resize-y font-medium" />
                                    </div>
                                </>
                            )}

                            {/* --- FORMULARIO FECHAS --- */}
                            {activeSection === 'fechas' && (
                                <>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Fecha</label>
                                            <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Ej: 12 Ene" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título del Evento</label>
                                            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-white/5">
                                        <input type="checkbox" id="urgentCheck" checked={formData.urgent || false} onChange={e => setFormData({...formData, urgent: e.target.checked})} className="w-5 h-5 accent-red-500 rounded cursor-pointer" />
                                        <label htmlFor="urgentCheck" className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                                            <AlertCircle size={16} /> Marcar como urgente (Rojo)
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* --- FORMULARIO TRÁMITES --- */}
                            {activeSection === 'tramites' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título del Trámite</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción</label>
                                        <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Enlace de descarga o portal (URL)</label>
                                        <input type="url" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" placeholder="https://..." />
                                    </div>
                                </>
                            )}

                            {/* --- FORMULARIO TUTORES/PROFESORES --- */}
                            {activeSection === 'tutores' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dirigido a</label>
                                        <select value={formData.classification} onChange={e => setFormData({...formData, classification: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium">
                                            <option value="Tutor">Tutor</option>
                                            <option value="Profesor">Profesor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título del Recurso</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Enlace del Recurso (URL)</label>
                                        <input type="url" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" placeholder="https://..." />
                                    </div>
                                </>
                            )}

                            {/* --- FORMULARIO CONTACTOS --- */}
                            {activeSection === 'contactos' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Área o Persona</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Correo Electrónico</label>
                                            <input required type="email" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Extensión</label>
                                            <input type="text" value={formData.ext || ''} onChange={e => setFormData({...formData, ext: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-all text-sm font-medium" />
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
