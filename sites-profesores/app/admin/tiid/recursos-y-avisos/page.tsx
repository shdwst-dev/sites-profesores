'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle, Users, LayoutGrid, Calendar, GraduationCap, MapPin, AlignLeft } from 'lucide-react';
import {
    getEncargadoTutorias,
    getCoordinacionPI,
    getCoordinacionEstancias,
    getCoordinacionTutores,
    getRecursosGenericos,
    getCalendario,
    getLenguaExtranjera,
    updateEncargadoTutorias,
    updateCoordinacion,
    updateCoordinacionTutores,
    updateRecursoGenerico,
    updateCalendario,
    updateLenguaExtranjera,
    getEntregables,
    getDocumentosDescarga,
    createEntregable,
    updateEntregable,
    deleteEntregable,
    createDocumentoDescarga,
    updateDocumentoDescarga,
    deleteDocumentoDescarga
} from '@/lib/api';
import {
    EncargadoTutoria,
    Coordinacion,
    CoordinacionTutores,
    RecursoGenerico,
    CalendarioData,
    LenguaExtranjeraData,
    Entregable,
    DocumentoDescarga
} from '@/types';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminTIIDRecursos() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Data State
    const [encargado, setEncargado] = useState<EncargadoTutoria | null>(null);
    const [pi, setPi] = useState<Coordinacion | null>(null);
    const [estancias, setEstancias] = useState<Coordinacion | null>(null);
    const [tutores, setTutores] = useState<CoordinacionTutores | null>(null);
    const [calendario, setCalendario] = useState<CalendarioData | null>(null);
    const [lengua, setLengua] = useState<LenguaExtranjeraData | null>(null);
    const [casilleros, setCasilleros] = useState<RecursoGenerico | null>(null);
    const [entregables, setEntregables] = useState<Entregable[]>([]);
    const [descargas, setDescargas] = useState<DocumentoDescarga[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [e, p, est, t, c, l, ca] = await Promise.all([
                getEncargadoTutorias('TIID'),
                getCoordinacionPI('TIID'),
                getCoordinacionEstancias('TIID'),
                getCoordinacionTutores('TIID'),
                getCalendario('TIID'),
                getLenguaExtranjera('TIID'),
                getRecursosGenericos('Casilleros', 'TIID')
            ]);
            setEncargado(e);
            setPi(p);
            setEstancias(est);
            setTutores(t);
            setCalendario(c);
            setLengua(l);
            setCasilleros(ca);

            // Fetch lists separately to avoid breaking Promise.all if one fails (optional, but safer)
            const ent = await getEntregables('TIID');
            const doc = await getDocumentosDescarga('TIID');
            setEntregables(ent);
            setDescargas(doc);
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
            // Optional: Reload data to confirm? usually not needed if local state is updated
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
                    <h1 className="text-3xl font-black text-white">Editar Recursos TIID</h1>
                    <p className="text-gray-400">Actualiza la información visible en la página de Recursos y Avisos.</p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}
            </header>


            {/* Entregables */}
            <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="p-3 bg-indigo-600 rounded-xl"><CheckCircle size={20} className="text-white" /></div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Entregables</h2>
                        <p className="text-sm text-gray-400">Tabla de fechas y entregas importantes</p>
                    </div>
                    <button
                        onClick={async () => {
                            await createEntregable({ stage: 'Nueva Etapa', title: 'Nuevo Entregable', deadline: 'Fecha límite' });
                            setEntregables(await getEntregables('TIID'));
                        }}
                        className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                        <Plus size={20} className="text-white" />
                    </button>
                </div>
                <div className="space-y-4">
                    {entregables.map((item, idx) => (
                        <div key={item.id || idx} className="grid md:grid-cols-12 gap-4 items-end bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <div className="md:col-span-3">
                                <Input label="Etapa / Semana" value={item.stage} onChange={v => {
                                    const newItems = [...entregables];
                                    newItems[idx] = { ...item, stage: v };
                                    setEntregables(newItems);
                                }} />
                            </div>
                            <div className="md:col-span-5">
                                <Input label="Título / Descripción" value={item.title} onChange={v => {
                                    const newItems = [...entregables];
                                    newItems[idx] = { ...item, title: v };
                                    setEntregables(newItems);
                                }} />
                            </div>
                            <div className="md:col-span-3">
                                <Input label="Fecha Límite" value={item.deadline} onChange={v => {
                                    const newItems = [...entregables];
                                    newItems[idx] = { ...item, deadline: v };
                                    setEntregables(newItems);
                                }} />
                            </div>
                            <div className="md:col-span-1 flex justify-end gap-2">
                                <button
                                    onClick={async () => {
                                        if (confirm('¿Eliminar este entregable?')) {
                                            await deleteEntregable(item.id);
                                            setEntregables(entregables.filter(i => i.id !== item.id));
                                        }
                                    }}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleSave(`entregable-${item.id}`, async () => updateEntregable(item.id, item))}
                                    disabled={saving === `entregable-${item.id}`}
                                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50"
                                >
                                    {saving === `entregable-${item.id}` ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Documentos Descarga */}
            <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="p-3 bg-indigo-600 rounded-xl"><CheckCircle size={20} className="text-white" /></div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Documentos de Descarga</h2>
                        <p className="text-sm text-gray-400">Formatos y guías para descargar</p>
                    </div>
                    <button
                        onClick={async () => {
                            await createDocumentoDescarga({ title: 'Nuevo Documento', link: '#', icon: 'FileText', color: 'bg-blue-50' });
                            setDescargas(await getDocumentosDescarga('TIID'));
                        }}
                        className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                        <Plus size={20} className="text-white" />
                    </button>
                </div>
                <div className="space-y-4">
                    {descargas.map((item, idx) => (
                        <div key={item.id || idx} className="grid md:grid-cols-12 gap-4 items-end bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <div className="md:col-span-3">
                                <Input label="Título" value={item.title} onChange={v => {
                                    const newItems = [...descargas];
                                    newItems[idx] = { ...item, title: v };
                                    setDescargas(newItems);
                                }} />
                            </div>
                            <div className="md:col-span-3">
                                <Input label="Link (URL)" value={item.link} onChange={v => {
                                    const newItems = [...descargas];
                                    newItems[idx] = { ...item, link: v };
                                    setDescargas(newItems);
                                }} />
                            </div>
                            <div className="md:col-span-2">
                                <Input label="Icono" value={item.icon} onChange={v => {
                                    const newItems = [...descargas];
                                    newItems[idx] = { ...item, icon: v as any };
                                    setDescargas(newItems);
                                }} />
                            </div>
                            <div className="md:col-span-2">
                                <Input label="Color (Tailwind)" value={item.color || ''} onChange={v => {
                                    const newItems = [...descargas];
                                    newItems[idx] = { ...item, color: v };
                                    setDescargas(newItems);
                                }} />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button
                                    onClick={async () => {
                                        if (confirm('¿Eliminar este documento?')) {
                                            await deleteDocumentoDescarga(item.id);
                                            setDescargas(descargas.filter(i => i.id !== item.id));
                                        }
                                    }}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleSave(`descarga-${item.id}`, async () => updateDocumentoDescarga(item.id, item))}
                                    disabled={saving === `descarga-${item.id}`}
                                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50"
                                >
                                    {saving === `descarga-${item.id}` ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Encargado Tutorias */}
            {encargado && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><Users size={20} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white">Encargada de Tutorías</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Nombre" value={encargado.name} onChange={v => setEncargado({ ...encargado, name: v })} />
                        <Input label="Correo" value={encargado.correo} onChange={v => setEncargado({ ...encargado, correo: v })} />
                        <Input label="Extensión" value={encargado.ext} onChange={v => setEncargado({ ...encargado, ext: v })} />
                        <Input label="URL Imagen" value={encargado.image || ''} onChange={v => setEncargado({ ...encargado, image: v })} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'encargado'}
                            onClick={() => handleSave('encargado', async () => updateEncargadoTutorias(encargado.id, encargado))}
                        />
                    </div>
                </section>
            )}

            {/* Coordinacion PI */}
            {pi && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><LayoutGrid size={20} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white">Coordinación PI</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Título" value={pi.title} onChange={v => setPi({ ...pi, title: v })} />
                        <Input label="Nombre del Coordinador" value={pi.name} onChange={v => setPi({ ...pi, name: v })} />
                        <Input label="Correo" value={pi.correo} onChange={v => setPi({ ...pi, correo: v })} />
                        <Input label="URL Imagen" value={pi.image} onChange={v => setPi({ ...pi, image: v })} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'pi'}
                            onClick={() => handleSave('pi', async () => updateCoordinacion(pi.id, pi))}
                        />
                    </div>
                </section>
            )}

            {/* Coordinacion Estancias */}
            {estancias && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><LayoutGrid size={20} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white">Coordinación Estancias</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Título" value={estancias.title} onChange={v => setEstancias({ ...estancias, title: v })} />
                        <Input label="Nombre del Coordinador" value={estancias.name} onChange={v => setEstancias({ ...estancias, name: v })} />
                        <Input label="Correo" value={estancias.correo} onChange={v => setEstancias({ ...estancias, correo: v })} />
                        <Input label="URL Imagen" value={estancias.image} onChange={v => setEstancias({ ...estancias, image: v })} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'estancias'}
                            onClick={() => handleSave('estancias', async () => updateCoordinacion(estancias.id, estancias))}
                        />
                    </div>
                </section>
            )}

            {/* Coordinacion Tutores */}
            {tutores && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><Users size={20} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white">Coordinación de Tutores</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Título" value={tutores.title} onChange={v => setTutores({ ...tutores, title: v })} />
                        <Input label="Periodo" value={tutores.period} onChange={v => setTutores({ ...tutores, period: v })} />
                        <Input label="URL Imagen (si no hay tabla)" value={tutores.image || ''} onChange={v => setTutores({ ...tutores, image: v })} />
                    </div>

                    {/* Lista de Tutores */}
                    <div className="mt-6 border-t border-white/5 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Lista de Tutores por Grupo</h3>
                            <button
                                onClick={() => {
                                    const currentTutors = tutores.tutors || [];
                                    setTutores({ ...tutores, tutors: [...currentTutors, { group: 'Nuevo Grupo', tutor: 'Nombre del Tutor' }] });
                                }}
                                className="text-sm flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                <Plus size={16} /> Añadir Grupo
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(tutores.tutors || []).map((t, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <div className="w-32">
                                        <input
                                            type="text"
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                            value={t.group}
                                            onChange={e => {
                                                const newTutors = [...(tutores.tutors || [])];
                                                newTutors[idx] = { ...t, group: e.target.value };
                                                setTutores({ ...tutores, tutors: newTutors });
                                            }}
                                            placeholder="Grupo"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                            value={t.tutor}
                                            onChange={e => {
                                                const newTutors = [...(tutores.tutors || [])];
                                                newTutors[idx] = { ...t, tutor: e.target.value };
                                                setTutores({ ...tutores, tutors: newTutors });
                                            }}
                                            placeholder="Nombre del Tutor"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newTutors = (tutores.tutors || []).filter((_, i) => i !== idx);
                                            setTutores({ ...tutores, tutors: newTutors });
                                        }}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {(!tutores.tutors || tutores.tutors.length === 0) && (
                                <p className="text-gray-500 italic text-sm">No hay tutores asignados. Añade uno arriba.</p>
                            )}
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nota</label>
                        <textarea
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white resize-y min-h-[100px] focus:outline-none focus:border-indigo-500 transition-colors"
                            value={tutores.note || ''}
                            onChange={e => setTutores({ ...tutores, note: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'tutores'}
                            onClick={() => handleSave('tutores', async () => updateCoordinacionTutores(tutores.id, tutores))}
                        />
                    </div>
                </section>
            )}

            {/* Calendario */}
            {calendario && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><Calendar size={20} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white">Calendario Escolar</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Ciclo" value={calendario.cycle} onChange={v => setCalendario({ ...calendario, cycle: v })} />
                        <Input label="URL Imagen" value={calendario.image} onChange={v => setCalendario({ ...calendario, image: v })} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'calendario'}
                            onClick={() => handleSave('calendario', async () => updateCalendario(calendario.id!, calendario))}
                        />
                    </div>
                </section>
            )}

            {/* Lengua Extranjera */}
            {lengua && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><GraduationCap size={20} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white">Lengua Extranjera</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Título" value={lengua.title} onChange={v => setLengua({ ...lengua, title: v })} />
                        <Input label="Link de Solicitud" value={lengua.requestLink} onChange={v => setLengua({ ...lengua, requestLink: v })} />
                        <Input label="Nombre Contacto" value={lengua.reports.name} onChange={v => setLengua({ ...lengua, reports: { ...lengua.reports, name: v } })} />
                        <Input label="Correo Contacto" value={lengua.reports.correo} onChange={v => setLengua({ ...lengua, reports: { ...lengua.reports, correo: v } })} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'lengua'}
                            onClick={() => handleSave('lengua', async () => updateLenguaExtranjera(lengua.id!, lengua))}
                        />
                    </div>
                </section>
            )}

            {/* Casilleros */}
            {casilleros && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><MapPin size={20} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white">Casilleros</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Título" value={casilleros.title} onChange={v => setCasilleros({ ...casilleros, title: v })} />
                        <Input label="Link de Solicitud" value={casilleros.link || ''} onChange={v => setCasilleros({ ...casilleros, link: v })} />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción</label>
                        <textarea
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white resize-y min-h-[100px] focus:outline-none focus:border-indigo-500 transition-colors"
                            value={casilleros.description || ''}
                            onChange={e => setCasilleros({ ...casilleros, description: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'casilleros'}
                            onClick={() => handleSave('casilleros', async () => updateRecursoGenerico(casilleros.id, casilleros))}
                        />
                    </div>
                </section>
            )}

        </div>
    );
}

// Subcomponents for cleaner code
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

function Button({ loading, onClick }: { loading: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
    );
}
