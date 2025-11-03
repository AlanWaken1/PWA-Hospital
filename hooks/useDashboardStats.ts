// hooks/useDashboardStats.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface DashboardStats {
    totalProductos: number;
    stockBajo: number;
    stockCritico: number;
    productosActivos: number;
    valorTotal: number;
    movimientosHoy: number;
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProductos: 0,
        stockBajo: 0,
        stockCritico: 0,
        productosActivos: 0,
        valorTotal: 0,
        movimientosHoy: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);

                // Total de productos activos
                const { count: totalCount, error: totalError } = await supabase
                    .from('productos')
                    .select('*', { count: 'exact', head: true })
                    .eq('esta_activo', true);

                if (totalError) throw totalError;

                // Stock bajo (usando vista pre-calculada)
                const { data: stockData, error: stockError } = await supabase
                    .from('vista_stock_total')
                    .select('estado_stock')
                    .in('estado_stock', ['bajo', 'critico']);

                if (stockError) throw stockError;

                const stockBajoCount = stockData?.filter(s => s.estado_stock === 'bajo').length || 0;
                const stockCriticoCount = stockData?.filter(s => s.estado_stock === 'critico').length || 0;

                // Movimientos de hoy
                const today = new Date().toISOString().split('T')[0];
                const { count: movimientosCount, error: movError } = await supabase
                    .from('movimientos')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', `${today}T00:00:00`)
                    .lte('created_at', `${today}T23:59:59`);

                if (movError) throw movError;

                // Valor total (aproximado sumando costo_promedio * stock)
                const { data: inventarioData, error: invError } = await supabase
                    .from('inventario')
                    .select('cantidad_disponible, costo_unitario')
                    .eq('esta_activo', true);

                if (invError) throw invError;

                const valorTotal = inventarioData?.reduce((acc, item) => {
                    return acc + (item.cantidad_disponible * (item.costo_unitario || 0));
                }, 0) || 0;

                setStats({
                    totalProductos: totalCount || 0,
                    stockBajo: stockBajoCount,
                    stockCritico: stockCriticoCount,
                    productosActivos: totalCount || 0,
                    valorTotal: Math.round(valorTotal),
                    movimientosHoy: movimientosCount || 0,
                });

                setError(null);
            } catch (err: any) {
                console.error('Error fetching dashboard stats:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();

        // Refresh cada 30 segundos
        const interval = setInterval(fetchStats, 30000);

        return () => clearInterval(interval);
    }, []);

    return { stats, loading, error };
}