// hooks/useCriticalSupplies.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface CriticalSupply {
    id: string;
    nombre: string;
    stock: number;
    stockMinimo: number;
    estado: 'critico' | 'bajo' | 'normal';
    categoria: string;
}

export function useCriticalSupplies() {
    const [supplies, setSupplies] = useState<CriticalSupply[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchCriticalSupplies() {
            try {
                setLoading(true);

                // Usar la vista de stock total y filtrar los críticos/bajos
                const { data, error: supplyError } = await supabase
                    .from('vista_stock_total')
                    .select('*')
                    .in('estado_stock', ['critico', 'bajo'])
                    .order('cantidad_total', { ascending: true })
                    .limit(5);

                if (supplyError) throw supplyError;

                const formattedSupplies: CriticalSupply[] = data?.map(item => ({
                    id: item.producto_id,
                    nombre: item.nombre || 'Producto sin nombre',
                    stock: item.cantidad_total || 0,
                    stockMinimo: item.stock_minimo || 0,
                    estado: item.estado_stock as 'critico' | 'bajo' | 'normal',
                    categoria: item.categoria || 'Sin categoría',
                })) || [];

                setSupplies(formattedSupplies);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching critical supplies:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCriticalSupplies();

        // Refresh cada 30 segundos
        const interval = setInterval(fetchCriticalSupplies, 30000);

        return () => clearInterval(interval);
    }, []);

    return { supplies, loading, error };
}