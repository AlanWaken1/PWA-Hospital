"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Download, TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Reportes() {
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const reports = [
    { id: 1, title: 'Reporte Mensual de Inventario', date: 'Octubre 2024', size: '2.4 MB', type: 'PDF', icon: FileText },
    { id: 2, title: 'Movimientos de Stock', date: 'Última semana', size: '1.8 MB', type: 'Excel', icon: FileText },
    { id: 3, title: 'Productos Vencidos', date: 'Septiembre 2024', size: '890 KB', type: 'PDF', icon: FileText },
    { id: 4, title: 'Análisis de Consumo', date: 'Q3 2024', size: '3.2 MB', type: 'PDF', icon: FileText },
    { id: 5, title: 'Valorización de Inventario', date: 'Octubre 2024', size: '1.5 MB', type: 'Excel', icon: FileText },
    { id: 6, title: 'Resumen Anual', date: '2024', size: '5.1 MB', type: 'PDF', icon: FileText },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.1 + index * 0.1, ease: 'power2.out' }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Page Title */}
      <div ref={titleRef} className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100 mb-2">Reportes y Análisis</h1>
        <p className="text-gray-500 dark:text-gray-400">Genera y descarga reportes detallados del inventario.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-gray-600 dark:text-gray-400">Entradas del Mes</h4>
            <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
          </div>
          <div className="text-3xl text-gray-900 dark:text-gray-100 mb-1">1,245</div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
            <TrendingUp size={14} />
            <span>+12.5%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-gray-600 dark:text-gray-400">Salidas del Mes</h4>
            <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <div className="text-3xl text-gray-900 dark:text-gray-100 mb-1">856</div>
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
            <TrendingDown size={14} />
            <span>-8.3%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-gray-600 dark:text-gray-400">Valor Movido</h4>
            <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <div className="text-3xl text-gray-900 dark:text-gray-100 mb-1">$245K</div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
            <TrendingUp size={14} />
            <span>+5.2%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-2xl p-6 text-white shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-emerald-100">Reportes Generados</h4>
            <FileText className="text-white" size={20} />
          </div>
          <div className="text-3xl text-white mb-1">48</div>
          <div className="text-emerald-200 text-sm">Este mes</div>
        </div>
      </div>

      {/* Generate Report Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6 transition-colors">
        <h3 className="text-gray-900 dark:text-gray-100 mb-4">Generar Nuevo Reporte</h3>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Tipo de Reporte</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inventario">Inventario General</SelectItem>
                <SelectItem value="movimientos">Movimientos</SelectItem>
                <SelectItem value="vencimientos">Vencimientos</SelectItem>
                <SelectItem value="valorizacion">Valorización</SelectItem>
                <SelectItem value="consumo">Análisis de Consumo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Período</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Última semana</SelectItem>
                <SelectItem value="mes">Último mes</SelectItem>
                <SelectItem value="trimestre">Último trimestre</SelectItem>
                <SelectItem value="ano">Último año</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Formato</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
          >
            Generar
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div>
        <h3 className="text-gray-900 dark:text-gray-100 mb-4">Reportes Recientes</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reports.map((report, index) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                ref={(el) => {cardsRef.current[index] = el;} }
                className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -4, duration: 0.2 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="text-emerald-600 dark:text-emerald-400" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 dark:text-gray-100 mb-1">{report.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                    </div>
                    <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm flex items-center gap-2 transition-colors">
                      <Download size={14} />
                      <span>Descargar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
