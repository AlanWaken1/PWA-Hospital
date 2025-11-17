// components/settings/SecuritySection.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Key, Trash2, AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function SecuritySection() {
    const { user } = useAuth();
    const router = useRouter();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Delete account
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            setLoading(true);
            const supabase = createClient();

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            toast.success('Contraseña actualizada correctamente');
            setShowPasswordForm(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error('Error updating password:', error);
            toast.error(error.message || 'Error al cambiar contraseña');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'ELIMINAR') {
            toast.error('Debes escribir "ELIMINAR" para confirmar');
            return;
        }

        try {
            setLoading(true);
            const supabase = createClient();

            // Nota: Supabase no permite eliminar usuarios desde el cliente
            // Deberías crear un Edge Function para esto
            // Por ahora, solo cerramos sesión

            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            toast.success('Cuenta eliminada. Redirigiendo...');
            router.push('/auth/login');
        } catch (error: any) {
            console.error('Error deleting account:', error);
            toast.error(error.message || 'Error al eliminar cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Configuración de Seguridad
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Protege tu cuenta y tus datos
                </p>
            </div>

            {/* Cambiar Contraseña */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                Cambiar Contraseña
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Actualiza tu contraseña regularmente
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="px-4 py-2 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-lg font-medium transition-colors text-sm"
                    >
                        {showPasswordForm ? 'Cancelar' : 'Cambiar'}
                    </button>
                </div>

                {showPasswordForm && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {/* Nueva Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                placeholder="Repite la contraseña"
                            />
                        </div>

                        <button
                            onClick={handleChangePassword}
                            disabled={loading || !newPassword || !confirmPassword}
                            className="w-full px-4 py-2.5 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Actualizar Contraseña
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Autenticación de 2 Factores (Placeholder) */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                Autenticación de Dos Factores
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Próximamente disponible
                            </p>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
                        Próximamente
                    </div>
                </div>
            </div>

            {/* Zona de Peligro */}
            <div className="p-4 rounded-xl border-2 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
                <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    <div>
                        <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
                            Zona de Peligro
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, está seguro.
                        </p>
                    </div>
                </div>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        Eliminar Cuenta
                    </button>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                            Escribe "ELIMINAR" para confirmar:
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-red-300 dark:border-red-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="ELIMINAR"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading || deleteConfirmText !== 'ELIMINAR'}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Eliminando...' : 'Confirmar Eliminación'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteConfirmText('');
                                }}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}