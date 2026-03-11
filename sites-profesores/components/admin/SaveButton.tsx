'use client';

import { Save, Loader2 } from 'lucide-react';

interface SaveButtonProps {
    loading: boolean;
    onClick: () => void;
}

export default function SaveButton({ loading, onClick }: SaveButtonProps) {
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
