'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Cpu, Globe, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';

export default function Home() {
    const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);
    const router = useRouter();
    const { theme } = useTheme();

    const menuItems = [
        {
            title: 'Información de Interés',
            description: 'Avisos, comunicados y noticias importantes del portal',
            icon: Info,
            color: 'from-blue-600 to-indigo-700',
            path: '/Informacion-interes',
            shadow: 'shadow-blue-500/20'
        },
        {
            title: 'TIID',
            description: 'Tecnologías de la Información e Innovación Digital',
            icon: Globe,
            color: 'from-purple-600 to-pink-700',
            path: '/tiid',
            shadow: 'shadow-purple-500/20'
        },
        {
            title: 'Sistemas Computacionales',
            description: 'Gestión de documentos y recursos de la ingeniería',
            icon: Cpu,
            color: 'from-cyan-600 to-teal-700',
            path: '/sistemas-computacionales',
            shadow: 'shadow-cyan-500/20'
        }
    ];

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen flex flex-col selection:bg-blue-500 selection:text-white`}
             style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/15'}`}></div>
                    <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${isDark ? 'bg-purple-600/10' : 'bg-purple-400/15'}`}></div>
                </div>

                <div className="relative z-10 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter"
                        style={{ color: 'var(--text-heading)' }}>
                        GESTIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ACADÉMICA</span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
                       style={{ color: 'var(--text-secondary)' }}>
                        Seleccione el área de trabajo para comenzar a gestionar sus recursos y documentos institucionales.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full relative z-10">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isHovered = hoveredIcon === index;

                        return (
                            <div
                                key={item.title}
                                className={`group relative backdrop-blur-xl border rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 ${item.shadow} hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700`}
                                style={{
                                    animationDelay: `${index * 150}ms`,
                                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                                }}
                                onMouseEnter={() => setHoveredIcon(index)}
                                onMouseLeave={() => setHoveredIcon(null)}
                                onClick={() => router.push(item.path)}
                            >
                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>

                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <Icon size={32} color="#fff" />
                                </div>

                                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors"
                                    style={{ color: 'var(--text-heading)' }}>
                                    {item.title}
                                </h3>

                                <p className="font-medium leading-relaxed mb-8"
                                   style={{ color: 'var(--text-secondary)' }}>
                                    {item.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:gap-4 transition-all duration-300">
                                    INGRESAR <ChevronRight size={18} />
                                </div>

                                {/* Bottom line decoration */}
                                <div className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full`}></div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}