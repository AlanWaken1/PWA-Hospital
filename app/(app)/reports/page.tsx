// app/(app)/reports/page.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Download, TrendingUp, TrendingDown, Calendar, FileText, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReports, ReportStats } from '@/hooks/useReports';

export default function Reportes() {
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const { loading, getStats, exportarInventarioExcel, exportarMovimientosExcel, exportarProductosPorVencer } = useReports();
    const [stats, setStats] = useState<ReportStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [exportando, setExportando] = useState(false);

    // Formulario
    const [tipoReporte, setTipoReporte] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [formato, setFormato] = useState('excel');

    useEffect(() => {
        const loadStats = async () => {
            setLoadingStats(true);
            const data = await getStats();
            setStats(data);
            setLoadingStats(false);
        };
        loadStats();
    }, []);

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

    const calcularPorcentaje = (actual: number, anterior: number): string => {
        if (anterior === 0) return actual > 0 ? '+100' : '0';
        const cambio = ((actual - anterior) / anterior) * 100;
        return cambio >= 0 ? `+${cambio.toFixed(1)}` : cambio.toFixed(1);
    };

    const handleGenerar = async () => {
        if (!tipoReporte) {
            alert('Selecciona un tipo de reporte');
            return;
        }

        setExportando(true);

        try {
            let result;

            switch (tipoReporte) {
                case 'inventario':
                    result = await exportarInventarioExcel();
                    break;
                case 'movimientos':
                    const fechaInicio = getFechaInicio(periodo);
                    const fechaFin = new Date().toISOString();
                    result = await exportarMovimientosExcel(fechaInicio, fechaFin);
                    break;
                case 'vencimientos':
                    result = await exportarProductosPorVencer(30);
                    break;
                case 'valorizacion':
                    result = await exportarInventarioExcel();
                    break;
                case 'consumo':
                    const inicio = getFechaInicio(periodo);
                    const fin = new Date().toISOString();
                    result = await exportarMovimientosExcel(inicio, fin);
                    break;
                default:
                    alert('Tipo de reporte no implementado');
                    setExportando(false);
                    return;
            }

            if (result?.error) {
                alert(`Error: ${result.error}`);
            } else {
                alert('Reporte descargado exitosamente');
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }

        setExportando(false);
    };

    const getFechaInicio = (periodo: string): string => {
        const now = new Date();
        switch (periodo) {
            case 'semana':
                const semana = new Date(now);
                semana.setDate(now.getDate() - 7);
                return semana.toISOString();
            case 'mes':
                const mes = new Date(now.getFullYear(), now.getMonth(), 1);
                return mes.toISOString();
            case 'trimestre':
                const trimestre = new Date(now);
                trimestre.setMonth(now.getMonth() - 3);
                return trimestre.toISOString();
            case 'ano':
                const ano = new Date(now.getFullYear(), 0, 1);
                return ano.toISOString();
            default:
                return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        }
    };

    return (
        <>
            {/* Page Title */}
            <div ref={titleRef} className="mb-6">
                <h1 className="text-gray-900 dark:text-gray-100 mb-2">Reportes y Análisis</h1>
                <p className="text-gray-500 dark:text-gray-400">Genera y descarga reportes detallados del inventario.</p>
            </div>

            {/* Stats Overview */}
            {loadingStats ? (
                <div className="flex items-center justify-center py-12 mb-6">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                </div>
            ) : stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm text-gray-600 dark:text-gray-400">Entradas del Mes</h4>
                            <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                        </div>
                        <div className="text-3xl text-gray-900 dark:text-gray-100 mb-1">
                            {stats.entradasMes.toLocaleString()}
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${
                            stats.entradasMes >= stats.entradasMesAnterior
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                        }`}>
                            <TrendingUp size={14} />
                            <span>{calcularPorcentaje(stats.entradasMes, stats.entradasMesAnterior)}%</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm text-gray-600 dark:text-gray-400">Salidas del Mes</h4>
                            <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
                        </div>
                        <div className="text-3xl text-gray-900 dark:text-gray-100 mb-1">
                            {stats.salidasMes.toLocaleString()}
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${
                            stats.salidasMes <= stats.salidasMesAnterior
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                        }`}>
                            <TrendingDown size={14} />
                            <span>{calcularPorcentaje(stats.salidasMes, stats.salidasMesAnterior)}%</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm text-gray-600 dark:text-gray-400">Valor Movido</h4>
                            <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <div className="text-3xl text-gray-900 dark:text-gray-100 mb-1">
                            ${(stats.valorMovido / 1000).toFixed(1)}K
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
                            <TrendingUp size={14} />
                            <span>Este mes</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-2xl p-6 text-white shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm text-emerald-100">Productos Activos</h4>
                            <FileText className="text-white" size={20} />
                        </div>
                        <div className="text-3xl text-white mb-1">{stats.entradasMes + stats.salidasMes}</div>
                        <div className="text-emerald-200 text-sm">Movimientos totales</div>
                    </div>
                </div>
            )}

            {/* Generate Report Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6 transition-colors">
                <h3 className="text-gray-900 dark:text-gray-100 mb-4">Generar Nuevo Reporte</h3>
                <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Tipo de Reporte</label>
                        <Select value={tipoReporte} onValueChange={setTipoReporte}>
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
                        <Select value={periodo} onValueChange={setPeriodo}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="semana">Última semana</SelectItem>
                                <SelectItem value="mes">Último mes</SelectItem>
                                <SelectItem value="trimestre">Último trimestre</SelectItem>
                                <SelectItem value="ano">Último año</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Formato</label>
                        <Select value={formato} onValueChange={setFormato}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar formato" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="excel">Excel (CSV)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <button
                        onClick={handleGenerar}
                        disabled={exportando || !tipoReporte}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {exportando ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Generando...
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                Generar
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div
                    ref={(el) => {cardsRef.current[0] = el;}}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="text-emerald-600 dark:text-emerald-400" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 dark:text-gray-100 mb-1">Inventario General</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Listado completo de todos los productos con su stock actual
                            </p>
                            <button
                                onClick={() => {
                                    setTipoReporte('inventario');
                                    setPeriodo('mes');
                                    handleGenerar();
                                }}
                                disabled={exportando}
                                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Download size={14} />
                                <span>Descargar ahora</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={(el) => {cardsRef.current[1] = el;}}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 dark:text-gray-100 mb-1">Movimientos del Mes</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Todas las entradas y salidas del mes actual
                            </p>
                            <button
                                onClick={() => {
                                    setTipoReporte('movimientos');
                                    setPeriodo('mes');
                                    handleGenerar();
                                }}
                                disabled={exportando}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Download size={14} />
                                <span>Descargar ahora</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={(el) => {cardsRef.current[2] = el;}}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="text-yellow-600 dark:text-yellow-400" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 dark:text-gray-100 mb-1">Productos Por Vencer</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Productos que vencen en los próximos 30 días
                            </p>
                            <button
                                onClick={() => {
                                    setTipoReporte('vencimientos');
                                    handleGenerar();
                                }}
                                disabled={exportando}
                                className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Download size={14} />
                                <span>Descargar ahora</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={(el) => {cardsRef.current[3] = el;}}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 dark:text-gray-100 mb-1">Análisis de Consumo</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Productos más utilizados y tendencias de consumo
                            </p>
                            <button
                                onClick={() => {
                                    setTipoReporte('consumo');
                                    setPeriodo('mes');
                                    handleGenerar();
                                }}
                                disabled={exportando}
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Download size={14} />
                                <span>Descargar ahora</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}