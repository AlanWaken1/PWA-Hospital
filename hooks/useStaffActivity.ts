// hooks/useStaffActivity.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface StaffActivity {
    id: string;
    name: string;
    action: string;
    status: 'En línea' | 'Ocupado' | 'Ausente';
    online: boolean;
    rol: string;
    timestamp: string;
}

export function useStaffActivity(limit: number = 4) {
    const [activities, setActivities] = useState<StaffActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchStaffActivity() {
            try {
                setLoading(true);

                // Obtener movimientos recientes agrupados por usuario
                const { data: movimientos, error: movError } = await supabase
                    .from('movimientos')
                    .select(`
            usuario_id,
            tipo_movimiento,
            created_at,
            producto:productos(nombre),
            usuario:profiles(nombre_completo, rol)
          `)
                    .order('created_at', { ascending: false })
                    .limit(limit * 3); // Traemos más para tener variedad

                if (movError) throw movError;

                // Agrupar por usuario y tomar la actividad más reciente de cada uno
                const userActivityMap = new Map<string, typeof movimientos[0]>();

                movimientos?.forEach(mov => {
                    if (!userActivityMap.has(mov.usuario_id)) {
                        userActivityMap.set(mov.usuario_id, mov);
                    }
                });

                // Convertir a array y limitar
                const uniqueActivities = Array.from(userActivityMap.values())
                    .slice(0, limit);

                const formattedActivities: StaffActivity[] = uniqueActivities.map(item => {
                    const actionMap: Record<string, string> = {
                        'entrada': `Registró entrada de ${item.producto?.nombre || 'producto'}`,
                        'salida': `Dispensó ${item.producto?.nombre || 'producto'}`,
                        'ajuste': `Realizó ajuste de ${item.producto?.nombre || 'inventario'}`,
                        'transferencia': `Transfirió ${item.producto?.nombre || 'producto'}`,
                        'merma': `Registró merma de ${item.producto?.nombre || 'producto'}`,
                        'caducado': `Dio de baja ${item.producto?.nombre || 'producto'} caducado`,
                    };

                    // Determinar estado basado en última actividad
                    const minutosDesdeActividad = Math.floor(
                        (Date.now() - new Date(item.created_at).getTime()) / 60000
                    );

                    let status: 'En línea' | 'Ocupado' | 'Ausente';
                    let online: boolean;

                    if (minutosDesdeActividad < 5) {
                        status = 'En línea';
                        online = true;
                    } else if (minutosDesdeActividad < 30) {
                        status = 'Ocupado';
                        online = true;
                    } else {
                        status = 'Ausente';
                        online = false;
                    }

                    return {
                        id: item.usuario_id,
                        name: item.usuario?.nombre_completo || 'Usuario desconocido',
                        action: actionMap[item.tipo_movimiento] || 'Realizó una acción',
                        status,
                        online,
                        rol: item.usuario?.rol || 'staff',
                        timestamp: new Date(item.created_at).toLocaleString('es-MX'),
                    };
                });

                setActivities(formattedActivities);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching staff activity:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStaffActivity();

        // Refresh cada 20 segundos
        const interval = setInterval(fetchStaffActivity, 20000);

        return () => clearInterval(interval);
    }, [limit]);

    return { activities, loading, error };
}