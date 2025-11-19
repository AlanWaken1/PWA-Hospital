// hooks/useStaff.ts - Hook para obtener usuarios registrados
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface StaffMember {
    id: string;
    nombre_completo: string;
    email: string;
    rol: string;
    departamento: string | null;
    telefono: string | null;
    avatar_url: string | null;
    esta_activo: boolean;
    created_at: string;
    updated_at: string;
}

export function useStaff() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const supabase = createClient();

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('esta_activo', true)
                .order('nombre_completo', { ascending: true });

            if (fetchError) throw fetchError;

            setStaff(data || []);
        } catch (err: any) {
            console.error('Error fetching staff:', err);
            setError(err.message || 'Error cargando personal');
        } finally {
            setLoading(false);
        }
    };

    return { staff, loading, error, refetch: fetchStaff };
}