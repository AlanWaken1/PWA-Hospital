// components/settings/NotificationsSection.tsx
"use client";

import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Bell, BellOff, Mail, Package, TrendingUp, Volume2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ToggleProps {
    enabled: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

function Toggle({ enabled, onChange, disabled }: ToggleProps) {
    return (
        <button
            onClick={() => onChange(!enabled)}
            disabled={disabled}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${enabled
                ? 'bg-theme-primary'
                : 'bg-gray-200 dark:bg-gray-700'
            }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${enabled ? 'translate-x-6' : 'translate-x-1'}
                `}
            />
        </button>
    );
}

export function NotificationsSection() {
    const { preferences, loading, updatePreferences } = useUserPreferences();

    const handleToggle = async (key: keyof typeof preferences, value: boolean) => {
        const result = await updatePreferences({ [key]: value });

        if (result.success) {
            toast.success('Preferencia actualizada');
        } else {
            toast.error('Error al actualizar preferencia');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-theme-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Preferencias de Notificaciones
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Controla qué notificaciones deseas recibir
                </p>
            </div>

            {/* Master Toggle */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-theme-primary/10 to-theme-primary/5 border border-theme-primary/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {preferences.notifications_enabled ? (
                            <div className="p-2 bg-theme-primary/20 rounded-lg">
                                <Bell className="w-5 h-5 text-theme-primary" />
                            </div>
                        ) : (
                            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <BellOff className="w-5 h-5 text-gray-500" />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                Notificaciones Generales
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Habilitar/deshabilitar todas las notificaciones
                            </p>
                        </div>
                    </div>
                    <Toggle
                        enabled={preferences.notifications_enabled}
                        onChange={(value) => handleToggle('notifications_enabled', value)}
                    />
                </div>
            </div>

            {/* Opciones individuales */}
            <div className="space-y-3">
                {/* Email */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-theme-primary/30 dark:hover:border-theme-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                Notificaciones por Email
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Recibe resúmenes diarios por correo
                            </p>
                        </div>
                    </div>
                    <Toggle
                        enabled={preferences.email_notifications}
                        onChange={(value) => handleToggle('email_notifications', value)}
                        disabled={!preferences.notifications_enabled}
                    />
                </div>

                {/* Stock Bajo */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-theme-primary/30 dark:hover:border-theme-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                Alertas de Stock Bajo
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Notificaciones cuando el stock esté bajo
                            </p>
                        </div>
                    </div>
                    <Toggle
                        enabled={preferences.low_stock_alerts}
                        onChange={(value) => handleToggle('low_stock_alerts', value)}
                        disabled={!preferences.notifications_enabled}
                    />
                </div>

                {/* Movimientos */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-theme-primary/30 dark:hover:border-theme-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                Notificaciones de Movimientos
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Alertas sobre entradas y salidas de inventario
                            </p>
                        </div>
                    </div>
                    <Toggle
                        enabled={preferences.movement_notifications}
                        onChange={(value) => handleToggle('movement_notifications', value)}
                        disabled={!preferences.notifications_enabled}
                    />
                </div>

                {/* Sonido */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-theme-primary/30 dark:hover:border-theme-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                Sonido de Notificaciones
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Reproducir sonido al recibir notificaciones
                            </p>
                        </div>
                    </div>
                    <Toggle
                        enabled={preferences.sound_enabled}
                        onChange={(value) => handleToggle('sound_enabled', value)}
                        disabled={!preferences.notifications_enabled}
                    />
                </div>
            </div>

            {/* Info adicional */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    💡 <strong>Tip:</strong> Las notificaciones te ayudarán a mantener el control del inventario en tiempo real.
                </p>
            </div>
        </div>
    );
}