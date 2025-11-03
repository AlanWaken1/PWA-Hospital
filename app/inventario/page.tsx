"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Producto } from "@/types/inventario";
import { getProductos, deleteProducto } from "@/lib/storage";
import Link from "next/link";

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("nombre");

  useEffect(() => {
    const loadProductos = () => {
      const prods = getProductos();
      setProductos(prods);
    };

    loadProductos();
    const interval = setInterval(loadProductos, 1000);

    // Escuchar eventos de eliminación
    const handleDelete = (e: CustomEvent) => {
      deleteProducto(e.detail);
      loadProductos();
    };

    window.addEventListener("deleteProduct" as any, handleDelete as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener("deleteProduct" as any, handleDelete as EventListener);
    };
  }, []);

  useEffect(() => {
    let filtered = [...productos];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => p.categoria === filterCategory);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "nombre":
          return a.nombre.localeCompare(b.nombre);
        case "cantidad":
          return a.cantidad - b.cantidad;
        case "vencimiento":
          return (
            new Date(a.fechaVencimiento).getTime() -
            new Date(b.fechaVencimiento).getTime()
          );
        case "categoria":
          return a.categoria.localeCompare(b.categoria);
        default:
          return 0;
      }
    });

    setFilteredProductos(filtered);
  }, [productos, searchTerm, filterCategory, sortBy]);

  const categorias = Array.from(
    new Set(productos.map((p) => p.categoria))
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventario Completo</h1>
          <Link
            href="/agregar"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            + Agregar Producto
          </Link>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre, categoría, proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Categoría
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="nombre">Nombre</option>
                <option value="cantidad">Cantidad</option>
                <option value="vencimiento">Fecha de Vencimiento</option>
                <option value="categoria">Categoría</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4 text-sm text-gray-600">
          Mostrando {filteredProductos.length} de {productos.length} productos
        </div>

        {/* Grid de Productos */}
        {filteredProductos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProductos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              {productos.length === 0
                ? "No hay productos en el inventario"
                : "No se encontraron productos con los filtros seleccionados"}
            </p>
            {productos.length === 0 && (
              <Link
                href="/agregar"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Agregar Primer Producto
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

