'use client';

import { useState, useEffect } from 'react';
import {
    Save, Loader2, CheckCircle, AlertCircle, Plus, Trash2,
    Bell, Calendar, FileText, Users, Phone
} from 'lucide-react';
import {
    getComunicados,
    getFechasImportantes,
    getTramites,
    getTutoresProfesores,
    getContactos,
    createComunicado,
    updateComunicado,
    deleteComunicado,
    createFechaImportante,
    updateFechaImportante,
    deleteFechaImportante,
    createTramite,
    updateTramite,
    deleteTramite,
    createTutorProfesor,
    updateTutorProfesor,
    deleteTutorProfesor,
    createContacto,
    updateContacto,
    deleteContacto
} from '@/lib/api';
import {
    Comunicado,
    FechaImportante,
    Tramite,
    TutorProfesor,
    Contacto
} from '@/types';

export default function AdminInfoInteres() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Data State
    const [comunicados, setComunicados] = useState<Comunicado[]>([]);
    const [fechas, setFechas] = useState<FechaImportante[]>([]);
    const [tramites, setTramites] = useState<Tramite[]>([]);
    const [tutoresProfs, setTutoresProfs] = useState<TutorProfesor[]>([]);
    const [contactos, setContactos] = useState<Contacto[]>([]);

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
            setComunicados(c);
            setFechas(f);
            setTramites(t);
            setTutoresProfs(tp);
            setContactos(co);
        } catch (error) {
            console.error("Error loading data", error);
            setMessage({ type: 'error', text: 'Error al cargar los datos. Recargue la página.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (section: string, action: () => Promise<void>) => {
        try {
            setSaving(section);
            setMessage(null);
            await action();
            setMessage({ type: 'success', text: 'Cambios guardados correctamente.' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Error al guardar los cambios.' });
        } finally {
            setSaving(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-96 text-white"><Loader2 className="animate-spin" /> Cargando...</div>;

    return (
        <div className="space-y-10 pb-20">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Editar Información de Interés</h1>
                    <p className="text-gray-400">Actualiza los comunicados, fechas, trámites, tutores/profesores y contactos.</p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}
            </header>

            {/* ───── Comunicados ───── */}
            <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="p-3 bg-blue-600 rounded-xl"><Bell size={20} className="text-white" /></div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Comunicados</h2>
                        <p className="text-sm text-gray-400">Comunicados visibles en la sección principal</p>
                    </div>
                    <button
                        onClick={async () => {
                            await createComunicado({ title: 'Nuevo comunicado', description: 'Descripción...', date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }), classification: 'Institucional' });
                            setComunicados(await getComunicados());
                        }}
                        className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        <Plus size={20} className="text-white" />
                    </button>
                </div>
                <div className="space-y-4">
                    {comunicados.map((item, idx) => (
                        <div key={item.id || idx} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="Título" value={item.title} onChange={v => {
                                    const n = [...comunicados]; n[idx] = { ...item, title: v }; setComunicados(n);
                                }} />
                                <Input label="Fecha" value={item.date} onChange={v => {
                                    const n = [...comunicados]; n[idx] = { ...item, date: v }; setComunicados(n);
                                }} />
                            </div>
                            <div className="grid md:grid-cols-12 gap-4">
                                <div className="md:col-span-8">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción</label>
                                    <textarea
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-y min-h-[80px]"
                                        value={item.description}
                                        onChange={e => {
                                            const n = [...comunicados]; n[idx] = { ...item, description: e.target.value }; setComunicados(n);
                                        }}
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Clasificación</label>
                                    <select
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={item.classification}
                                        onChange={e => {
                                            const n = [...comunicados]; n[idx] = { ...item, classification: e.target.value }; setComunicados(n);
                                        }}
                                    >
                                        <option value="Institucional">Institucional</option>
                                        <option value="Académico">Académico</option>
                                        <option value="Investigación">Investigación</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={async () => {
                                        if (confirm('¿Eliminar este comunicado?')) {
                                            await deleteComunicado(item.id);
                                            setComunicados(comunicados.filter(i => i.id !== item.id));
                                        }
                                    }}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleSave(`comunicado-${item.id}`, async () => updateComunicado(item.id, item))}
                                    disabled={saving === `comunicado-${item.id}`}
                                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50"
                                >
                                    {saving === `comunicado-${item.id}` ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───── Fechas Importantes ───── */}
            <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="p-3 bg-purple-600 rounded-xl"><Calendar size={20} className="text-white" /></div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Fechas Importantes</h2>
                        <p className="text-sm text-gray-400">Fechas y deadlines visibles en la barra lateral</p>
                    </div>
                    <button
                        onClick={async () => {
                            await createFechaImportante({ date: '01 Ene', title: 'Nueva fecha', urgent: false });
                            setFechas(await getFechasImportantes());
                        }}
                        className="p-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                    >
                        <Plus size={20} className="text-white" />
                    </button>
                </div>
                <div className="space-y-4">
                    {fechas.map((item, idx) => (
                        <div key={item.id || idx} className="grid md:grid-cols-12 gap-4 items-end bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <div className="md:col-span-2">
                                <Input label="Fecha" value={item.date} onChange={v => {
                                    const n = [...fechas]; n[idx] = { ...item, date: v }; setFechas(n);
                                }} />
                            </div>
                            <div className="md:col-span-6">
                                <Input label="Título" value={item.title} onChange={v => {
                                    const n = [...fechas]; n[idx] = { ...item, title: v }; setFechas(n);
                                }} />
                            </div>
                            <div className="md:col-span-2 flex items-center gap-2 pb-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={item.urgent || false}
                                        onChange={e => {
                                            const n = [...fechas]; n[idx] = { ...item, urgent: e.target.checked }; setFechas(n);
                                        }}
                                        className="w-4 h-4 rounded accent-red-500"
                                    />
                                    <span className="text-xs font-bold text-red-400 uppercase">Urgente</span>
                                </label>
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button
                                    onClick={async () => {
                                        if (confirm('¿Eliminar esta fecha?')) {
                                            await deleteFechaImportante(item.id);
                                            setFechas(fechas.filter(i => i.id !== item.id));
                                        }
                                    }}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleSave(`fecha-${item.id}`, async () => updateFechaImportante(item.id, item))}
                                    disabled={saving === `fecha-${item.id}`}
                                    className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50"
                                >
                                    {saving === `fecha-${item.id}` ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───── Trámites ───── */}
            <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="p-3 bg-amber-600 rounded-xl"><FileText size={20} className="text-white" /></div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Trámites y Procedimientos</h2>
                        <p className="text-sm text-gray-400">Trámites con enlace a recursos externos</p>
                    </div>
                    <button
                        onClick={async () => {
                            await createTramite({ title: 'Nuevo trámite', description: 'Descripción del trámite', link: '#' });
                            setTramites(await getTramites());
                        }}
                        className="p-2 bg-amber-600 rounded-lg hover:bg-amber-500 transition-colors"
                    >
                        <Plus size={20} className="text-white" />
                    </button>
                </div>
                <div className="space-y-4">
                    {tramites.map((item, idx) => (
                        <div key={item.id || idx} className="grid md:grid-cols-12 gap-4 items-end bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <div className="md:col-span-3">
                                <Input label="Título" value={item.title} onChange={v => {
                                    const n = [...tramites]; n[idx] = { ...item, title: v }; setTramites(n);
                                }} />
                            </div>
                            <div className="md:col-span-5">
                                <Input label="Descripción" value={item.description} onChange={v => {
                                    const n = [...tramites]; n[idx] = { ...item, description: v }; setTramites(n);
                                }} />
                            </div>
                            <div className="md:col-span-2">
                                <Input label="Link" value={item.link || ''} onChange={v => {
                                    const n = [...tramites]; n[idx] = { ...item, link: v }; setTramites(n);
                                }} />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button
                                    onClick={async () => {
                                        if (confirm('¿Eliminar este trámite?')) {
                                            await deleteTramite(item.id);
                                            setTramites(tramites.filter(i => i.id !== item.id));
                                        }
                                    }}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleSave(`tramite-${item.id}`, async () => updateTramite(item.id, item))}
                                    disabled={saving === `tramite-${item.id}`}
                                    className="p-3 bg-amber-600 text-white rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-50"
                                >
                                    {saving === `tramite-${item.id}` ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───── Tutores / Profesores ───── */}
            <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="p-3 bg-emerald-600 rounded-xl"><Users size={20} className="text-white" /></div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Tutores y Profesores</h2>
                        <p className="text-sm text-gray-400">Links de recursos para tutores y profesores</p>
                    </div>
                    <button
                        onClick={async () => {
                            await createTutorProfesor({ classification: 'Tutor', title: 'Nuevo recurso', link: '#' });
                            setTutoresProfs(await getTutoresProfesores());
                        }}
                        className="p-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors"
                    >
                        <Plus size={20} className="text-white" />
                    </button>
                </div>
                <div className="space-y-4">
                    {tutoresProfs.map((item, idx) => (
                        <div key={item.id || idx} className="grid md:grid-cols-12 gap-4 items-end bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tipo</label>
                                <select
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    value={item.classification}
                                    onChange={e => {
                                        const n = [...tutoresProfs]; n[idx] = { ...item, classification: e.target.value as 'Tutor' | 'Profesor' }; setTutoresProfs(n);
                                    }}
                                >
                                    <option value="Tutor">Tutor</option>
                                    <option value="Profesor">Profesor</option>
                                </select>
                            </div>
                            <div className="md:col-span-5">
                                <Input label="Título" value={item.title} onChange={v => {
                                    const n = [...tutoresProfs]; n[idx] = { ...item, title: v }; setTutoresProfs(n);
                                }} />
                            </div>
                            <div className="md:col-span-3">
                                <Input label="Link" value={item.link} onChange={v => {
                                    const n = [...tutoresProfs]; n[idx] = { ...item, link: v }; setTutoresProfs(n);
                                }} />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button
                                    onClick={async () => {
                                        if (confirm('¿Eliminar este recurso?')) {
                                            await deleteTutorProfesor(item.id);
                                            setTutoresProfs(tutoresProfs.filter(i => i.id !== item.id));
                                        }
                                    }}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleSave(`tutor-${item.id}`, async () => updateTutorProfesor(item.id, item))}
                                    disabled={saving === `tutor-${item.id}`}
                                    className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50"
                                >
                                    {saving === `tutor-${item.id}` ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───── Contactos ───── */}
            <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="p-3 bg-yellow-600 rounded-xl"><Phone size={20} className="text-white" /></div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Contactos</h2>
                        <p className="text-sm text-gray-400">Directorio de contactos departamentales</p>
                    </div>
                    <button
                        onClick={async () => {
                            await createContacto({ title: 'Nuevo contacto', correo: 'correo@upq.edu.mx', ext: '000' });
                            setContactos(await getContactos());
                        }}
                        className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                        <Plus size={20} className="text-white" />
                    </button>
                </div>
                <div className="space-y-4">
                    {contactos.map((item, idx) => (
                        <div key={item.id || idx} className="grid md:grid-cols-12 gap-4 items-end bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <div className="md:col-span-3">
                                <Input label="Título / Área" value={item.title} onChange={v => {
                                    const n = [...contactos]; n[idx] = { ...item, title: v }; setContactos(n);
                                }} />
                            </div>
                            <div className="md:col-span-5">
                                <Input label="Correo" value={item.correo} onChange={v => {
                                    const n = [...contactos]; n[idx] = { ...item, correo: v }; setContactos(n);
                                }} />
                            </div>
                            <div className="md:col-span-2">
                                <Input label="Extensión" value={item.ext} onChange={v => {
                                    const n = [...contactos]; n[idx] = { ...item, ext: v }; setContactos(n);
                                }} />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button
                                    onClick={async () => {
                                        if (confirm('¿Eliminar este contacto?')) {
                                            await deleteContacto(item.id);
                                            setContactos(contactos.filter(i => i.id !== item.id));
                                        }
                                    }}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleSave(`contacto-${item.id}`, async () => updateContacto(item.id, item))}
                                    disabled={saving === `contacto-${item.id}`}
                                    className="p-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50"
                                >
                                    {saving === `contacto-${item.id}` ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}

// Subcomponents
function Input({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="w-full">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
            <input
                type="text"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
