"use client";

import { Producto } from "@/types/inventario";
import Link from "next/link";

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const fechaVencimiento = new Date(producto.fechaVencimiento);
  const hoy = new Date();
  const diasRestantes = Math.ceil(
    (fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const estaVencido = diasRestantes < 0;
  const estaPorVencer = diasRestantes >= 0 && diasRestantes <= 30;
  const stockBajo = producto.cantidad <= producto.cantidadMinima;

  const getEstadoColor = () => {
    if (estaVencido) return "bg-red-100 border-red-300";
    if (estaPorVencer) return "bg-yellow-100 border-yellow-300";
    if (stockBajo) return "bg-orange-100 border-orange-300";
    return "bg-white border-gray-200";
  };

  return (
    <div
      className={`${getEstadoColor()} border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{producto.nombre}</h3>
        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
          {producto.categoria}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Cantidad:</span>
          <span className={`font-semibold ${stockBajo ? "text-red-600" : "text-gray-800"}`}>
            {producto.cantidad} unidades
          </span>
        </div>
        {stockBajo && (
          <div className="text-xs text-red-600 font-medium">
            ⚠️ Stock mínimo: {producto.cantidadMinima}
          </div>
        )}
        <div className="flex justify-between">
          <span>Precio unitario:</span>
          <span className="font-semibold">${producto.precioUnitario.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Proveedor:</span>
          <span>{producto.proveedor}</span>
        </div>
        <div className="flex justify-between">
          <span>Ubicación:</span>
          <span>{producto.ubicacion}</span>
        </div>
        <div className="flex justify-between">
          <span>Vencimiento:</span>
          <span className={estaVencido ? "text-red-600 font-semibold" : estaPorVencer ? "text-yellow-600 font-semibold" : ""}>
            {fechaVencimiento.toLocaleDateString("es-ES")}
            {estaVencido && " (Vencido)"}
            {estaPorVencer && !estaVencido && ` (${diasRestantes} días)`}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/editar/${producto.id}`}
          className="flex-1 text-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Editar
        </Link>
        <button
          onClick={() => {
            if (confirm("¿Estás seguro de eliminar este producto?")) {
              // La eliminación se manejará en el componente padre
              window.dispatchEvent(new CustomEvent("deleteProduct", { detail: producto.id }));
            }
          }}
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

