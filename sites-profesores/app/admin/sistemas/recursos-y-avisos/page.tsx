'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle, Users, LayoutGrid, Calendar, GraduationCap, MapPin, AlignLeft, BookOpen, Info } from 'lucide-react';
import Input from '@/components/admin/Input';
import { default as Button } from '@/components/admin/SaveButton';
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
    updateLenguaExtranjera
} from '@/lib/api';
import {
    EncargadoTutoria,
    Coordinacion,
    CoordinacionTutores,
    RecursoGenerico,
    CalendarioData,
    LenguaExtranjeraData
} from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import FileInput from '@/components/admin/FileInput';

export default function AdminSistemasRecursos() {
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
    const [recursamientos, setRecursamientos] = useState<RecursoGenerico | null>(null);
    const [altasBajas, setAltasBajas] = useState<RecursoGenerico | null>(null);
    const [criteriosETC, setCriteriosETC] = useState<RecursoGenerico | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [e, p, est, t, c, l, ca, rec, ab, crit] = await Promise.all([
                getEncargadoTutorias('Sistemas'),
                getCoordinacionPI('Sistemas'),
                getCoordinacionEstancias('Sistemas'),
                getCoordinacionTutores('Sistemas'),
                getCalendario('Sistemas'),
                getLenguaExtranjera('Sistemas'),
                getRecursosGenericos('Casilleros', 'Sistemas'),
                getRecursosGenericos('Recursamientos', 'Sistemas'),
                getRecursosGenericos('AltasBajas', 'Sistemas'),
                getRecursosGenericos('CriteriosETC', 'Sistemas')
            ]);
            setEncargado(e);
            setPi(p);
            setEstancias(est);
            setTutores(t);
            setCalendario(c);
            setLengua(l);
            setCasilleros(ca);

            // Initialize defaults if missing
            setRecursamientos(rec || { id: Date.now(), title: 'Proceso de Recursamientos', type: 'Recursamientos', content: { date: 'Fecha...', cost: 'Costo...' } });
            setAltasBajas(ab || { id: Date.now(), title: 'Portal de Registro', type: 'AltasBajas', link: '' });
            setCriteriosETC(crit || { id: Date.now(), title: 'Criterios ETC', type: 'CriteriosETC', content: [] });
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
                    <h1 className="text-3xl font-black text-white">Editar Recursos Sistemas</h1>
                    <p className="text-gray-400">Actualiza la información visible en la página de Recursos y Avisos de Sistemas Computacionales.</p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}
            </header>


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
                        <FileInput label="URL Imagen" value={encargado.image || ''} onChange={v => setEncargado({ ...encargado, image: v })} accept="image/*" department="Sistemas" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'encargado'}
                            onClick={() => handleSave('encargado', async () => updateEncargadoTutorias(encargado.id, encargado, 'Sistemas'))}
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
                        <FileInput label="URL Imagen" value={pi.image} onChange={v => setPi({ ...pi, image: v })} accept="image/*" department="Sistemas" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'pi'}
                            onClick={() => handleSave('pi', async () => updateCoordinacion(pi.id, pi, 'Sistemas'))}
                        />
                    </div>
                </section>
            )}

            {/* Recursamientos */}
            {recursamientos && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><AlertCircle size={20} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white">Recursamientos</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Fecha Límite" value={recursamientos.content?.date || ''} onChange={v => setRecursamientos({ ...recursamientos, content: { ...recursamientos.content, date: v } })} />
                        <Input label="Costo" value={recursamientos.content?.cost || ''} onChange={v => setRecursamientos({ ...recursamientos, content: { ...recursamientos.content, cost: v } })} />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pasos a Seguir (JSON)</label>
                        <textarea
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white resize-y min-h-[100px] focus:outline-none focus:border-indigo-500 transition-colors font-mono text-xs"
                            value={recursamientos.content?.steps ? JSON.stringify(recursamientos.content.steps, null, 2) : '[]'}
                            onChange={e => {
                                try {
                                    const steps = JSON.parse(e.target.value);
                                    setRecursamientos({ ...recursamientos, content: { ...recursamientos.content, steps } });
                                } catch (err) {
                                    // Allow typing invalid json momentarily, maybe store in separate state if strict
                                }
                            }}
                            placeholder='[{"step": "01", "text": "..."}]'
                        />
                        <p className="text-xs text-gray-500 mt-1">Edite el JSON array directamente para los pasos.</p>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'recursamientos'}
                            onClick={() => handleSave('recursamientos', async () => updateRecursoGenerico(recursamientos.id, recursamientos, 'Sistemas'))}
                        />
                    </div>
                </section>
            )}

            {/* Altas y Bajas */}
            {altasBajas && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><BookOpen size={20} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white">Altas y Bajas</h2>
                    </div>
                    <div className="grid md:grid-cols-1 gap-6">
                        <Input label="Link de Portal de Registro" value={altasBajas.link || ''} onChange={v => setAltasBajas({ ...altasBajas, link: v })} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'altasTest'}
                            onClick={() => handleSave('altasTest', async () => updateRecursoGenerico(altasBajas.id, altasBajas, 'Sistemas'))}
                        />
                    </div>
                </section>
            )}

            {/* Criterios ETC */}
            {criteriosETC && (
                <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl"><Info size={20} className="text-white" /></div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white">Criterios ETC</h2>
                        </div>
                        <button
                            onClick={() => {
                                const list = Array.isArray(criteriosETC.content) ? criteriosETC.content : [];
                                setCriteriosETC({ ...criteriosETC, content: [...list, { title: 'Nuevo Criterio', description: 'Descripción' }] });
                            }}
                            className="text-sm flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            <Plus size={16} /> Añadir Criterio
                        </button>
                    </div>
                    <div className="space-y-4">
                        {(Array.isArray(criteriosETC.content) ? criteriosETC.content : []).map((c: any, idx: number) => (
                            <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 grid gap-2">
                                <div className="flex justify-between">
                                    <h4 className="text-white font-bold text-sm">Criterio #{idx + 1}</h4>
                                    <button
                                        onClick={() => {
                                            const list = [...(criteriosETC.content as any[])];
                                            list.splice(idx, 1);
                                            setCriteriosETC({ ...criteriosETC, content: list });
                                        }}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <Input label="Título" value={c.title} onChange={v => {
                                    const list = [...(criteriosETC.content as any[])];
                                    list[idx] = { ...list[idx], title: v };
                                    setCriteriosETC({ ...criteriosETC, content: list });
                                }} />
                                <Input label="Descripción" value={c.description} onChange={v => {
                                    const list = [...(criteriosETC.content as any[])];
                                    list[idx] = { ...list[idx], description: v };
                                    setCriteriosETC({ ...criteriosETC, content: list });
                                }} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'criteriosETC'}
                            onClick={() => handleSave('criteriosETC', async () => updateRecursoGenerico(criteriosETC.id, criteriosETC, 'Sistemas'))}
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
                        <FileInput label="URL Imagen" value={estancias.image} onChange={v => setEstancias({ ...estancias, image: v })} accept="image/*" department="Sistemas" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'estancias'}
                            onClick={() => handleSave('estancias', async () => updateCoordinacion(estancias.id, estancias, 'Sistemas'))}
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
                        <FileInput label="URL Imagen (si no hay tabla)" value={tutores.image || ''} onChange={v => setTutores({ ...tutores, image: v })} accept="image/*" department="Sistemas" />
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
                            onClick={() => handleSave('tutores', async () => updateCoordinacionTutores(tutores.id, tutores, 'Sistemas'))}
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
                        <FileInput label="URL Imagen" value={calendario.image} onChange={v => setCalendario({ ...calendario, image: v })} accept="image/*" department="Sistemas" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            loading={saving === 'calendario'}
                            onClick={() => handleSave('calendario', async () => updateCalendario(calendario.id!, calendario, 'Sistemas'))}
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
                            onClick={() => handleSave('lengua', async () => updateLenguaExtranjera(lengua.id!, lengua, 'Sistemas'))}
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
                            onClick={() => handleSave('casilleros', async () => updateRecursoGenerico(casilleros.id, casilleros, 'Sistemas'))}
                        />
                    </div>
                </section>
            )}

        </div>
    );
}
