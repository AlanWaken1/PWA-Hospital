export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  cantidadMinima: number;
  precioUnitario: number;
  fechaVencimiento: string;
  proveedor: string;
  ubicacion: string;
  descripcion?: string;
  codigoBarras?: string;
  fechaIngreso: string;
}

export type Categoria = 
  | "Medicamentos"
  | "Equipos Médicos"
  | "Material Desechable"
  | "Material Quirúrgico"
  | "Insumos de Laboratorio"
  | "Dispositivos Médicos"
  | "Otros";

