// hooks/useInventoryOffline.ts
"use client";

import { useState, useEffect } from 'react';
import { getProductos, addPendingAction, isOnline } from '@/lib/offline/sync';
import { createClient } from '@/lib/supabase/client';
import { LocalProducto } from '@/lib/offline/db';

export function useInventoryOffline() {
    const [productos, setProductos] = useState<LocalProducto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar productos (online o offline)
    const fetchProductos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProductos();
            setProductos(data);
        } catch (err: any) {
            setError(err.message);
            console.error('Error cargando productos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    // Crear producto (online o guardar para sincronizar)
    const createProducto = async (producto: Partial<LocalProducto>) => {
        try {
            if (isOnline()) {
                // Si hay internet, crear directamente
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('productos')
                    .insert(producto)
                    .select()
                    .single();

                if (error) throw error;

                // Actualizar lista local
                await fetchProductos();
                return { data, error: null };
            } else {
                // Si no hay internet, guardar acción pendiente
                await addPendingAction('create', 'productos', producto);

                // Mostrar feedback al usuario
                return {
                    data: null,
                    error: null,
                    offline: true,
                    message: 'Producto guardado. Se sincronizará cuando haya conexión.'
                };
            }
        } catch (err: any) {
            return { data: null, error: err.message };
        }
    };

    // Actualizar producto
    const updateProducto = async (id: string, updates: Partial<LocalProducto>) => {
        try {
            if (isOnline()) {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('productos')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;

                await fetchProductos();
                return { data, error: null };
            } else {
                await addPendingAction('update', 'productos', { id, ...updates });

                return {
                    data: null,
                    error: null,
                    offline: true,
                    message: 'Cambios guardados. Se sincronizarán cuando haya conexión.'
                };
            }
        } catch (err: any) {
            return { data: null, error: err.message };
        }
    };

    // Eliminar producto
    const deleteProducto = async (id: string) => {
        try {
            if (isOnline()) {
                const supabase = createClient();
                const { error } = await supabase
                    .from('productos')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                await fetchProductos();
                return { error: null };
            } else {
                await addPendingAction('delete', 'productos', { id });

                return {
                    error: null,
                    offline: true,
                    message: 'Eliminación guardada. Se sincronizará cuando haya conexión.'
                };
            }
        } catch (err: any) {
            return { error: err.message };
        }
    };

    // Buscar productos localmente
    const searchProductos = (query: string) => {
        const lowerQuery = query.toLowerCase();
        return productos.filter(p =>
            p.nombre.toLowerCase().includes(lowerQuery) ||
            p.codigo.toLowerCase().includes(lowerQuery)
        );
    };

    // Calcular estadísticas
    const stats = {
        total: productos.length,
        activos: productos.filter(p => p.esta_activo).length,
        criticos: productos.filter(p => {
            // Necesitarías acceso al inventario para calcular esto
            // Por ahora retornamos 0
            return false;
        }).length,
        bajos: 0,
        reorden: 0
    };

    return {
        productos,
        loading,
        error,
        stats,
        createProducto,
        updateProducto,
        deleteProducto,
        searchProductos,
        refresh: fetchProductos
    };
}