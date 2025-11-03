// hooks/useStockLevel.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface StockLevel {
    percentage: number;
    totalDisponible: number;
    totalCapacidad: number;
    stockBajo: number;
    stockCritico: number;
}

export function useStockLevel() {
    const [stockLevel, setStockLevel] = useState<StockLevel>({
        percentage: 0,
        totalDisponible: 0,
        totalCapacidad: 0,
        stockBajo: 0,
        stockCritico: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchStockLevel() {
            try {
                setLoading(true);

                // Obtener resumen del stock global
                const { data, error: stockError } = await supabase
                    .from('vista_stock_total')
                    .select('cantidad_total, stock_minimo, estado_stock');

                if (stockError) throw stockError;

                let totalDisponible = 0;
                let totalMinimo = 0;
                let stockBajo = 0;
                let stockCritico = 0;

                data?.forEach(item => {
                    totalDisponible += item.cantidad_total || 0;
                    totalMinimo += item.stock_minimo || 0;

                    if (item.estado_stock === 'bajo') stockBajo++;
                    if (item.estado_stock === 'critico') stockCritico++;
                });

                // Calcular porcentaje: si estamos al mínimo = 100%, si tenemos el doble = 200%
                // Vamos a mostrar un % saludable cuando tengamos al menos 2x el mínimo
                const totalCapacidad = totalMinimo * 2; // Capacidad ideal = 2x el mínimo
                const percentage = totalCapacidad > 0
                    ? Math.round((totalDisponible / totalCapacidad) * 100)
                    : 0;

                setStockLevel({
                    percentage: Math.min(100, percentage),
                    totalDisponible,
                    totalCapacidad,
                    stockBajo,
                    stockCritico,
                });

                setError(null);
            } catch (err: any) {
                console.error('Error fetching stock level:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStockLevel();

        // Refresh cada 30 segundos
        const interval = setInterval(fetchStockLevel, 30000);

        return () => clearInterval(interval);
    }, []);

    return { stockLevel, loading, error };
}






