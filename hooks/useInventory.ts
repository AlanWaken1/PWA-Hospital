// hooks/useInventory.ts - VERSIÓN OFFLINE
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StockTotal, Producto, Inventario, Categoria, Ubicacion } from '@/types/database.types';
import { getProductos, addPendingAction, isOnline } from '@/lib/offline/sync';
import { db } from '@/lib/offline/db';

export function useInventory() {
    const [stockTotal, setStockTotal] = useState<StockTotal[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const fetchStockTotal = async () => {
        // 🔴 Saltear si estamos offline (vista no se cachea por ahora)
        if (!isOnline()) {
            console.log('📴 Offline: Saltando carga de stock total');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('vista_stock_total')
                .select('*')
                .order('nombre', { ascending: true });

            if (error) throw error;
            setStockTotal(data || []);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching stock total:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductos = async () => {
        try {
            setLoading(true);

            // ✅ SI NO HAY INTERNET: Usar caché
            if (!isOnline()) {
                console.log('📴 Offline: Cargando productos desde caché');
                const cachedProductos = await getProductos();
                setProductos(cachedProductos as any);
                setLoading(false);
                return;
            }

            // ✅ SI HAY INTERNET: Cargar desde Supabase y cachear
            const { data, error } = await supabase
                .from('productos')
                .select(`
          *,
          categoria:categorias(*)
        `)
                .eq('esta_activo', true)
                .order('nombre', { ascending: true });

            if (error) throw error;

            setProductos(data || []);

            // Cachear para uso offline
            if (data) {
                const formatted = data.map((p: any) => ({
                    ...p,
                    categoria: p.categoria ? {
                        id: p.categoria.id,
                        nombre: p.categoria.nombre
                    } : undefined
                }));
                await db.productos.clear();
                await db.productos.bulkAdd(formatted);
            }
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching productos:', err);

            // Si falla online, intentar caché como fallback
            try {
                const cachedProductos = await getProductos();
                setProductos(cachedProductos as any);
            } catch (cacheErr) {
                console.error('Error cargando desde caché:', cacheErr);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategorias = async () => {
        // 🔴 Saltear si estamos offline
        if (!isOnline()) {
            console.log('📴 Offline: Saltando carga de categorías');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .eq('esta_activa', true)
                .order('orden', { ascending: true });

            if (error) throw error;
            setCategorias(data || []);
        } catch (err: any) {
            console.error('Error fetching categorias:', err);
        }
    };

    const fetchUbicaciones = async () => {
        // 🔴 Saltear si estamos offline
        if (!isOnline()) {
            console.log('📴 Offline: Saltando carga de ubicaciones');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('ubicaciones')
                .select('*')
                .eq('esta_activa', true)
                .order('nombre', { ascending: true });

            if (error) throw error;
            setUbicaciones(data || []);
        } catch (err: any) {
            console.error('Error fetching ubicaciones:', err);
        }
    };

    const createProducto = async (producto: Omit<Producto, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            // ✅ SI ESTAMOS OFFLINE: Guardar para sincronizar después
            if (!isOnline()) {
                console.log('📴 Offline: Guardando producto para sincronizar');
                await addPendingAction('create', 'productos', producto);

                return {
                    data: null,
                    error: null,
                    offline: true,
                    message: '✅ Producto guardado. Se sincronizará cuando haya conexión.'
                };
            }

            // ✅ SI HAY INTERNET: Crear normalmente
            const { data, error } = await supabase
                .from('productos')
                .insert([producto])
                .select()
                .single();

            if (error) throw error;
            await fetchProductos();
            await fetchStockTotal();
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err.message };
        }
    };

    const updateProducto = async (id: string, producto: Partial<Producto>) => {
        try {
            // ✅ SI ESTAMOS OFFLINE: Guardar para sincronizar después
            if (!isOnline()) {
                console.log('📴 Offline: Guardando actualización para sincronizar');
                await addPendingAction('update', 'productos', { id, ...producto });

                return {
                    data: null,
                    error: null,
                    offline: true,
                    message: '✅ Cambios guardados. Se sincronizarán cuando haya conexión.'
                };
            }

            // ✅ SI HAY INTERNET: Actualizar normalmente
            const { data, error } = await supabase
                .from('productos')
                .update(producto)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            await fetchProductos();
            await fetchStockTotal();
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err.message };
        }
    };

    const deleteProducto = async (id: string) => {
        try {
            // ✅ SI ESTAMOS OFFLINE: Guardar para sincronizar después
            if (!isOnline()) {
                console.log('📴 Offline: Guardando eliminación para sincronizar');
                await addPendingAction('update', 'productos', { id, esta_activo: false });

                return {
                    error: null,
                    offline: true,
                    message: '✅ Eliminación guardada. Se sincronizará cuando haya conexión.'
                };
            }

            // ✅ SI HAY INTERNET: Eliminar normalmente
            const { error } = await supabase
                .from('productos')
                .update({ esta_activo: false })
                .eq('id', id);

            if (error) throw error;
            await fetchProductos();
            await fetchStockTotal();
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const getInventarioByProducto = async (productoId: string) => {
        // 🔴 Solo funciona online (por ahora)
        if (!isOnline()) {
            console.log('📴 Offline: Inventario por producto no disponible');
            return {
                data: [],
                error: null,
                offline: true
            };
        }

        try {
            const { data, error } = await supabase
                .from('inventario')
                .select(`
          *,
          producto:productos(*),
          ubicacion:ubicaciones(*),
          proveedor:proveedores(*)
        `)
                .eq('producto_id', productoId)
                .eq('esta_activo', true);

            if (error) throw error;
            return { data: data || [], error: null };
        } catch (err: any) {
            return { data: [], error: err.message };
        }
    };

    const registrarEntrada = async (entrada: {
        producto_id: string;
        ubicacion_id: string;
        cantidad: number;
        lote?: string;
        fecha_caducidad?: string;
        proveedor_id?: string;
        costo_unitario?: number;
        documento_referencia?: string;
        notas?: string;
    }) => {
        // ✅ SI ESTAMOS OFFLINE: Guardar para sincronizar después
        if (!isOnline()) {
            console.log('📴 Offline: Guardando entrada para sincronizar');
            await addPendingAction('create', 'movimientos', {
                tipo_movimiento: 'entrada',
                ...entrada
            });

            return {
                error: null,
                offline: true,
                message: '✅ Entrada guardada. Se sincronizará cuando haya conexión.'
            };
        }

        // ✅ SI HAY INTERNET: Registrar normalmente
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario no autenticado');

            // Buscar si ya existe un inventario con ese producto, ubicación y lote
            const { data: inventarioExistente } = await supabase
                .from('inventario')
                .select('*')
                .eq('producto_id', entrada.producto_id)
                .eq('ubicacion_id', entrada.ubicacion_id)
                .eq('lote', entrada.lote || '')
                .eq('esta_activo', true)
                .single();

            let inventarioId: string;
            let cantidadAnterior = 0;

            if (inventarioExistente) {
                cantidadAnterior = inventarioExistente.cantidad_actual;
                const cantidadNueva = cantidadAnterior + entrada.cantidad;

                const { data, error } = await supabase
                    .from('inventario')
                    .update({ cantidad_actual: cantidadNueva })
                    .eq('id', inventarioExistente.id)
                    .select()
                    .single();

                if (error) throw error;
                inventarioId = inventarioExistente.id;
            } else {
                const { data, error } = await supabase
                    .from('inventario')
                    .insert([{
                        producto_id: entrada.producto_id,
                        ubicacion_id: entrada.ubicacion_id,
                        cantidad_actual: entrada.cantidad,
                        cantidad_reservada: 0,
                        lote: entrada.lote || null,
                        fecha_caducidad: entrada.fecha_caducidad || null,
                        proveedor_id: entrada.proveedor_id || null,
                        fecha_ingreso: new Date().toISOString().split('T')[0],
                        costo_unitario: entrada.costo_unitario || null,
                    }])
                    .select()
                    .single();

                if (error) throw error;
                inventarioId = data.id;
                cantidadAnterior = 0;
            }

            const { error: movError } = await supabase
                .from('movimientos')
                .insert([{
                    producto_id: entrada.producto_id,
                    inventario_id: inventarioId,
                    tipo_movimiento: 'entrada',
                    cantidad: entrada.cantidad,
                    cantidad_anterior: cantidadAnterior,
                    cantidad_nueva: cantidadAnterior + entrada.cantidad,
                    ubicacion_destino_id: entrada.ubicacion_id,
                    usuario_id: user.id,
                    lote: entrada.lote || null,
                    fecha_caducidad: entrada.fecha_caducidad || null,
                    proveedor_id: entrada.proveedor_id || null,
                    costo_unitario: entrada.costo_unitario || null,
                    documento_referencia: entrada.documento_referencia || null,
                    notas: entrada.notas || null,
                }]);

            if (movError) throw movError;

            await fetchStockTotal();
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const registrarSalida = async (salida: {
        inventario_id: string;
        cantidad: number;
        motivo?: string;
        notas?: string;
    }) => {
        // ✅ SI ESTAMOS OFFLINE: Guardar para sincronizar después
        if (!isOnline()) {
            console.log('📴 Offline: Guardando salida para sincronizar');
            await addPendingAction('create', 'movimientos', {
                tipo_movimiento: 'salida',
                ...salida
            });

            return {
                error: null,
                offline: true,
                message: '✅ Salida guardada. Se sincronizará cuando haya conexión.'
            };
        }

        // ✅ SI HAY INTERNET: Registrar normalmente
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario no autenticado');

            // Obtener inventario actual
            const { data: inventario, error: invError } = await supabase
                .from('inventario')
                .select('*')
                .eq('id', salida.inventario_id)
                .single();

            if (invError) throw invError;
            if (!inventario) throw new Error('Inventario no encontrado');

            // Validar que hay suficiente stock
            if (inventario.cantidad_disponible < salida.cantidad) {
                throw new Error('Stock insuficiente');
            }

            const cantidadAnterior = inventario.cantidad_actual;
            const cantidadNueva = cantidadAnterior - salida.cantidad;

            // Actualizar inventario
            const { error: updateError } = await supabase
                .from('inventario')
                .update({ cantidad_actual: cantidadNueva })
                .eq('id', salida.inventario_id);

            if (updateError) throw updateError;

            // Registrar movimiento
            const { error: movError } = await supabase
                .from('movimientos')
                .insert([{
                    producto_id: inventario.producto_id,
                    inventario_id: salida.inventario_id,
                    tipo_movimiento: 'salida',
                    cantidad: salida.cantidad,
                    cantidad_anterior: cantidadAnterior,
                    cantidad_nueva: cantidadNueva,
                    ubicacion_origen_id: inventario.ubicacion_id,
                    usuario_id: user.id,
                    motivo: salida.motivo || null,
                    notas: salida.notas || null,
                }]);

            if (movError) throw movError;

            await fetchStockTotal();
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchStockTotal();
        fetchProductos();
        fetchCategorias();
        fetchUbicaciones();
    }, []);

    return {
        stockTotal,
        productos,
        categorias,
        ubicaciones,
        loading,
        error,
        fetchStockTotal,
        fetchProductos,
        fetchUbicaciones,
        fetchCategorias,
        createProducto,
        updateProducto,
        deleteProducto,
        getInventarioByProducto,
        registrarEntrada,
        registrarSalida,
    };
}