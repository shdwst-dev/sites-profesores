'use client';

import { useRouter } from 'next/navigation';
import { FileText, Bell, ChevronRight, Zap } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/Footer';
import SubHeader from '@/components/SubHeader';

export default function TIIDPage() {
    const router = useRouter();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const sections = [
        {
            title: 'Formatos y Documentos',
            description: 'Acceda a los formatos oficiales, guías de asignatura y entregables del cuatrimestre.',
            icon: FileText,
            color: 'from-blue-600 to-cyan-600',
            path: '/tiid/formatos-y-documentos'
        },
        {
            title: 'Recursos y Avisos',
            description: 'Consulte comunicados internos, criterios de evaluación y avisos de coordinación.',
            icon: Bell,
            color: 'from-purple-600 to-indigo-600',
            path: '/tiid/recursos-y-avisos'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#0f172a]">
            <SubHeader
                title="TIID"
                subtitle="Tecnologías de la Información e Innovación Digital"
                accentColor="#1e3a5f"
            />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-in fade-in duration-700">
                {/* Hero Section for Branch */}
                <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row items-center gap-8 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <Zap size={14} className="fill-indigo-400" />
                            Tecnologías de la Información e Innovación Digital
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                            Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Tecnologías de la Información e Innovación Digital</span>
                        </h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed mb-0">
                            Centralizamos todos los recursos académicos y administrativos para la carrera de TIID, facilitando el seguimiento y la entrega de documentación oficial.
                        </p>
                    </div>
                    <div className="lg:w-1/2 relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src="/mision-sistemas.png"
                            alt="Innovación"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 to-transparent"></div>
                    </div>
                </div>

                {/* Section Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.title}
                                onClick={() => router.push(section.path)}
                                className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 shadow-xl hover:shadow-indigo-500/10"
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    <Icon size={28} color="#fff" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                    {section.title}
                                </h3>
                                <p className="text-gray-400 font-medium leading-relaxed mb-6">
                                    {section.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-indigo-400 group-hover:gap-4 transition-all duration-300 uppercase tracking-widest">
                                    Acceder <ChevronRight size={18} />
                                </div>
                                <div className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${section.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full`}></div>
                            </div>
                        );
                    })}
                </div>

                {/* Mission Section (Enhanced) */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100">
                    <div className="lg:w-1/3 h-64 lg:h-auto bg-slate-200">
                        <img
                            src="/mision-sistemas.png"
                            alt="Misión TIID"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="lg:w-2/3 p-10 lg:p-16 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-1 bg-indigo-600 rounded-full"></div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Misión</h2>
                        </div>
                        <p className="text-xl font-semibold leading-relaxed text-slate-600 italic">
                            "Formamos líderes capaces de impulsar el futuro con un enfoque en tecnologías avanzadas. Esta carrera es el puente hacia la innovación, donde la creatividad y la tecnología se unen para transformar industrias, optimizar procesos y mejorar vidas."
                        </p>
                        <div className="mt-8 flex justify-end">
                            <div className="text-right">
                                <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Dirección de Programa</p>
                                <p className="text-indigo-600 font-bold">TIID UPQ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}