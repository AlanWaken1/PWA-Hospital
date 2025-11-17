// hooks/useUserPreferences.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPreferences {
    id?: string;
    user_id?: string;
    notifications_enabled: boolean;
    email_notifications: boolean;
    low_stock_alerts: boolean;
    movement_notifications: boolean;
    sound_enabled: boolean;
    theme_mode: 'light' | 'dark' | 'system';
    color_theme: string;
    language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    notifications_enabled: true,
    email_notifications: true,
    low_stock_alerts: true,
    movement_notifications: true,
    sound_enabled: true,
    theme_mode: 'system',
    color_theme: 'blue',
    language: 'es',
};

export function useUserPreferences() {
    const { user, loading: authLoading } = useAuth();
    const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar preferencias
    useEffect(() => {
        // Esperar a que el auth termine de cargar
        if (authLoading) {
            return;
        }

        if (!user) {
            setLoading(false);
            setError('Usuario no autenticado');
            return;
        }

        loadPreferences();
    }, [user, authLoading]);

    const loadPreferences = async () => {
        if (!user) {
            setError('Usuario no autenticado');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const supabase = createClient();
            const { data, error: fetchError } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (fetchError) {
                // Si no existen preferencias, crear las por defecto
                if (fetchError.code === 'PGRST116') {
                    await createDefaultPreferences();
                    setPreferences(DEFAULT_PREFERENCES);
                } else {
                    throw fetchError;
                }
            } else {
                setPreferences(data as UserPreferences);
            }
        } catch (err) {
            console.error('Error loading preferences:', err);
            setError('Error al cargar preferencias');
            setPreferences(DEFAULT_PREFERENCES);
        } finally {
            setLoading(false);
        }
    };

    const createDefaultPreferences = async () => {
        if (!user) return;

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('user_preferences')
                .insert([
                    {
                        user_id: user.id,
                        ...DEFAULT_PREFERENCES,
                    },
                ]);

            if (error) throw error;
        } catch (err) {
            console.error('Error creating default preferences:', err);
        }
    };

    const updatePreferences = async (updates: Partial<UserPreferences>) => {
        if (!user) {
            console.error('No user found');
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            setError(null);

            const newPreferences = { ...preferences, ...updates };
            setPreferences(newPreferences);

            const supabase = createClient();
            const { error: updateError } = await supabase
                .from('user_preferences')
                .update(updates)
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            return { success: true };
        } catch (err) {
            console.error('Error updating preferences:', err);
            setError('Error al actualizar preferencias');
            // Revertir cambios en caso de error
            await loadPreferences();
            return { success: false, error: 'Error al actualizar preferencias' };
        }
    };

    const resetPreferences = async () => {
        return updatePreferences(DEFAULT_PREFERENCES);
    };

    return {
        preferences,
        loading: loading || authLoading, // ← Importante: también considerar authLoading
        error,
        updatePreferences,
        resetPreferences,
        refreshPreferences: loadPreferences,
    };
}