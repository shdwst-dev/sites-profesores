import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Loader2, X, File, Image as ImageIcon } from 'lucide-react';

interface FileInputProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    accept?: string;
    department?: string;
}

export default function FileInput({ label, value, onChange, accept = "*", department = "General" }: FileInputProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('department', department);

        try {
            // Se llamará a la API de Drive aquí
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al subir el archivo');
            }

            // Asumimos que la API devuelve la URL en data.url
            onChange(data.url);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || 'Error desconocido al subir archivo');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    const isImage = value.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null || value.includes('drive.google.com') && accept.includes('image');

    return (
        <div className="w-full">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                <span>{label}</span>
                {value && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Archivo cargado</span>}
            </label>

            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="URL del archivo o subir uno nuevo..."
                        readOnly={uploading}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 hover:text-white border border-indigo-500/30 rounded-xl transition-all flex items-center justify-center min-w-[48px]"
                        title="Subir archivo"
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept={accept}
                    />
                </div>

                {/* Preview o error */}
                {error && <p className="text-red-400 text-xs flex items-center gap-1"><X size={12} /> {error}</p>}

                {value && !error && (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                        {isImage ? (
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="text-gray-500"><ImageIcon size={20}/></div>'; }} />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                                <File size={20} />
                            </div>
                        )}
                        <a href={value} target="_blank" rel="noreferrer" className="text-xs text-indigo-300 hover:text-indigo-200 truncate hover:underline">
                            {value}
                        </a>
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="ml-auto p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Quitar enlace"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
