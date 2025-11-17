// components/settings/ProfileSection.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { User, Mail, Camera, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileSection() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [displayName, setDisplayName] = useState(
        // @ts-ignore
        user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
    );

    const handleUpdateProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const supabase = createClient();

            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: displayName,
                },
            });

            if (error) throw error;

            toast.success('Perfil actualizado correctamente');
            setEditing(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Error al actualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Perfil de Usuario
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Administra tu información personal
                </p>
            </div>

            {/* Avatar y Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-theme-primary to-theme-primary-dark flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                        {displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Camera size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Info */}
                <div className="flex-1 w-full space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nombre
                        </label>
                        {editing ? (
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                placeholder="Tu nombre"
                            />
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <User size={18} className="text-gray-400" />
                                <span className="text-gray-900 dark:text-gray-100">
                                    {displayName || 'Sin nombre'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <Mail size={18} className="text-gray-400" />
                            <span className="text-gray-900 dark:text-gray-100">
                                {user?.email}
                            </span>
                            <span className="ml-auto text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                Verificado
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
                {editing ? (
                    <>
                        <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                // @ts-ignore
                                setDisplayName(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '');
                            }}
                            disabled={loading}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        Editar Perfil
                    </button>
                )}
            </div>
        </div>
    );
}