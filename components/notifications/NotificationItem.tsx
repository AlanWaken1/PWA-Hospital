// components/notifications/NotificationItem.tsx
"use client";

import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    AlertTriangle,
    AlertCircle,
    Info,
    XCircle,
    Package,
    Trash2,
    Check
} from 'lucide-react';
import Link from 'next/link';

interface NotificationItemProps {
    notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
    const { markAsRead, deleteNotification } = useNotifications();

    const handleClick = async () => {
        if (!notification.leida) {
            await markAsRead(notification.id);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await deleteNotification(notification.id);
    };

    const getIcon = () => {
        const iconClass = "w-5 h-5";

        switch (notification.severidad) {
            case 'critical':
                return <XCircle className={`${iconClass} text-red-500`} />;
            case 'error':
                return <AlertCircle className={`${iconClass} text-red-500`} />;
            case 'warning':
                return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
            case 'info':
            default:
                return <Info className={`${iconClass} text-blue-500`} />;
        }
    };

    const getSeverityColor = () => {
        switch (notification.severidad) {
            case 'critical':
                return 'bg-red-50 dark:bg-red-900/10 border-l-red-500';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/10 border-l-red-500';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/10 border-l-yellow-500';
            case 'info':
            default:
                return 'bg-blue-50 dark:bg-blue-900/10 border-l-blue-500';
        }
    };

    const getLink = () => {
        if (notification.producto_id) {
            return `/inventory?product=${notification.producto_id}`;
        }
        if (notification.tipo === 'stock_bajo' || notification.tipo === 'stock_critico') {
            return '/inventory';
        }
        if (notification.tipo === 'caducidad_proxima' || notification.tipo === 'caducado') {
            return '/alerts';
        }
        return null;
    };

    const link = getLink();
    const Wrapper = link ? Link : 'div';
    const wrapperProps = link ? { href: link } : {};


    return (
        // @ts-ignore
        <Wrapper
            {...wrapperProps}
            onClick={handleClick}
            className={`
        block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer
        border-l-4 ${getSeverityColor()}
        ${!notification.leida ? 'bg-emerald-50/30 dark:bg-emerald-900/5' : ''}
      `}
        >
            <div className="flex items-start gap-3">

                {/* Icon */}
                <div className="mt-0.5 flex-shrink-0">
                    {getIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm font-medium ${
                            !notification.leida
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-600 dark:text-gray-400'
                        }`}>
                            {notification.titulo}
                        </h4>

                        {/* Unread indicator */}
                        {!notification.leida && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.mensaje}
                    </p>

                    {/* Product info */}
                    {notification.producto && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-2">
                            <Package className="w-3 h-3" />
                            <span>
                {notification.producto.codigo} - {notification.producto.nombre}
              </span>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.created_at), {
                  addSuffix: true,
                  locale: es,
              })}
            </span>

                        <div className="flex items-center gap-1">
                            {!notification.leida && (
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        await markAsRead(notification.id);
                                    }}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                    title="Marcar como leída"
                                >
                                    <Check className="w-3 h-3 text-gray-500" />
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 className="w-3 h-3 text-gray-500 hover:text-red-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}