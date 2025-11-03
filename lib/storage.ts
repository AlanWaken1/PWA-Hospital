import { Producto } from "@/types/inventario";

const STORAGE_KEY = "inventario-hospitalario";

export const getProductos = (): Producto[] => {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveProductos = (productos: Producto[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
};

export const addProducto = (producto: Producto): void => {
  const productos = getProductos();
  productos.push(producto);
  saveProductos(productos);
};

export const updateProducto = (id: string, productoActualizado: Producto): void => {
  const productos = getProductos();
  const index = productos.findIndex((p) => p.id === id);
  if (index !== -1) {
    productos[index] = productoActualizado;
    saveProductos(productos);
  }
};

export const deleteProducto = (id: string): void => {
  const productos = getProductos();
  const filtered = productos.filter((p) => p.id !== id);
  saveProductos(filtered);
};

export const getProductoById = (id: string): Producto | undefined => {
  const productos = getProductos();
  return productos.find((p) => p.id === id);
};

