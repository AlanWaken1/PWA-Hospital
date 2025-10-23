// types/database.types.ts
// Tipos para las tablas de la base de datos

export type UnidadMedida = 'pieza' | 'caja' | 'frasco' | 'ampolleta' | 'litro' | 'mililitro' | 'gramo' | 'kilogramo' | 'paquete' | 'rollo' | 'otro';

export type TipoMovimiento = 'entrada' | 'salida' | 'ajuste' | 'transferencia' | 'merma' | 'caducado' | 'devolucion';

export type EstadoStock = 'critico' | 'bajo' | 'reorden' | 'normal';

export interface Categoria {
    id: string;
    nombre: string;
    descripcion: string | null;
    icono: string | null;
    color: string | null;
    parent_id: string | null;
    orden: number;
    esta_activa: boolean;
    created_at: string;
}

export interface Proveedor {
    id: string;
    nombre: string;
    rfc: string | null;
    contacto_nombre: string | null;
    contacto_email: string | null;
    contacto_telefono: string | null;
    direccion: string | null;
    esta_activo: boolean;
    notas: string | null;
    created_at: string;
    updated_at: string;
}

export interface Producto {
    id: string;
    codigo: string;
    codigo_barras: string | null;
    nombre: string;
    descripcion: string | null;
    categoria_id: string;

    // Stock info
    unidad_medida: UnidadMedida;
    stock_minimo: number;
    stock_maximo: number;
    punto_reorden: number;

    // Características especiales
    requiere_receta: boolean;
    es_controlado: boolean;
    requiere_refrigeracion: boolean;
    es_fragil: boolean;
    controla_lote: boolean;
    controla_caducidad: boolean;

    // Info adicional
    imagen_url: string | null;
    fabricante: string | null;
    principio_activo: string | null;
    concentracion: string | null;
    forma_farmaceutica: string | null;

    // Costos
    costo_promedio: number | null;
    precio_ultima_compra: number | null;

    esta_activo: boolean;
    created_at: string;
    updated_at: string;

    // Relaciones
    categoria?: Categoria;
}

export interface Ubicacion {
    id: string;
    nombre: string;
    tipo: 'almacen' | 'farmacia' | 'consultorio' | 'quirofano' | 'urgencias' | 'laboratorio' | 'otro';
    descripcion: string | null;
    responsable_id: string | null;
    esta_activa: boolean;
    created_at: string;
}

export interface Inventario {
    id: string;
    producto_id: string;
    ubicacion_id: string;

    lote: string | null;
    fecha_caducidad: string | null;

    cantidad_actual: number;
    cantidad_reservada: number;
    cantidad_disponible: number;

    proveedor_id: string | null;
    fecha_ingreso: string | null;
    costo_unitario: number | null;

    esta_activo: boolean;
    created_at: string;
    updated_at: string;

    // Relaciones
    producto?: Producto;
    ubicacion?: Ubicacion;
    proveedor?: Proveedor;
}

export interface Movimiento {
    id: string;
    producto_id: string;
    inventario_id: string | null;

    tipo_movimiento: TipoMovimiento;

    cantidad: number;
    cantidad_anterior: number;
    cantidad_nueva: number;

    ubicacion_origen_id: string | null;
    ubicacion_destino_id: string | null;

    usuario_id: string;

    motivo: string | null;
    notas: string | null;
    documento_referencia: string | null;

    lote: string | null;
    fecha_caducidad: string | null;
    proveedor_id: string | null;
    costo_unitario: number | null;

    created_at: string;

    // Relaciones
    producto?: Producto;
    ubicacion_origen?: Ubicacion;
    ubicacion_destino?: Ubicacion;
    proveedor?: Proveedor;
}

// Vista de stock total (agregada)
export interface StockTotal {
    producto_id: string;
    codigo: string;
    nombre: string;
    unidad_medida: UnidadMedida;
    categoria: string;
    cantidad_total: number;
    stock_minimo: number;
    punto_reorden: number;
    estado_stock: EstadoStock;
}