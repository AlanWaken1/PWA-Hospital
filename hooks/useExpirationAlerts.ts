// hooks/useExpirationAlerts.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ExpirationAlert {
    producto: string;
    lote: string;
    unidades: number;
    diasRestantes: number;
    fechaCaducidad: string;
}

export function useExpirationAlerts() {
    const [alerts, setAlerts] = useState<ExpirationAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchAlerts() {
            try {
                setLoading(true);

                // Usar la vista pre-calculada de productos por caducar
                const { data, error: alertError } = await supabase
                    .from('vista_productos_por_caducar')
                    .select('*')
                    .lte('dias_para_caducar', 30) // Próximos 30 días
                    .order('fecha_caducidad', { ascending: true })
                    .limit(5); // Solo las 5 más urgentes

                if (alertError) throw alertError;

                const formattedAlerts: ExpirationAlert[] = data?.map(item => ({
                    producto: item.nombre || 'Producto sin nombre',
                    lote: item.lote || 'Sin lote',
                    unidades: item.cantidad_disponible || 0,
                    diasRestantes: Math.abs(item.dias_para_caducar || 0),
                    fechaCaducidad: item.fecha_caducidad || '',
                })) || [];

                setAlerts(formattedAlerts);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching expiration alerts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAlerts();

        // Refresh cada 5 minutos
        const interval = setInterval(fetchAlerts, 300000);

        return () => clearInterval(interval);
    }, []);

    return { alerts, loading, error };
}