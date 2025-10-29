// components/notifications/NotificationDropdown.tsx
"use client";

import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { X, Filter, CheckCheck, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationDropdownProps {
    onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
    const {
        notifications,
        loading,
        filter,
        setFilter,
        markAllAsRead,
        clearAll,
        refresh,
    } = useNotifications();

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const handleClearAll = async () => {
        if (confirm('¿Eliminar todas las notificaciones?')) {
            await clearAll();
        }
    };

    return (
        <div className="w-96 max-h-[600px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Notificaciones
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                        {notifications.length}
                    </Badge>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={refresh}
                        className="w-8 h-8"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="w-8 h-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-800">
                <Filter className="w-4 h-4 text-gray-400" />
                <div className="flex gap-2 flex-1">
                    {(['all', 'unread', 'critical'] as const).map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`
                px-3 py-1 rounded-lg text-xs font-medium transition-colors
                ${filter === filterOption
                                ? 'bg-theme-primary/20 text-theme-primary-dark dark:bg-theme-primary-dark/30 dark:text-theme-primary-light'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                            }
              `}
                        >
                            {filterOption === 'all' && 'Todas'}
                            {filterOption === 'unread' && 'No leídas'}
                            {filterOption === 'critical' && 'Críticas'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-theme-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                        <p className="text-sm text-gray-500">Cargando...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCheck className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                            Todo al día
                        </p>
                        <p className="text-sm text-gray-500">
                            No hay notificaciones {filter !== 'all' && `(${filter})`}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            {notifications.length > 0 && (
                <div className="flex items-center gap-2 p-3 border-t border-gray-200 dark:border-gray-800">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="flex-1 text-xs"
                    >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Marcar todas como leídas
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpiar
                    </Button>
                </div>
            )}
        </div>
    );
}