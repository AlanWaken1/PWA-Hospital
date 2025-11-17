// lib/offline/db.ts
import Dexie, { Table } from 'dexie';

// Tipos para las tablas locales
export interface LocalProducto {
    id: string;
    codigo: string;
    nombre: string;
    descripcion?: string;
    categoria_id: string;
    unidad_medida: string;
    stock_minimo: number;
    stock_maximo: number;
    punto_reorden: number;
    esta_activo: boolean;
    created_at: string;
    updated_at: string;
    // Datos relacionados desnormalizados para offline
    categoria?: {
        id: string;
        nombre: string;
    };
}

export interface LocalInventario {
    id: string;
    producto_id: string;
    ubicacion_id: string;
    lote?: string;
    fecha_caducidad?: string;
    cantidad_actual: number;
    cantidad_reservada: number;
    cantidad_disponible: number;
    created_at: string;
    updated_at: string;
    // Datos desnormalizados
    producto?: {
        id: string;
        codigo: string;
        nombre: string;
    };
    ubicacion?: {
        id: string;
        nombre: string;
    };
}

export interface LocalAlerta {
    id: string;
    tipo: string;
    producto_id?: string;
    titulo: string;
    mensaje: string;
    severidad: string;
    leida: boolean;
    created_at: string;
}

export interface PendingAction {
    id?: number;
    type: 'create' | 'update' | 'delete';
    table: string;
    data: any;
    timestamp: number;
    synced: boolean;
}

// Definir la base de datos
export class MediStockDB extends Dexie {
    productos!: Table<LocalProducto, string>;
    inventario!: Table<LocalInventario, string>;
    alertas!: Table<LocalAlerta, string>;
    pendingActions!: Table<PendingAction, number>;

    constructor() {
        super('MediStockDB');

        // Definir el schema
        // NOTA: No indexamos 'synced' porque es boolean y causa problemas
        this.version(1).stores({
            productos: 'id, codigo, nombre, categoria_id, esta_activo',
            inventario: 'id, producto_id, ubicacion_id, cantidad_disponible',
            alertas: 'id, tipo, severidad, leida, created_at',
            pendingActions: '++id, timestamp' // Solo indexamos timestamp
        });
    }
}

// Instancia única de la base de datos
export const db = new MediStockDB();