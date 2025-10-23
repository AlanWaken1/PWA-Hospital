// hooks/useAlerts.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Alerta {
    id: string;
    tipo: 'stock_bajo' | 'stock_critico' | 'punto_reorden' | 'caducidad_proxima' | 'caducado';
    producto_id: string;
    inventario_id?: string;
    titulo: string;
    mensaje: string;
    severidad: 'info' | 'warning' | 'error' | 'critical';
    leida: boolean;
    created_at: string;
    leida_at?: string;
    producto?: {
        id: string;
        codigo: string;
        nombre: string;
        unidad_medida: string;
    };
    inventario?: {
        id: string;
        cantidad_disponible: number;
        lote?: string;
        fecha_caducidad?: string;
        ubicacion?: {
            nombre: string;
        };
    };
}

export interface AlertStats {
    total: number;
    criticas: number;
    altas: number;
    medias: number;
    bajas: number;
    noLeidas: number;
}

export function useAlerts() {
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchAlertas = async (soloNoLeidas: boolean = false) => {
        try {
            setLoading(true);
            let query = supabase
                .from('alertas')
                .select(`
          *,
          producto:productos(id, codigo, nombre, unidad_medida),
          inventario:inventario(
            id,
            cantidad_disponible,
            lote,
            fecha_caducidad,
            ubicacion:ubicaciones(nombre)
          )
        `)
                .order('created_at', { ascending: false });

            if (soloNoLeidas) {
                query = query.eq('leida', false);
            }

            const { data, error } = await query;

            if (error) throw error;
            setAlertas(data || []);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching alertas:', err);
        } finally {
            setLoading(false);
        }
    };

    const marcarComoLeida = async (alertaId: string) => {
        try {
            const { error } = await supabase
                .from('alertas')
                .update({
                    leida: true,
                    leida_at: new Date().toISOString()
                })
                .eq('id', alertaId);

            if (error) throw error;

            // Actualizar estado local
            setAlertas(prev =>
                prev.map(alerta =>
                    alerta.id === alertaId
                        ? { ...alerta, leida: true, leida_at: new Date().toISOString() }
                        : alerta
                )
            );

            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const marcarTodasComoLeidas = async () => {
        try {
            const idsNoLeidas = alertas
                .filter(a => !a.leida)
                .map(a => a.id);

            if (idsNoLeidas.length === 0) return { error: null };

            const { error } = await supabase
                .from('alertas')
                .update({
                    leida: true,
                    leida_at: new Date().toISOString()
                })
                .in('id', idsNoLeidas);

            if (error) throw error;

            // Actualizar estado local
            setAlertas(prev =>
                prev.map(alerta => ({
                    ...alerta,
                    leida: true,
                    leida_at: new Date().toISOString()
                }))
            );

            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const eliminarAlerta = async (alertaId: string) => {
        try {
            const { error } = await supabase
                .from('alertas')
                .delete()
                .eq('id', alertaId);

            if (error) throw error;

            // Actualizar estado local
            setAlertas(prev => prev.filter(a => a.id !== alertaId));

            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const getStats = (): AlertStats => {
        const stats: AlertStats = {
            total: alertas.length,
            criticas: 0,
            altas: 0,
            medias: 0,
            bajas: 0,
            noLeidas: 0,
        };

        alertas.forEach(alerta => {
            if (!alerta.leida) stats.noLeidas++;

            switch (alerta.severidad) {
                case 'critical':
                    stats.criticas++;
                    break;
                case 'error':
                    stats.altas++;
                    break;
                case 'warning':
                    stats.medias++;
                    break;
                case 'info':
                    stats.bajas++;
                    break;
            }
        });

        return stats;
    };

    // Cargar alertas al montar
    useEffect(() => {
        fetchAlertas();
    }, []);

    return {
        alertas,
        loading,
        error,
        fetchAlertas,
        marcarComoLeida,
        marcarTodasComoLeidas,
        eliminarAlerta,
        getStats,
    };
}