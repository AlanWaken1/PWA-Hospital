// hooks/useInventoryAnalytics.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface CategoryData {
    category: string;
    value: number; // Porcentaje de stock
    color: string; // Gradiente CSS
    count: number; // Cantidad total de productos
}

export function useInventoryAnalytics() {
    const [data, setData] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    // Paleta de colores en formato hex - gradientes CSS que SIEMPRE funcionan
    const colorPalette = [
        { from: '#10b981', to: '#059669' }, // emerald
        { from: '#8b5cf6', to: '#7c3aed' }, // violet
        { from: '#f43f5e', to: '#e11d48' }, // rose
        { from: '#06b6d4', to: '#0891b2' }, // cyan
        { from: '#f59e0b', to: '#d97706' }, // amber
        { from: '#14b8a6', to: '#0d9488' }, // teal
        { from: '#d946ef', to: '#c026d3' }, // fuchsia
        { from: '#84cc16', to: '#65a30d' }, // lime
        { from: '#6366f1', to: '#4f46e5' }, // indigo
        { from: '#f97316', to: '#ea580c' }, // orange
        { from: '#3b82f6', to: '#2563eb' }, // blue
        { from: '#a855f7', to: '#9333ea' }, // purple
        { from: '#ec4899', to: '#db2777' }, // pink
        { from: '#0ea5e9', to: '#0284c7' }, // sky
        { from: '#ef4444', to: '#dc2626' }, // red
    ];

    // Función para crear gradiente CSS
    const getGradientForCategory = (index: number) => {
        const colors = colorPalette[index % colorPalette.length];
        return `linear-gradient(to top, ${colors.to}, ${colors.from})`;
    };

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                setLoading(true);

                // Obtener stock por categoría
                const { data: stockData, error: stockError } = await supabase
                    .from('vista_stock_total')
                    .select('categoria, cantidad_total, stock_minimo, punto_reorden');

                if (stockError) throw stockError;

                // Agrupar por categoría y calcular porcentaje
                const categoryMap = new Map<string, { total: number; count: number }>();

                stockData?.forEach(item => {
                    const categoria = item.categoria || 'Sin categoría';
                    const existing = categoryMap.get(categoria) || { total: 0, count: 0 };

                    // Calcular porcentaje de stock (cantidad_total vs stock_minimo)
                    const porcentaje = item.stock_minimo > 0
                        ? Math.min(100, (item.cantidad_total / item.stock_minimo) * 100)
                        : 100;

                    categoryMap.set(categoria, {
                        total: existing.total + porcentaje,
                        count: existing.count + 1,
                    });
                });

                // Convertir a array y calcular promedios
                const analyticsData: CategoryData[] = Array.from(categoryMap.entries())
                    .map(([categoria, stats], index) => ({
                        category: categoria,
                        value: Math.round(stats.total / stats.count), // Promedio de porcentaje
                        color: getGradientForCategory(index), // Gradiente CSS real
                        count: stats.count,
                    }))
                    .sort((a, b) => b.value - a.value) // Ordenar por valor descendente
                    .slice(0, 6); // Top 6 categorías

                setData(analyticsData);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching inventory analytics:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();

        // Refresh cada 60 segundos
        const interval = setInterval(fetchAnalytics, 60000);

        return () => clearInterval(interval);
    }, []);

    return { data, loading, error };
}