'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastMessage = { type: 'success' | 'error'; text: string } | null;

interface ToastProps {
    message: ToastMessage;
    onClose?: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [message]);

    if (!message) return null;

    const isSuccess = message.type === 'success';

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 9999,
                transform: visible ? 'translateY(0)' : 'translateY(2rem)',
                opacity: visible ? 1 : 0,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <div
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-sm font-semibold ${
                    isSuccess
                        ? 'bg-green-500/20 text-green-300 border-green-500/40'
                        : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}
                style={{ minWidth: '260px', maxWidth: '400px' }}
            >
                <span className="flex-shrink-0">
                    {isSuccess
                        ? <CheckCircle size={20} className="text-green-400" />
                        : <AlertCircle size={20} className="text-red-400" />
                    }
                </span>
                <span className="flex-1">{message.text}</span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-1"
                        aria-label="Cerrar notificación"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
