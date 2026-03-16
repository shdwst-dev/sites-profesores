'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle, Users, LayoutGrid, Calendar, GraduationCap, MapPin, AlignLeft, BookOpen, Info, Edit2, X } from 'lucide-react';
import Input from '@/components/admin/Input';
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
import FileInput from '@/components/admin/FileInput';

export default function AdminTIIDRecursos() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [e, p, est, t, c, l, ca, rec, ab, crit] = await Promise.all([
                getEncargadoTutorias('TIID'),
                getCoordinacionPI('TIID'),
                getCoordinacionEstancias('TIID'),
                getCoordinacionTutores('TIID'),
                getCalendario('TIID'),
                getLenguaExtranjera('TIID'),
                getRecursosGenericos('Casilleros', 'TIID'),
                getRecursosGenericos('Recursamientos', 'TIID'),
                getRecursosGenericos('AltasBajas', 'TIID'),
                getRecursosGenericos('CriteriosETC', 'TIID')
            ]);
            setEncargado(e || { id: Date.now(), title: 'Encargada de Tutorías', type: 'EncargadoTutoria', name: '', correo: '', ext: '', image: '', department: 'TIID' });
            setPi(p || { id: Date.now(), title: 'Coordinación PI', type: 'Coordinacion', name: '', correo: '', image: '', department: 'TIID' });
            setEstancias(est || { id: Date.now(), title: 'Coordinación Estancias', type: 'Coordinacion', name: '', correo: '', image: '', department: 'TIID' });
            setTutores(t || { id: Date.now(), title: 'Coordinación de Tutores', type: 'CoordinacionTutores', period: '', image: '', tutors: [], note: '', department: 'TIID' });
            setCalendario(c || { id: Date.now(), title: 'Calendario Escolar', type: 'Calendario', cycle: '', image: '', department: 'TIID' });
            setLengua(l || { id: Date.now(), title: 'Lengua Extranjera', type: 'LenguaExtranjera', requestLink: '', reports: { name: '', correo: '' }, department: 'TIID' });
            setCasilleros(ca || { id: Date.now(), title: 'Casilleros', type: 'Casilleros', link: '', description: '', department: 'TIID' });
            setRecursamientos(rec || { id: Date.now(), title: 'Proceso de Recursamientos', type: 'Recursamientos', content: { date: '', cost: '', steps: [] }, department: 'TIID' });
            setAltasBajas(ab || { id: Date.now(), title: 'Portal de Altas y Bajas', type: 'AltasBajas', link: '', department: 'TIID' });
            setCriteriosETC(crit || { id: Date.now(), title: 'Criterios ETC', type: 'CriteriosETC', content: [], department: 'TIID' });
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

    const handleOpenModal = (section: string, data: any) => {
        setActiveSection(section);
        // Deep copy para evitar mutaciones accidentales en el form
        setFormData(JSON.parse(JSON.stringify(data)));
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setActiveSection(null);
        setFormData({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (activeSection === 'encargado') await updateEncargadoTutorias(formData.id, formData);
            if (activeSection === 'pi') await updateCoordinacion(formData.id, formData);
            if (activeSection === 'estancias') await updateCoordinacion(formData.id, formData);
            if (activeSection === 'tutores') await updateCoordinacionTutores(formData.id, formData);
            if (activeSection === 'calendario') await updateCalendario(formData.id, formData);
            if (activeSection === 'lengua') await updateLenguaExtranjera(formData.id, formData);
            if (activeSection === 'casilleros') await updateRecursoGenerico(formData.id, formData);
            if (activeSection === 'recursamientos') await updateRecursoGenerico(formData.id, formData);
            if (activeSection === 'altasTest') await updateRecursoGenerico(formData.id, formData);
            if (activeSection === 'criteriosETC') await updateRecursoGenerico(formData.id, formData);

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

    if (loading) return <div className="flex justify-center items-center h-96 text-white"><Loader2 className="animate-spin" /> Cargando...</div>;

    // Helper render para las tarjetas "Tabla" de la UI principal
    const renderCard = (
        section: string,
        icon: React.ReactNode,
        title: string,
        description: string,
        data: any,
        color: string = 'indigo'
    ) => {
        const txtColor = color === 'rose' ? 'text-rose-400' : 'text-indigo-400';
        const bgColor = color === 'rose' ? 'bg-rose-600' : 'bg-indigo-600';

        return (
            <div className={`bg-slate-900 border border-${color}-500/20 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-500`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 ${bgColor} rounded-xl`}>{icon}</div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                        <p className="text-sm text-gray-400">{description}</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal(section, data)}
                    className={`flex items-center gap-2 ${txtColor} hover:bg-white/5 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-transparent`}
                >
                    <Edit2 size={16} /> Editar Configuración
                </button>
            </div>
        );
    };


    return (
        <div className="space-y-10 pb-20">
            <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Recursos TIID</h1>
                    <p className="text-sm text-gray-400 mt-1">Actualiza la información visible en la página de Recursos y Avisos.</p>
                </div>
                {message && (
                    <div className={`px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in duration-300 font-medium shadow-lg ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}
            </header>

            <div className="space-y-6">
                {renderCard('encargado', <Users className="text-white" size={20} />, 'Encargada de Tutorías', encargado?.name || 'No configurado', encargado)}
                {renderCard('pi', <LayoutGrid className="text-white" size={20} />, 'Coordinación PI', pi?.name || 'No configurado', pi)}
                {renderCard('estancias', <LayoutGrid className="text-white" size={20} />, 'Coordinación Estancias', estancias?.name || 'No configurado', estancias)}
                {renderCard('tutores', <Users className="text-white" size={20} />, 'Coordinación de Tutores', `Periodo: ${tutores?.period || 'No configurado'}`, tutores)}
                {renderCard('calendario', <Calendar className="text-white" size={20} />, 'Calendario Escolar', `Ciclo: ${calendario?.cycle || 'No configurado'}`, calendario)}
                {renderCard('lengua', <GraduationCap className="text-white" size={20} />, 'Lengua Extranjera', lengua?.title || 'No configurado', lengua)}
                {renderCard('casilleros', <MapPin className="text-white" size={20} />, 'Casilleros', casilleros?.title || 'No configurado', casilleros)}
                {renderCard('recursamientos', <AlertCircle className="text-white" size={20} />, 'Recursamientos', `Límite: ${recursamientos?.content?.date || 'No configurado'}`, recursamientos)}
                {renderCard('altasTest', <BookOpen className="text-white" size={20} />, 'Altas y Bajas', altasBajas?.link ? 'URL Configurada' : 'No configurado', altasBajas)}
                {renderCard('criteriosETC', <Info className="text-white" size={20} />, 'Criterios ETC', `${criteriosETC?.content?.length || 0} criterios guardados`, criteriosETC)}
            </div>

            {/* Modal Dinámico Multis-Sección */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-8 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50 sticky top-0 z-10">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                                <Edit2 size={18} className="text-indigo-400" />
                                Editar {formData.title || 'Sección'}
                            </h3>
                            <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            
                            {/* --- ENCARGADO TUTORIAS --- */}
                            {activeSection === 'encargado' && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Input label="Nombre" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} />
                                    </div>
                                    <Input label="Correo" value={formData.correo || ''} onChange={v => setFormData({ ...formData, correo: v })} />
                                    <Input label="Extensión" value={formData.ext || ''} onChange={v => setFormData({ ...formData, ext: v })} />
                                    <div className="md:col-span-2">
                                        <FileInput label="URL Imagen" value={formData.image || ''} onChange={v => setFormData({ ...formData, image: v })} accept="image/*" department="TIID" />
                                    </div>
                                </div>
                            )}

                            {/* --- COORDINACION PI / ESTANCIAS --- */}
                            {(activeSection === 'pi' || activeSection === 'estancias') && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Input label="Título de Tarjeta" value={formData.title || ''} onChange={v => setFormData({ ...formData, title: v })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input label="Nombre del Coordinador" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input label="Correo" value={formData.correo || ''} onChange={v => setFormData({ ...formData, correo: v })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FileInput label="URL Imagen" value={formData.image || ''} onChange={v => setFormData({ ...formData, image: v })} accept="image/*" department="TIID" />
                                    </div>
                                </div>
                            )}

                            {/* --- TUTORES --- */}
                            {activeSection === 'tutores' && (
                                <div className="space-y-4">
                                    <Input label="Título" value={formData.title || ''} onChange={v => setFormData({ ...formData, title: v })} />
                                    <Input label="Periodo" value={formData.period || ''} onChange={v => setFormData({ ...formData, period: v })} />
                                    <div className="pb-4 border-b border-white/10">
                                        <FileInput label="URL Imagen General (Si no usas la tabla)" value={formData.image || ''} onChange={v => setFormData({ ...formData, image: v })} accept="image/*" department="TIID" />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nota Inferior</label>
                                        <textarea
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium resize-y min-h-[80px]"
                                            value={formData.note || ''}
                                            onChange={e => setFormData({ ...formData, note: e.target.value })}
                                        />
                                    </div>

                                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Lista de Tutores por Grupo</h4>
                                            <button type="button" onClick={() => {
                                                const tutors = Array.isArray(formData.tutors) ? formData.tutors : [];
                                                setFormData({ ...formData, tutors: [...tutors, { group: 'Nuevo Grupo', tutor: 'Nombre del Tutor' }] });
                                            }} className="text-xs text-indigo-400 font-bold hover:text-indigo-300">
                                                + Añadir Grupo
                                            </button>
                                        </div>
                                        {(!formData.tutors || formData.tutors.length === 0) ? (
                                            <p className="text-gray-500 text-xs">Añade tu primer grupo.</p>
                                        ) : (
                                            formData.tutors.map((t: any, idx: number) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input type="text" className="w-1/3 bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-white text-xs" value={t.group} onChange={e => {
                                                        const newT = [...formData.tutors];
                                                        newT[idx].group = e.target.value;
                                                        setFormData({ ...formData, tutors: newT });
                                                    }} placeholder="Grupo" />
                                                    <input type="text" className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-white text-xs" value={t.tutor} onChange={e => {
                                                        const newT = [...formData.tutors];
                                                        newT[idx].tutor = e.target.value;
                                                        setFormData({ ...formData, tutors: newT });
                                                    }} placeholder="Nombre Tutor" />
                                                    <button type="button" onClick={() => {
                                                        const newT = formData.tutors.filter((_:any, i:number) => i !== idx);
                                                        setFormData({ ...formData, tutors: newT });
                                                    }} className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* --- CALENDARIO --- */}
                            {activeSection === 'calendario' && (
                                <div className="space-y-4">
                                    <Input label="Ciclo" value={formData.cycle || ''} onChange={v => setFormData({ ...formData, cycle: v })} />
                                    <FileInput label="URL Imagen del Calendario" value={formData.image || ''} onChange={v => setFormData({ ...formData, image: v })} accept="image/*" department="TIID" />
                                </div>
                            )}

                            {/* --- LENGUA EXTRANJERA --- */}
                            {activeSection === 'lengua' && (
                                <div className="space-y-4">
                                    <Input label="Título General" value={formData.title || ''} onChange={v => setFormData({ ...formData, title: v })} />
                                    <Input label="Link de Solicitud Directo" value={formData.requestLink || ''} onChange={v => setFormData({ ...formData, requestLink: v })} />
                                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contacto / Reportes</h4>
                                        <Input label="Nombre del Contacto" value={formData.reports?.name || ''} onChange={v => setFormData({ ...formData, reports: { ...formData.reports, name: v } })} />
                                        <Input label="Correo del Contacto" value={formData.reports?.correo || ''} onChange={v => setFormData({ ...formData, reports: { ...formData.reports, correo: v } })} />
                                    </div>
                                </div>
                            )}

                            {/* --- RECURSAMIENTOS --- */}
                            {activeSection === 'recursamientos' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Fecha Límite" value={formData.content?.date || ''} onChange={v => setFormData({ ...formData, content: { ...formData.content, date: v } })} />
                                        <Input label="Costo" value={formData.content?.cost || ''} onChange={v => setFormData({ ...formData, content: { ...formData.content, cost: v } })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pasos (Formato JSON Array)</label>
                                        <textarea
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-xs resize-y min-h-[150px]"
                                            value={formData.content?.steps ? JSON.stringify(formData.content.steps, null, 2) : '[]'}
                                            onChange={e => {
                                                try {
                                                    const steps = JSON.parse(e.target.value);
                                                    setFormData({ ...formData, content: { ...formData.content, steps } });
                                                } catch (err) {}
                                            }}
                                            placeholder='[&#10;  {&#10;    "step": "01",&#10;    "text": "..."&#10;  }&#10;]'
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Si este JSON es inválido, no se actualizará en tiempo real. Use un formato estricto.</p>
                                    </div>
                                </div>
                            )}

                            {/* --- CASILLEROS --- */}
                            {activeSection === 'casilleros' && (
                                <div className="space-y-4">
                                    <Input label="Título" value={formData.title || ''} onChange={v => setFormData({ ...formData, title: v })} />
                                    <Input label="Link de Solicitud (Forms)" value={formData.link || ''} onChange={v => setFormData({ ...formData, link: v })} />
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción Informativa</label>
                                        <textarea
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium resize-y min-h-[100px]"
                                            value={formData.description || ''}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* --- ALTAS Y BAJAS --- */}
                            {activeSection === 'altasTest' && (
                                <div className="space-y-4">
                                    <Input label="Link del Portal de Registro" value={formData.link || ''} onChange={v => setFormData({ ...formData, link: v })} />
                                </div>
                            )}

                            {/* --- CRITERIOS ETC --- */}
                            {activeSection === 'criteriosETC' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Lista de Criterios</label>
                                        <button type="button" onClick={() => {
                                            const list = Array.isArray(formData.content) ? formData.content : [];
                                            setFormData({ ...formData, content: [...list, { title: 'Nuevo Criterio', description: 'Descripción' }] });
                                        }} className="text-xs text-indigo-400 font-bold hover:text-indigo-300">
                                            + Añadir
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {(Array.isArray(formData.content) ? formData.content : []).map((c: any, idx: number) => (
                                            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-white/5 relative group">
                                                <button type="button" onClick={() => {
                                                    const list = [...formData.content];
                                                    list.splice(idx, 1);
                                                    setFormData({ ...formData, content: list });
                                                }} className="absolute top-4 right-4 text-gray-500 hover:text-red-400">
                                                    <X size={16} />
                                                </button>
                                                <h4 className="text-xs text-gray-500 font-bold mb-2">Criterio #{idx + 1}</h4>
                                                <div className="space-y-2 pr-6">
                                                    <input type="text" className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-white text-sm" value={c.title} onChange={e => {
                                                        const list = [...formData.content];
                                                        list[idx].title = e.target.value;
                                                        setFormData({ ...formData, content: list });
                                                    }} placeholder="Título" />
                                                    <textarea className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-white text-sm resize-y" value={c.description} onChange={e => {
                                                        const list = [...formData.content];
                                                        list[idx].description = e.target.value;
                                                        setFormData({ ...formData, content: list });
                                                    }} placeholder="Descripción" rows={3}></textarea>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-white/10 flex justify-end gap-3 sticky bottom-0 bg-slate-900 pb-2">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl text-xs uppercase font-black tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs uppercase font-black tracking-widest transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
