'use client';

import { useState, useEffect } from 'react';
import {
    Users, UserPlus, Shield, ShieldOff, Trash2, Loader2,
    Search, Mail, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

interface UserEntry {
    id: string;
    email: string;
    rol: string;
    nombre: string | null;
    picture: string | null;
    last_login: string | null;
    registered: boolean;
}

export default function UsuariosPage() {
    const [users, setUsers] = useState<UserEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ email: string; action: 'revoke' | 'role'; newRole?: string } | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleInvite = async () => {
        if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
            showToast('Ingresa un email válido', 'error');
            return;
        }

        setActionLoading('invite');
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operation: 'invite', email: inviteEmail.trim().toLowerCase() }),
                credentials: 'include',
            });

            const data = await res.json();
            if (res.ok) {
                showToast('Usuario invitado exitosamente', 'success');
                setInviteEmail('');
                setShowInviteModal(false);
                fetchUsers();
            } else {
                showToast(data.message || 'Error al invitar', 'error');
            }
        } catch {
            showToast('Error de conexión', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleChangeRole = async (email: string, newRole: string) => {
        setActionLoading(email);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operation: 'update_role', email, rol: newRole }),
                credentials: 'include',
            });

            if (res.ok) {
                showToast(`Rol actualizado a ${newRole}`, 'success');
                fetchUsers();
            } else {
                const data = await res.json();
                showToast(data.message || 'Error al cambiar rol', 'error');
            }
        } catch {
            showToast('Error de conexión', 'error');
        } finally {
            setActionLoading(null);
            setConfirmAction(null);
        }
    };

    const handleRevoke = async (email: string) => {
        setActionLoading(email);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operation: 'revoke', email }),
                credentials: 'include',
            });

            if (res.ok) {
                showToast('Acceso revocado', 'success');
                fetchUsers();
            } else {
                const data = await res.json();
                showToast(data.message || 'Error al revocar', 'error');
            }
        } catch {
            showToast('Error de conexión', 'error');
        } finally {
            setActionLoading(null);
            setConfirmAction(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.nombre && u.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const adminCount = users.filter(u => u.rol === 'admin').length;
    const registeredCount = users.filter(u => u.registered).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 uppercase tracking-tight flex items-center gap-3">
                            <Users size={28} className="text-indigo-400" />
                            Gestión de Usuarios
                        </h1>
                        <p className="text-indigo-300/80 text-sm sm:text-base">
                            Administra los accesos y roles de los usuarios del portal.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                            <div className="text-center">
                                <p className="text-2xl font-black text-white">{users.length}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-emerald-400">{registeredCount}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Activos</p>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-amber-400">{adminCount}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admins</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex-1 relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por email o nombre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                    <UserPlus size={18} />
                    Invitar Usuario
                </button>
            </div>

            {/* User Table */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 size={24} className="animate-spin text-indigo-400" />
                    <span className="ml-3 text-gray-400 font-medium">Cargando usuarios...</span>
                </div>
            ) : (
                <div className="bg-slate-900/80 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    {/* Table Header */}
                    <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/5">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">Usuario</span>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] w-24 text-center">Rol</span>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] w-24 text-center">Estado</span>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] w-32 text-center">Acciones</span>
                    </div>

                    {/* User Rows */}
                    {filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            {searchQuery ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 items-center px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                            >
                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                    {user.picture ? (
                                        <Image
                                            src={user.picture}
                                            alt={user.nombre || user.email}
                                            width={36}
                                            height={36}
                                            className="rounded-full border-2 border-white/10"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-gray-400 text-sm font-bold border-2 border-white/10">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate">
                                            {user.nombre || user.email.split('@')[0]}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                            <Mail size={10} />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Role Badge */}
                                <div className="w-24 flex justify-center">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                        user.rol === 'admin'
                                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                            : 'bg-slate-700/50 text-gray-400 border border-white/5'
                                    }`}>
                                        {user.rol}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="w-24 flex justify-center">
                                    {user.registered ? (
                                        <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                                            <CheckCircle size={12} /> Activo
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-gray-500 text-[10px] font-bold">
                                            <XCircle size={12} /> Pendiente
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="w-32 flex justify-center gap-2">
                                    {user.registered && (
                                        <button
                                            onClick={() => setConfirmAction({
                                                email: user.email,
                                                action: 'role',
                                                newRole: user.rol === 'admin' ? 'profesor' : 'admin'
                                            })}
                                            disabled={actionLoading === user.email}
                                            className={`p-2 rounded-lg transition-colors ${
                                                user.rol === 'admin'
                                                    ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                                    : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-400'
                                            }`}
                                            title={user.rol === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                                        >
                                            {user.rol === 'admin' ? <ShieldOff size={14} /> : <Shield size={14} />}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setConfirmAction({ email: user.email, action: 'revoke' })}
                                        disabled={actionLoading === user.email}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        title="Revocar acceso"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                     onClick={() => setShowInviteModal(false)}>
                    <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-2xl shadow-2xl p-8"
                         onClick={e => e.stopPropagation()}
                         style={{ animation: 'notifSlideDown 0.2s ease-out' }}>
                        <h2 className="text-xl font-black text-white mb-2 flex items-center gap-3">
                            <UserPlus size={22} className="text-indigo-400" />
                            Invitar Usuario
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Ingresa el email del profesor que deseas invitar al portal.
                        </p>

                        <div className="relative mb-6">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                placeholder="correo@upq.edu.mx"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl font-bold text-sm transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleInvite}
                                disabled={actionLoading === 'invite'}
                                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {actionLoading === 'invite' ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <UserPlus size={16} />
                                )}
                                Invitar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Action Modal */}
            {confirmAction && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                     onClick={() => setConfirmAction(null)}>
                    <div className="w-full max-w-sm bg-slate-900 border border-white/15 rounded-2xl shadow-2xl p-8"
                         onClick={e => e.stopPropagation()}
                         style={{ animation: 'notifSlideDown 0.2s ease-out' }}>
                        <div className="w-12 h-12 mx-auto mb-4 bg-amber-500/10 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={24} className="text-amber-400" />
                        </div>
                        <h3 className="text-lg font-black text-white text-center mb-2">
                            {confirmAction.action === 'revoke' ? '¿Revocar acceso?' : '¿Cambiar rol?'}
                        </h3>
                        <p className="text-gray-400 text-sm text-center mb-6">
                            {confirmAction.action === 'revoke'
                                ? `Se eliminará el acceso de ${confirmAction.email} al portal.`
                                : `Se cambiará el rol de ${confirmAction.email} a "${confirmAction.newRole}".`}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl font-bold text-sm transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmAction.action === 'revoke') {
                                        handleRevoke(confirmAction.email);
                                    } else if (confirmAction.newRole) {
                                        handleChangeRole(confirmAction.email, confirmAction.newRole);
                                    }
                                }}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                                    confirmAction.action === 'revoke'
                                        ? 'bg-red-600 hover:bg-red-500 text-white'
                                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                                }`}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-8 right-8 z-[110] px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-3 ${
                    toast.type === 'success'
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-red-600 text-white shadow-red-500/20'
                }`}
                     style={{ animation: 'notifSlideDown 0.2s ease-out' }}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {toast.message}
                </div>
            )}

            <style jsx global>{`
                @keyframes notifSlideDown {
                    from { opacity: 0; transform: translateY(-8px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
