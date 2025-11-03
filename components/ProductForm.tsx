"use client";

import { useState, useEffect } from "react";
import { Producto, Categoria } from "@/types/inventario";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  producto?: Producto;
  onSubmit: (producto: Producto) => void;
}

const categorias: Categoria[] = [
  "Medicamentos",
  "Equipos Médicos",
  "Material Desechable",
  "Material Quirúrgico",
  "Insumos de Laboratorio",
  "Dispositivos Médicos",
  "Otros",
];

export default function ProductForm({ producto, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Producto, "id" | "fechaIngreso">>({
    nombre: "",
    categoria: "Medicamentos",
    cantidad: 0,
    cantidadMinima: 0,
    precioUnitario: 0,
    fechaVencimiento: "",
    proveedor: "",
    ubicacion: "",
    descripcion: "",
    codigoBarras: "",
  });

  useEffect(() => {
    if (producto) {
      const { id, fechaIngreso, ...rest } = producto;
      setFormData(rest);
    }
  }, [producto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (producto) {
      onSubmit({ ...producto, ...formData });
    } else {
      const nuevoProducto: Producto = {
        ...formData,
        id: Date.now().toString(),
        fechaIngreso: new Date().toISOString().split("T")[0],
      };
      onSubmit(nuevoProducto);
    }
    
    router.push("/inventario");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cantidad" || name === "cantidadMinima" || name === "precioUnitario"
        ? parseFloat(value) || 0
        : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {producto ? "Editar Producto" : "Agregar Nuevo Producto"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad Actual *
          </label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="cantidadMinima" className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad Mínima *
          </label>
          <input
            type="number"
            id="cantidadMinima"
            name="cantidadMinima"
            value={formData.cantidadMinima}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="precioUnitario" className="block text-sm font-medium text-gray-700 mb-2">
            Precio Unitario ($) *
          </label>
          <input
            type="number"
            id="precioUnitario"
            name="precioUnitario"
            value={formData.precioUnitario}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Vencimiento *
          </label>
          <input
            type="date"
            id="fechaVencimiento"
            name="fechaVencimiento"
            value={formData.fechaVencimiento}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700 mb-2">
            Proveedor *
          </label>
          <input
            type="text"
            id="proveedor"
            name="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación (Almacén/Sala) *
          </label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Almacén A, Sala 3B"
          />
        </div>

        <div>
          <label htmlFor="codigoBarras" className="block text-sm font-medium text-gray-700 mb-2">
            Código de Barras
          </label>
          <input
            type="text"
            id="codigoBarras"
            name="codigoBarras"
            value={formData.codigoBarras}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {producto ? "Actualizar Producto" : "Agregar Producto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/inventario")}
          className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

