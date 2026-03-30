'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Calendar, BookOpen, Plus, Trash2 } from 'lucide-react';
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
import {
    Entregable,
    DocumentoDescarga
} from '@/types';
import FileInput from '@/components/admin/FileInput';

export default function AdminTIIDFormatosDocumentos() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [message, setMessage] = useState<ToastMessage>(null);

    // Data State
    const [entregables, setEntregables] = useState<Entregable[]>([]);
    const [descargas, setDescargas] = useState<DocumentoDescarga[]>([]);

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
            <Toast message={message} onClose={() => setMessage(null)} />
            <header className="mb-8">
                <h1 className="text-3xl font-black text-white">Editar Formatos y Documentos TIID</h1>
                <p className="text-gray-400">Actualiza la información visible en la página de Formatos y Documentos.</p>
            </header>

            {/* Entregables */}
            <section className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="p-3 bg-indigo-600 rounded-xl"><Calendar size={20} className="text-white" /></div>
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
                    <div className="p-3 bg-indigo-600 rounded-xl"><BookOpen size={20} className="text-white" /></div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Documentos de Descarga</h2>
                        <p className="text-sm text-gray-400">Formatos y guías para descargar</p>
                    </div>
                    <button
                        onClick={async () => {
                            await createDocumentoDescarga({ title: 'Nuevo Documento', link: '#', icon: 'FileText', color: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300' });
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
                                <FileInput label="Link (URL)" value={item.link} onChange={v => {
                                    const newItems = [...descargas];
                                    newItems[idx] = { ...item, link: v };
                                    setDescargas(newItems);
                                }} department="TIID" />
                            </div>
                            <div className="md:col-span-2">
                                <Input label="Icono" value={item.icon || ''} onChange={v => {
                                    const newItems = [...descargas];
                                    newItems[idx] = { ...item, icon: v as any };
                                    setDescargas(newItems);
                                }} />
                            </div>
                            <div className="md:col-span-2">
                                <Input label="Color (Tailwind CSS)" value={item.color || ''} onChange={v => {
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
