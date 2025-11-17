// lib/offline/sync.ts
import { createClient } from '@/lib/supabase/client';
import { db, LocalProducto, LocalInventario, LocalAlerta } from './db';

// Detectar si hay conexión
export function isOnline(): boolean {
    return navigator.onLine;
}

// ============================================
// CACHEAR DATOS DESDE SUPABASE
// ============================================

export async function cacheProductos() {
    if (!isOnline()) return;

    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('productos')
            .select(`
        *,
        categoria:categorias(id, nombre)
      `)
            .eq('esta_activo', true);

        if (error) throw error;

        // Guardar en IndexedDB
        if (data) {
            await db.productos.clear();
            await db.productos.bulkAdd(data.map(p => ({
                ...p,
                categoria: p.categoria ? {
                    id: p.categoria.id,
                    nombre: p.categoria.nombre
                } : undefined
            })));

            console.log('✅ Productos cacheados offline:', data.length);
        }
    } catch (error) {
        console.error('Error cacheando productos:', error);
    }
}

export async function cacheInventario() {
    if (!isOnline()) return;

    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('inventario')
            .select(`
        *,
        producto:productos(id, codigo, nombre),
        ubicacion:ubicaciones(id, nombre)
      `)
            .eq('esta_activo', true);

        if (error) throw error;

        if (data) {
            await db.inventario.clear();
            await db.inventario.bulkAdd(data.map(i => ({
                ...i,
                producto: i.producto ? {
                    id: i.producto.id,
                    codigo: i.producto.codigo,
                    nombre: i.producto.nombre
                } : undefined,
                ubicacion: i.ubicacion ? {
                    id: i.ubicacion.id,
                    nombre: i.ubicacion.nombre
                } : undefined
            })));

            console.log('✅ Inventario cacheado offline:', data.length);
        }
    } catch (error) {
        console.error('Error cacheando inventario:', error);
    }
}

export async function cacheAlertas() {
    if (!isOnline()) return;

    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('alertas')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        if (data) {
            await db.alertas.clear();
            await db.alertas.bulkAdd(data);

            console.log('✅ Alertas cacheadas offline:', data.length);
        }
    } catch (error) {
        console.error('Error cacheando alertas:', error);
    }
}

// Cachear TODO al iniciar
export async function cacheAllData() {
    if (!isOnline()) {
        console.log('📴 Sin conexión, usando datos cacheados');
        return;
    }

    console.log('🔄 Cacheando datos para uso offline...');
    await Promise.all([
        cacheProductos(),
        cacheInventario(),
        cacheAlertas()
    ]);
    console.log('✅ Todos los datos cacheados');
}

// ============================================
// LEER DATOS (ONLINE O OFFLINE)
// ============================================

export async function getProductos(): Promise<LocalProducto[]> {
    if (isOnline()) {
        // Si hay internet, intentar desde Supabase y cachear
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('productos')
                .select(`
          *,
          categoria:categorias(id, nombre)
        `)
                .eq('esta_activo', true);

            if (error) throw error;

            if (data) {
                // Cachear para uso offline
                const formatted = data.map(p => ({
                    ...p,
                    categoria: p.categoria ? {
                        id: p.categoria.id,
                        nombre: p.categoria.nombre
                    } : undefined
                }));
                await db.productos.clear();
                await db.productos.bulkAdd(formatted);
                return formatted;
            }
        } catch (error) {
            console.error('Error obteniendo productos online, usando caché:', error);
            // Si falla, usar caché
            return db.productos.toArray();
        }
    }

    // Si no hay internet, usar caché local
    console.log('📴 Offline: Usando productos cacheados');
    return db.productos.toArray();
}

