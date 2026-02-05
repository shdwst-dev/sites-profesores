'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

interface SubHeaderProps {
    title: string;
    subtitle?: string;
    backPath?: string;
    homePath?: string;
    accentColor?: string; // e.g. '#1e3a5f' or '#431d2a'
}

export default function SubHeader({
    title,
    subtitle = 'Portal del Profesor',
    backPath = '/home',
    homePath = '/home',
    accentColor = '#1e3a5f'
}: SubHeaderProps) {
    const router = useRouter();

    return (
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-200 ring-1 ring-black/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push(backPath)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                            title="Volver"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight" style={{ color: accentColor }}>
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => router.push(homePath)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 group overflow-hidden relative"
                        style={{ backgroundColor: accentColor }}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Home className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />
                        <span className="font-bold text-xs uppercase tracking-widest relative z-10 hidden sm:inline">Inicio</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
