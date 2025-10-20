"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Plus, Filter, Download, Search, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function Inventario() {
  const titleRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const inventoryItems = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Medicamentos', stock: 450, min: 200, max: 1000, status: 'normal', lot: 'LOT-2024-001', expiry: '2025-12-15' },
    { id: 2, name: 'Jeringas desechables 5ml', category: 'Insumos', stock: 12, min: 50, max: 500, status: 'critico', lot: 'LOT-2024-045', expiry: '2026-06-20' },
    { id: 3, name: 'Guantes quirúrgicos', category: 'Quirúrgico', stock: 850, min: 300, max: 1500, status: 'normal', lot: 'LOT-2024-102', expiry: '2027-03-10' },
    { id: 4, name: 'Mascarillas N95', category: 'Equipos', stock: 45, min: 100, max: 500, status: 'bajo', lot: 'LOT-2024-078', expiry: '2025-09-30' },
    { id: 5, name: 'Alcohol en gel 500ml', category: 'Insumos', stock: 230, min: 150, max: 600, status: 'normal', lot: 'LOT-2024-156', expiry: '2026-01-25' },
    { id: 6, name: 'Termómetros digitales', category: 'Equipos', stock: 8, min: 20, max: 100, status: 'bajo', lot: 'LOT-2024-189', expiry: '2028-11-05' },
    { id: 7, name: 'Vendas elásticas 10cm', category: 'Insumos', stock: 320, min: 100, max: 800, status: 'normal', lot: 'LOT-2024-234', expiry: '2027-07-18' },
    { id: 8, name: 'Ibuprofeno 400mg', category: 'Medicamentos', stock: 590, min: 250, max: 1200, status: 'normal', lot: 'LOT-2024-267', expiry: '2025-10-12' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      });

      gsap.from(tableRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critico':
        return <Badge className="bg-red-100 text-red-600 hover:bg-red-100"><AlertCircle size={12} className="mr-1" />Crítico</Badge>;
      case 'bajo':
        return <Badge className="bg-yellow-100 text-yellow-600 hover:bg-yellow-100"><AlertCircle size={12} className="mr-1" />Bajo</Badge>;
      default:
        return <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100"><CheckCircle size={12} className="mr-1" />Normal</Badge>;
    }
  };

  return (
    <>
      {/* Page Title */}
      <div ref={titleRef} className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100 mb-2">Inventario General</h1>
        <p className="text-gray-500 dark:text-gray-400">Gestiona y controla todos los productos del hospital.</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6 transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="medicamentos">Medicamentos</SelectItem>
                <SelectItem value="insumos">Insumos</SelectItem>
                <SelectItem value="equipos">Equipos</SelectItem>
                <SelectItem value="quirurgico">Quirúrgico</SelectItem>
              </SelectContent>
            </Select>
            <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors">
              <Filter size={18} />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center gap-3">
            <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors">
              <Download size={18} />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nuevo Producto</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div ref={tableRef} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Stock Actual</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Lote</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Vencimiento</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {inventoryItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { x: 2, duration: 0.2 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { x: 0, duration: 0.2 })}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <Package className="text-emerald-600 dark:text-emerald-400" size={20} />
                      </div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">{item.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.category}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{item.stock} uds</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Min: {item.min} | Max: {item.max}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.lot}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.expiry}</td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4">
                    <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm transition-colors">Ver detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
