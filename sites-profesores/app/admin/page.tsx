'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Bell, Calendar, FileText, Phone, BookOpen, Download,
    Users, TrendingUp, Loader2, ArrowRight, BarChart3,
    Globe, Cpu
} from 'lucide-react';

interface Stats {
    comunicados: number;
    fechas: number;
    tramites: number;
    contactos: number;
    entregablesTIID: number;
    entregablesSistemas: number;
    docsTIID: number;
    docsSistemas: number;
    emailsPermitidos: number;
}

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<number | null>(null);

    useEffect(() => {
        if (value === 0) { setDisplay(0); return; }

        const start = performance.now();
        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) {
                ref.current = requestAnimationFrame(animate);
            }
        };
        ref.current = requestAnimationFrame(animate);
        return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    }, [value, duration]);

    return <>{display}</>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error loading stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = stats ? [
        { label: 'Comunicados', value: stats.comunicados, icon: Bell, color: 'from-blue-600 to-blue-800', shadow: 'shadow-blue-500/20' },
        { label: 'Fechas Importantes', value: stats.fechas, icon: Calendar, color: 'from-purple-600 to-purple-800', shadow: 'shadow-purple-500/20' },
        { label: 'Trámites', value: stats.tramites, icon: FileText, color: 'from-amber-600 to-amber-800', shadow: 'shadow-amber-500/20' },
        { label: 'Contactos', value: stats.contactos, icon: Phone, color: 'from-yellow-600 to-yellow-800', shadow: 'shadow-yellow-500/20' },
        { label: 'Entregables TIID', value: stats.entregablesTIID, icon: BookOpen, color: 'from-pink-600 to-pink-800', shadow: 'shadow-pink-500/20' },
        { label: 'Entregables Sistemas', value: stats.entregablesSistemas, icon: BookOpen, color: 'from-cyan-600 to-cyan-800', shadow: 'shadow-cyan-500/20' },
        { label: 'Documentos TIID', value: stats.docsTIID, icon: Download, color: 'from-rose-600 to-rose-800', shadow: 'shadow-rose-500/20' },
        { label: 'Documentos Sistemas', value: stats.docsSistemas, icon: Download, color: 'from-teal-600 to-teal-800', shadow: 'shadow-teal-500/20' },
        { label: 'Usuarios Registrados', value: stats.emailsPermitidos, icon: Users, color: 'from-indigo-600 to-indigo-800', shadow: 'shadow-indigo-500/20' },
    ] : [];

    const totalRecords = stats
        ? stats.comunicados + stats.fechas + stats.tramites + stats.contactos +
          stats.entregablesTIID + stats.entregablesSistemas + stats.docsTIID + stats.docsSistemas
        : 0;

    return (
        <div className="space-y-10">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 uppercase tracking-tight flex items-center gap-3">
                            <BarChart3 size={28} className="text-indigo-400" />
                            Dashboard
                        </h1>
                        <p className="text-indigo-300/80 text-sm sm:text-base">
                            Resumen general del contenido del portal docente.
                        </p>
                    </div>
                    {stats && (
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                            <TrendingUp size={20} className="text-emerald-400" />
                            <div>
                                <p className="text-2xl font-black text-white">
                                    <AnimatedCounter value={totalRecords} />
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registros totales</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 size={24} className="animate-spin text-indigo-400" />
                    <span className="ml-3 text-gray-400 font-medium">Cargando estadísticas...</span>
                </div>
            )}

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                    {statCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.label}
                                className={`group bg-slate-900/80 border border-white/5 rounded-2xl p-5 sm:p-6 hover:border-white/15 transition-all duration-500 hover:-translate-y-1 ${card.shadow} hover:shadow-lg`}
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={18} className="text-white" />
                                </div>
                                <p className="text-3xl sm:text-4xl font-black text-white mb-1">
                                    <AnimatedCounter value={card.value} duration={1000 + index * 100} />
                                </p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{card.label}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Quick Access */}
            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/admin/tiid/recursos-y-avisos" className="group">
                    <div className="bg-slate-800/50 p-6 sm:p-8 rounded-3xl border border-white/5 hover:bg-slate-800 transition-all duration-300 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-600 rounded-lg">
                                <Globe size={20} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white">TIID</h3>
                        </div>
                        <p className="text-gray-400 text-sm flex-1">Gestionar recursos, avisos, coordinaciones y calendarios del departamento TIID.</p>
                        <div className="flex items-center gap-2 mt-4 text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Editar <ArrowRight size={16} />
                        </div>
                    </div>
                </Link>

                <Link href="/admin/sistemas/recursos-y-avisos" className="group">
                    <div className="bg-slate-800/50 p-6 sm:p-8 rounded-3xl border border-white/5 hover:bg-slate-800 transition-all duration-300 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-rose-600 rounded-lg">
                                <Cpu size={20} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-rose-400">Sistemas</h3>
                        </div>
                        <p className="text-gray-400 text-sm flex-1">Gestionar recursos, avisos, coordinaciones y calendarios del departamento de Sistemas.</p>
                        <div className="flex items-center gap-2 mt-4 text-rose-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Editar <ArrowRight size={16} />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
