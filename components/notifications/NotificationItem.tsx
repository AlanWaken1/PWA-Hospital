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
        const iconClass = "w-5 h-5 flex-shrink-0";

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
                block p-4 sm:p-4 
                hover:bg-gray-50 dark:hover:bg-gray-800/50 
                active:bg-gray-100 dark:active:bg-gray-800
                transition-colors cursor-pointer
                border-l-4 ${getSeverityColor()}
                ${!notification.leida ? 'bg-theme-primary/5 dark:bg-theme-primary-dark/5' : ''}
            `}
        >
            <div className="flex items-start gap-3">

                {/* Icon */}
                <div className="mt-0.5 flex-shrink-0">
                    {getIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className={`text-sm sm:text-sm font-medium leading-snug ${
                            !notification.leida
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-600 dark:text-gray-400'
                        }`}>
                            {notification.titulo}
                        </h4>

                        {/* Unread indicator */}
                        {!notification.leida && (
                            <div className="w-2 h-2 bg-theme-primary rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                        {notification.mensaje}
                    </p>

                    {/* Product info */}
                    {notification.producto && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <Package className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">
                                {notification.producto.codigo} - {notification.producto.nombre}
                            </span>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xs text-gray-500 truncate">
                            {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: es,
                            })}
                        </span>

                        <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.leida && (
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        await markAsRead(notification.id);
                                    }}
                                    className="
                                        p-2 sm:p-1.5
                                        hover:bg-gray-200 dark:hover:bg-gray-700
                                        rounded-lg
                                        transition-colors
                                        min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0
                                        flex items-center justify-center
                                    "
                                    title="Marcar como leída"
                                    aria-label="Marcar como leída"
                                >
                                    <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-500" />
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="
                                    p-2 sm:p-1.5
                                    hover:bg-red-100 dark:hover:bg-red-900/20
                                    rounded-lg
                                    transition-colors
                                    min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0
                                    flex items-center justify-center
                                "
                                title="Eliminar"
                                aria-label="Eliminar notificación"
                            >
                                <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-500 hover:text-red-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}