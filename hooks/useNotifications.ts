// hooks/useNotifications.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Notification {
    id: string;
    tipo: 'stock_bajo' | 'stock_critico' | 'caducidad_proxima' | 'caducado' | 'punto_reorden' | 'stock_excedente' | 'sistema';
    producto_id?: string;
    inventario_id?: string;
    titulo: string;
    mensaje: string;
    severidad: 'info' | 'warning' | 'error' | 'critical';
    leida: boolean;
    created_at: string;
    producto?: {
        codigo: string;
        nombre: string;
    };
}

export function useNotifications() {
    const supabase = createClient();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('alertas')
                .select(`
          *,
          producto:productos(codigo, nombre)
        `)
                .order('created_at', { ascending: false })
                .limit(50);

            // Apply filters
            if (filter === 'unread') {
                query = query.eq('leida', false);
            } else if (filter === 'critical') {
                query = query.in('severidad', ['error', 'critical']);
            }

            const { data, error } = await query;

            if (error) throw error;

            setNotifications(data || []);

            // Count unread
            const unread = (data || []).filter(n => !n.leida).length;
            setUnreadCount(unread);

        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    // Mark as read
    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('alertas')
                .update({
                    leida: true,
                    fecha_leida: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, leida: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications
                .filter(n => !n.leida)
                .map(n => n.id);

            if (unreadIds.length === 0) return;

            const { error } = await supabase
                .from('alertas')
                .update({
                    leida: true,
                    fecha_leida: new Date().toISOString()
                })
                .in('id', unreadIds);

            if (error) throw error;

            // Update local state
            setNotifications(prev =>
                prev.map(n => ({ ...n, leida: true }))
            );
            setUnreadCount(0);

        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Delete notification
    const deleteNotification = async (id: string) => {
        try {
            const { error } = await supabase
                .from('alertas')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update local state
            const wasUnread = notifications.find(n => n.id === id)?.leida === false;
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Clear all notifications
    const clearAll = async () => {
        try {
            const { error } = await supabase
                .from('alertas')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

            if (error) throw error;

            setNotifications([]);
            setUnreadCount(0);

        } catch (error) {
            console.error('Error clearing all:', error);
        }
    };

    // Real-time subscription
    useEffect(() => {
        fetchNotifications();

        // Subscribe to new notifications
        const channel = supabase
            .channel('alertas-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'alertas',
                },
                (payload) => {
                    console.log('Notification change:', payload);

                    if (payload.eventType === 'INSERT') {
                        // New notification
                        const newNotification = payload.new as Notification;

                        setNotifications(prev => [newNotification, ...prev]);
                        setUnreadCount(prev => prev + 1);

                        // Play sound
                        playNotificationSound();

                        // Show browser notification
                        if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification(newNotification.titulo, {
                                body: newNotification.mensaje,
                                icon: '/icons/icon-192x192.png',
                                badge: '/icons/badge-72x72.png',
                                tag: newNotification.id,
                            });
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        // Updated notification
                        setNotifications(prev =>
                            prev.map(n =>
                                n.id === payload.new.id ? payload.new as Notification : n
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        // Deleted notification
                        setNotifications(prev =>
                            prev.filter(n => n.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchNotifications]);

    // Refetch when filter changes
    useEffect(() => {
        fetchNotifications();
    }, [filter, fetchNotifications]);

    // Request notification permission
    const requestPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        filter,
        setFilter,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        requestPermission,
        refresh: fetchNotifications,
    };
}

// Helper to play notification sound
function playNotificationSound() {
    try {
        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Silently fail if audio playback is blocked
        });
    } catch (error) {
        // Ignore audio errors
    }
}