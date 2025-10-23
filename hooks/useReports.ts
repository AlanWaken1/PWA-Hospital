// hooks/useReports.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ReportStats {
    entradasMes: number;
    entradasMesAnterior: number;
    salidasMes: number;
    salidasMesAnterior: number;
    valorMovido: number;
    valorMovidoMesAnterior: number;
    reportesGenerados: number;
}

export interface MovimientoReporte {
    id: string;
    tipo_movimiento: string;
    cantidad: number;
    created_at: string;
    producto: {
        codigo: string;
        nombre: string;
        unidad_medida: string;
    };
    ubicacion_origen?: {
        nombre: string;
    };
    ubicacion_destino?: {
        nombre: string;
    };
    usuario?: {
        nombre_completo: string;
    };
    costo_unitario?: number;
    notas?: string;
}

export function useReports() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const getStats = async (): Promise<ReportStats> => {
        try {
            const now = new Date();
            const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
            const inicioMesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const finMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

            // Entradas del mes actual
            const { data: entradasMesData } = await supabase
                .from('movimientos')
                .select('cantidad, costo_unitario')
                .eq('tipo_movimiento', 'entrada')
                .gte('created_at', inicioMes.toISOString());

            // Entradas del mes anterior
            const { data: entradasMesAnteriorData } = await supabase
                .from('movimientos')
                .select('cantidad')
                .eq('tipo_movimiento', 'entrada')
                .gte('created_at', inicioMesAnterior.toISOString())
                .lte('created_at', finMesAnterior.toISOString());

            // Salidas del mes actual
            const { data: salidasMesData } = await supabase
                .from('movimientos')
                .select('cantidad, costo_unitario')
                .eq('tipo_movimiento', 'salida')
                .gte('created_at', inicioMes.toISOString());

            // Salidas del mes anterior
            const { data: salidasMesAnteriorData } = await supabase
                .from('movimientos')
                .select('cantidad')
                .eq('tipo_movimiento', 'salida')
                .gte('created_at', inicioMesAnterior.toISOString())
                .lte('created_at', finMesAnterior.toISOString());

            const entradasMes = entradasMesData?.reduce((sum, m) => sum + m.cantidad, 0) || 0;
            const entradasMesAnterior = entradasMesAnteriorData?.reduce((sum, m) => sum + m.cantidad, 0) || 0;
            const salidasMes = salidasMesData?.reduce((sum, m) => sum + m.cantidad, 0) || 0;
            const salidasMesAnterior = salidasMesAnteriorData?.reduce((sum, m) => sum + m.cantidad, 0) || 0;

            // Calcular valor movido (entradas + salidas con costo)
            const valorMovido = [
                ...(entradasMesData || []),
                ...(salidasMesData || [])
            ].reduce((sum, m) => {
                return sum + (m.cantidad * (m.costo_unitario || 0));
            }, 0);

            const stats: ReportStats = {
                entradasMes,
                entradasMesAnterior,
                salidasMes,
                salidasMesAnterior,
                valorMovido,
                valorMovidoMesAnterior: 0, // Puedes calcularlo igual
                reportesGenerados: 0, // Esto puede ser un contador en otra tabla
            };

            return stats;
        } catch (err: any) {
            console.error('Error getting stats:', err);
            return {
                entradasMes: 0,
                entradasMesAnterior: 0,
                salidasMes: 0,
                salidasMesAnterior: 0,
                valorMovido: 0,
                valorMovidoMesAnterior: 0,
                reportesGenerados: 0,
            };
        }
    };

    const getMovimientos = async (
        fechaInicio?: string,
        fechaFin?: string,
        tipo?: 'entrada' | 'salida'
    ): Promise<MovimientoReporte[]> => {
        try {
            let query = supabase
                .from('movimientos')
                .select(`
          *,
          producto:productos(codigo, nombre, unidad_medida),
          ubicacion_origen:ubicacion_origen_id(nombre),
          ubicacion_destino:ubicacion_destino_id(nombre),
          usuario:usuario_id(nombre_completo)
        `)
                .order('created_at', { ascending: false });

            if (fechaInicio) {
                query = query.gte('created_at', fechaInicio);
            }
            if (fechaFin) {
                query = query.lte('created_at', fechaFin);
            }
            if (tipo) {
                query = query.eq('tipo_movimiento', tipo);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data || [];
        } catch (err: any) {
            console.error('Error getting movimientos:', err);
            return [];
        }
    };

    const exportarInventarioExcel = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener stock total
            const { data: stockData, error: stockError } = await supabase
                .from('vista_stock_total')
                .select('*')
                .order('nombre');

            if (stockError) throw stockError;

            if (!stockData || stockData.length === 0) {
                throw new Error('No hay datos para exportar');
            }

            // Crear CSV
            const headers = [
                'Código',
                'Producto',
                'Categoría',
                'Unidad',
                'Stock Actual',
                'Stock Mínimo',
                'Stock Máximo',
                'Punto Reorden',
                'Estado'
            ];

            const rows = stockData.map(item => [
                item.codigo,
                item.nombre,
                item.categoria,
                item.unidad_medida,
                item.cantidad_total || 0,
                item.stock_minimo,
                item.stock_maximo,
                item.punto_reorden,
                item.estado_stock
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            // Descargar
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setLoading(false);
            return { error: null };
        } catch (err: any) {
            setLoading(false);
            setError(err.message);
            return { error: err.message };
        }
    };

    const exportarMovimientosExcel = async (
        fechaInicio?: string,
        fechaFin?: string
    ) => {
        try {
            setLoading(true);
            setError(null);

            const movimientos = await getMovimientos(fechaInicio, fechaFin);

            if (movimientos.length === 0) {
                throw new Error('No hay movimientos en el período seleccionado');
            }

            // Crear CSV
            const headers = [
                'Fecha',
                'Tipo',
                'Producto',
                'Cantidad',
                'Origen',
                'Destino',
                'Usuario',
                'Costo Unitario',
                'Total',
                'Notas'
            ];

            const rows = movimientos.map(mov => [
                new Date(mov.created_at).toLocaleString('es-MX'),
                mov.tipo_movimiento,
                `${mov.producto?.codigo} - ${mov.producto?.nombre}`,
                mov.cantidad,
                mov.ubicacion_origen?.nombre || '-',
                mov.ubicacion_destino?.nombre || '-',
                mov.usuario?.nombre_completo || '-',
                mov.costo_unitario || 0,
                (mov.cantidad * (mov.costo_unitario || 0)).toFixed(2),
                mov.notas || '-'
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            // Descargar
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `movimientos_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setLoading(false);
            return { error: null };
        } catch (err: any) {
            setLoading(false);
            setError(err.message);
            return { error: err.message };
        }
    };

    const exportarProductosPorVencer = async (dias: number = 30) => {
        try {
            setLoading(true);
            setError(null);

            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() + dias);

            const { data, error: queryError } = await supabase
                .from('inventario')
                .select(`
          *,
          producto:productos(codigo, nombre),
          ubicacion:ubicaciones(nombre)
        `)
                .not('fecha_caducidad', 'is', null)
                .lte('fecha_caducidad', fechaLimite.toISOString().split('T')[0])
                .gte('fecha_caducidad', new Date().toISOString().split('T')[0])
                .eq('esta_activo', true)
                .order('fecha_caducidad');

            if (queryError) throw queryError;

            if (!data || data.length === 0) {
                throw new Error('No hay productos próximos a vencer');
            }

            // Crear CSV
            const headers = [
                'Producto',
                'Código',
                'Lote',
                'Ubicación',
                'Cantidad',
                'Fecha Caducidad',
                'Días Restantes'
            ];

            const rows = data.map(item => {
                const diasRestantes = Math.ceil(
                    (new Date(item.fecha_caducidad).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );

                return [
                    item.producto?.nombre || '-',
                    item.producto?.codigo || '-',
                    item.lote || '-',
                    item.ubicacion?.nombre || '-',
                    item.cantidad_disponible,
                    item.fecha_caducidad,
                    diasRestantes
                ];
            });

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            // Descargar
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `productos_por_vencer_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setLoading(false);
            return { error: null };
        } catch (err: any) {
            setLoading(false);
            setError(err.message);
            return { error: err.message };
        }
    };

    return {
        loading,
        error,
        getStats,
        getMovimientos,
        exportarInventarioExcel,
        exportarMovimientosExcel,
        exportarProductosPorVencer,
    };
}