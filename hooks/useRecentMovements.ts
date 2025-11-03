// hooks/useRecentMovements.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface RecentMovement {
    id: string;
    type: 'entrada' | 'salida' | 'ajuste' | 'transferencia';
    item: string;
    quantity: number;
    time: string;
    usuario: string;
    ubicacion: string;
}

export function useRecentMovements(limit: number = 4) {
    const [movements, setMovements] = useState<RecentMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchMovements() {
            try {
                setLoading(true);

                const { data, error: movError } = await supabase
                    .from('movimientos')
                    .select(`
            *,
            producto:productos(nombre),
            usuario:profiles(nombre_completo),
            ubicacion_origen:ubicaciones!ubicacion_origen_id(nombre),
            ubicacion_destino:ubicaciones!ubicacion_destino_id(nombre)
          `)
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (movError) throw movError;

                const formattedMovements: RecentMovement[] = data?.map(item => ({
                    id: item.id,
                    type: item.tipo_movimiento as 'entrada' | 'salida' | 'ajuste' | 'transferencia',
                    item: item.producto?.nombre || 'Producto desconocido',
                    quantity: item.cantidad,
                    time: new Date(item.created_at).toLocaleString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: 'short',
                    }),
                    usuario: item.usuario?.nombre_completo || 'Usuario desconocido',
                    ubicacion: item.ubicacion_destino?.nombre || item.ubicacion_origen?.nombre || 'Sin ubicación',
                })) || [];

                setMovements(formattedMovements);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching recent movements:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMovements();

        // Refresh cada 15 segundos
        const interval = setInterval(fetchMovements, 15000);

        return () => clearInterval(interval);
    }, [limit]);

    return { movements, loading, error };
}