export async function getInventario(): Promise<LocalInventario[]> {
    if (isOnline()) {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('inventario')
                .select(`
          *,
          producto:productos(id, codigo, nombre),
          ubicacion:ubicaciones(id, nombre)
        `)
                .eq('esta_activo', true);

            if (error) throw error;

            if (data) {
                const formatted = data.map(i => ({
                    ...i,
                    producto: i.producto ? {
                        id: i.producto.id,
                        codigo: i.producto.codigo,
                        nombre: i.producto.nombre
                    } : undefined,
                    ubicacion: i.ubicacion ? {
                        id: i.ubicacion.id,
                        nombre: i.ubicacion.nombre
                    } : undefined
                }));
                await db.inventario.clear();
                await db.inventario.bulkAdd(formatted);
                return formatted;
            }
        } catch (error) {
            console.error('Error obteniendo inventario online, usando caché:', error);
            return db.inventario.toArray();
        }
    }

    console.log('📴 Offline: Usando inventario cacheado');
    return db.inventario.toArray();
}

export async function getAlertas(): Promise<LocalAlerta[]> {
    if (isOnline()) {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('alertas')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            if (data) {
                await db.alertas.clear();
                await db.alertas.bulkAdd(data);
                return data;
            }
        } catch (error) {
            console.error('Error obteniendo alertas online, usando caché:', error);
            return db.alertas.toArray();
        }
    }

    console.log('📴 Offline: Usando alertas cacheadas');
    return db.alertas.toArray();
}

// ============================================
// GUARDAR ACCIONES PENDIENTES (OFFLINE)
// ============================================

export async function addPendingAction(
    type: 'create' | 'update' | 'delete',
    table: string,
    data: any
) {
    await db.pendingActions.add({
        type,
        table,
        data,
        timestamp: Date.now(),
        synced: false
    });

    console.log(`💾 Acción guardada para sincronizar: ${type} en ${table}`);
}

// ============================================
// SINCRONIZAR ACCIONES PENDIENTES
// ============================================

export async function syncPendingActions() {
    if (!isOnline()) {
        console.log('📴 Sin conexión, no se puede sincronizar');
        return;
    }

    // Usar .filter() en lugar de .where() para boolean
    const pendingActions = await db.pendingActions
        .toArray()
        .then(actions => actions.filter(a => !a.synced));

    if (pendingActions.length === 0) {
        console.log('✅ No hay acciones pendientes para sincronizar');
        return;
    }

    console.log(`🔄 Sincronizando ${pendingActions.length} acciones pendientes...`);
    const supabase = createClient();

    for (const action of pendingActions) {
        try {
            switch (action.type) {
                case 'create':
                    await supabase.from(action.table).insert(action.data);
                    break;
                case 'update':
                    await supabase.from(action.table).update(action.data).eq('id', action.data.id);
                    break;
                case 'delete':
                    await supabase.from(action.table).delete().eq('id', action.data.id);
                    break;
            }

            // Marcar como sincronizada
            if (action.id) {
                await db.pendingActions.update(action.id, { synced: true });
            }
            console.log(`✅ Acción sincronizada: ${action.type} en ${action.table}`);
        } catch (error) {
            console.error(`❌ Error sincronizando acción ${action.id}:`, error);
        }
    }

    // Limpiar acciones sincronizadas (opcional, después de 24 horas)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const toDelete = await db.pendingActions
        .toArray()
        .then(actions =>
            actions
                .filter(a => a.synced && a.timestamp < oneDayAgo)
                .map(a => a.id!)
        );

    if (toDelete.length > 0) {
        await db.pendingActions.bulkDelete(toDelete);
    }

    console.log('✅ Sincronización completa');
}

// ============================================
// LISTENERS DE CONEXIÓN
// ============================================

export function setupOfflineListeners() {
    // Cuando vuelve la conexión, sincronizar
    window.addEventListener('online', async () => {
        console.log('🌐 Conexión restaurada');
        await syncPendingActions();
        await cacheAllData();
    });

    // Cuando se pierde la conexión
    window.addEventListener('offline', () => {
        console.log('📴 Sin conexión - Modo offline activado');
    });

    // Cachear datos inicialmente si hay conexión
    if (isOnline()) {
        cacheAllData();
    }
}