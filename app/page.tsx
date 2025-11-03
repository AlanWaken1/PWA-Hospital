"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Producto } from "@/types/inventario";
import { getProductos } from "@/lib/storage";
import Link from "next/link";

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    stockBajo: 0,
    porVencer: 0,
    vencidos: 0,
    valorTotal: 0,
  });

  useEffect(() => {
    const loadProductos = () => {
      const prods = getProductos();
      setProductos(prods);

      const hoy = new Date();
      let stockBajo = 0;
      let porVencer = 0;
      let vencidos = 0;
      let valorTotal = 0;

      prods.forEach((prod) => {
        valorTotal += prod.cantidad * prod.precioUnitario;

        if (prod.cantidad <= prod.cantidadMinima) {
          stockBajo++;
        }

        const fechaVenc = new Date(prod.fechaVencimiento);
        const diasRestantes = Math.ceil(
          (fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diasRestantes < 0) {
          vencidos++;
        } else if (diasRestantes <= 30) {
          porVencer++;
        }
      });

      setStats({
        total: prods.length,
        stockBajo,
        porVencer,
        vencidos,
        valorTotal,
      });
    };

    loadProductos();
    const interval = setInterval(loadProductos, 1000);
    return () => clearInterval(interval);
  }, []);

  const productosRecientes = productos
    .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime())
    .slice(0, 5);

  const productosUrgentes = productos.filter((prod) => {
    const fechaVenc = new Date(prod.fechaVencimiento);
    const hoy = new Date();
    const diasRestantes = Math.ceil(
      (fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );
    return (
      prod.cantidad <= prod.cantidadMinima ||
      diasRestantes <= 30 ||
      diasRestantes < 0
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard de Inventario
        </h1>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Productos</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
          </div>

          <div className="bg-red-50 rounded-lg shadow p-6 border border-red-200">
            <div className="text-sm font-medium text-red-600">Stock Bajo</div>
            <div className="text-3xl font-bold text-red-700 mt-2">{stats.stockBajo}</div>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow p-6 border border-yellow-200">
            <div className="text-sm font-medium text-yellow-600">Por Vencer</div>
            <div className="text-3xl font-bold text-yellow-700 mt-2">{stats.porVencer}</div>
          </div>

          <div className="bg-orange-50 rounded-lg shadow p-6 border border-orange-200">
            <div className="text-sm font-medium text-orange-600">Vencidos</div>
            <div className="text-3xl font-bold text-orange-700 mt-2">{stats.vencidos}</div>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
            <div className="text-sm font-medium text-green-600">Valor Total</div>
            <div className="text-3xl font-bold text-green-700 mt-2">
              ${stats.valorTotal.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/agregar"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              + Agregar Producto
            </Link>
            <Link
              href="/inventario"
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              Ver Inventario Completo
            </Link>
          </div>
        </div>

        {/* Productos Urgentes */}
        {productosUrgentes.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ⚠️ Productos que Requieren Atención
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Problema
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productosUrgentes.slice(0, 10).map((prod) => {
                    const fechaVenc = new Date(prod.fechaVencimiento);
                    const hoy = new Date();
                    const diasRestantes = Math.ceil(
                      (fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const estaVencido = diasRestantes < 0;
                    const estaPorVencer = diasRestantes >= 0 && diasRestantes <= 30;
                    const stockBajo = prod.cantidad <= prod.cantidadMinima;

                    let problema = "";
                    if (estaVencido) problema = "❌ Vencido";
                    else if (estaPorVencer) problema = `⚠️ Vence en ${diasRestantes} días`;
                    if (stockBajo) problema += (problema ? " | " : "") + "📉 Stock bajo";

                    return (
                      <tr key={prod.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {prod.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {prod.categoria}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {prod.cantidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fechaVenc.toLocaleDateString("es-ES")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          {problema}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Productos Recientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Productos Agregados Recientemente
          </h2>
          {productosRecientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Ingreso
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productosRecientes.map((prod) => (
                    <tr key={prod.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prod.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prod.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prod.cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(prod.fechaIngreso).toLocaleDateString("es-ES")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay productos registrados.{" "}
              <Link href="/agregar" className="text-blue-600 hover:underline">
                Agrega el primero
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

