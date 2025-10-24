// hooks/useAdvancedReports.ts
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface ReportConfig {
    tipo: 'inventario' | 'movimientos' | 'vencimientos' | 'valorizacion' | 'consumo';
    formato: 'pdf' | 'excel' | 'json';
    fechaInicio?: Date;
    fechaFin?: Date;
    columnas?: string[];
    filtros?: {
        categorias?: string[];
        estados?: string[];
        ubicaciones?: string[];
    };
}

export interface ReportHistoryItem {
    id: string;
    nombre: string;
    tipo: string;
    formato: string;
    fecha: Date;
    config: ReportConfig;
    preview?: any[];
}

export function useAdvancedReports() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [historial, setHistorial] = useState<ReportHistoryItem[]>([]);

    // ============================================
    // OBTENER DATOS PARA PREVIEW
    // ============================================
    const fetchReportData = async (config: ReportConfig) => {
        setLoading(true);
        try {
            let data: any[] = [];

            switch (config.tipo) {
                case 'inventario':
                    data = await fetchInventarioData(config);
                    break;
                case 'movimientos':
                    data = await fetchMovimientosData(config);
                    break;
                case 'vencimientos':
                    data = await fetchVencimientosData(config);
                    break;
                case 'valorizacion':
                    data = await fetchValorizacionData(config);
                    break;
                case 'consumo':
                    data = await fetchConsumoData(config);
                    break;
            }

            setPreviewData(data);
            return data;
        } catch (error: any) {
            console.error('Error fetching report data:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // FETCH ESPECÍFICOS POR TIPO
    // ============================================
    const fetchInventarioData = async (config: ReportConfig) => {
        let query = supabase
            .from('vista_stock_total')
            .select('*');

        // Aplicar filtros
        if (config.filtros?.categorias && config.filtros.categorias.length > 0) {
            query = query.in('categoria', config.filtros.categorias);
        }
        if (config.filtros?.estados && config.filtros.estados.length > 0) {
            query = query.in('estado_stock', config.filtros.estados);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    };

    const fetchMovimientosData = async (config: ReportConfig) => {
        let query = supabase
            .from('movimientos')
            .select(`
        *,
        producto:productos(codigo, nombre, categoria_id),
        ubicacion_origen:ubicacion_origen_id(nombre),
        ubicacion_destino:ubicacion_destino_id(nombre),
        usuario:usuario_id(nombre_completo)
      `)
            .order('created_at', { ascending: false });

        if (config.fechaInicio) {
            query = query.gte('created_at', config.fechaInicio.toISOString());
        }
        if (config.fechaFin) {
            query = query.lte('created_at', config.fechaFin.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    };

    const fetchVencimientosData = async (config: ReportConfig) => {
        const { data, error } = await supabase
            .from('inventario')
            .select(`
        *,
        producto:productos(codigo, nombre, categoria_id),
        ubicacion:ubicacion_id(nombre)
      `)
            .not('fecha_caducidad', 'is', null)
            .lte('fecha_caducidad', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString())
            .gt('cantidad_disponible', 0)
            .order('fecha_caducidad', { ascending: true });

        if (error) throw error;
        return data || [];
    };

    const fetchValorizacionData = async (config: ReportConfig) => {
        const { data, error } = await supabase
            .from('inventario')
            .select(`
        *,
        producto:productos(codigo, nombre, categoria_id, costo_promedio)
      `)
            .gt('cantidad_disponible', 0);

        if (error) throw error;

        return (data || []).map(item => ({
            ...item,
            valor_total: (item.cantidad_disponible || 0) * (item.producto?.costo_promedio || 0)
        }));
    };

    const fetchConsumoData = async (config: ReportConfig) => {
        let query = supabase
            .from('movimientos')
            .select(`
        *,
        producto:productos(codigo, nombre, categoria_id)
      `)
            .eq('tipo_movimiento', 'salida')
            .order('created_at', { ascending: false });

        if (config.fechaInicio) {
            query = query.gte('created_at', config.fechaInicio.toISOString());
        }
        if (config.fechaFin) {
            query = query.lte('created_at', config.fechaFin.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    };

    // ============================================
    // EXPORTAR A PDF
    // ============================================
    const exportToPDF = (data: any[], config: ReportConfig, nombre: string) => {
        const doc = new jsPDF();

        // Header con logo/título
        doc.setFontSize(20);
        doc.setTextColor(16, 185, 129); // Color emerald
        doc.text('MediStock', 14, 20);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Reporte de ${getTipoReporteLabel(config.tipo)}`, 14, 30);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`, 14, 38);

        if (config.fechaInicio && config.fechaFin) {
            doc.text(
                `Período: ${format(config.fechaInicio, 'dd/MM/yyyy')} - ${format(config.fechaFin, 'dd/MM/yyyy')}`,
                14,
                44
            );
        }

        // Preparar datos para la tabla
        const { columns, rows } = prepareTableData(data, config);

        // Generar tabla
        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: config.fechaInicio && config.fechaFin ? 50 : 45,
            theme: 'grid',
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold',
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251],
            },
        });

        // Footer con número de página
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Página ${i} de ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save(nombre);
    };

    // ============================================
    // EXPORTAR A EXCEL
    // ============================================
    const exportToExcel = (data: any[], config: ReportConfig, nombre: string) => {
        const { columns, rows } = prepareTableData(data, config);

        // Crear workbook
        const wb = XLSX.utils.book_new();

        // Crear worksheet con headers
        const wsData = [columns, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Aplicar estilos a headers (ancho de columnas)
        const wscols = columns.map(() => ({ wch: 15 }));
        ws['!cols'] = wscols;

        // Agregar worksheet al workbook
        XLSX.utils.book_append_sheet(wb, ws, getTipoReporteLabel(config.tipo));

        // Guardar archivo
        XLSX.writeFile(wb, nombre);
    };

    // ============================================
    // EXPORTAR A JSON
    // ============================================
    const exportToJSON = (data: any[], nombre: string) => {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nombre;
        link.click();
        URL.revokeObjectURL(url);
    };

    // ============================================
    // PREPARAR DATOS PARA TABLA
    // ============================================
    const prepareTableData = (data: any[], config: ReportConfig) => {
        let columns: string[] = [];
        let rows: any[][] = [];

        switch (config.tipo) {
            case 'inventario':
                columns = ['Código', 'Producto', 'Categoría', 'Stock', 'Mín', 'Reorden', 'Estado'];
                rows = data.map(item => [
                    item.codigo || '-',
                    item.nombre || '-',
                    item.categoria || '-',
                    item.cantidad_total || 0,
                    item.stock_minimo || 0,
                    item.punto_reorden || 0,
                    item.estado_stock || '-',
                ]);
                break;

            case 'movimientos':
                columns = ['Fecha', 'Tipo', 'Producto', 'Cantidad', 'Origen', 'Destino', 'Usuario'];
                rows = data.map(item => [
                    format(new Date(item.created_at), 'dd/MM/yyyy HH:mm'),
                    item.tipo_movimiento || '-',
                    item.producto?.nombre || '-',
                    item.cantidad || 0,
                    item.ubicacion_origen?.nombre || '-',
                    item.ubicacion_destino?.nombre || '-',
                    item.usuario?.nombre_completo || '-',
                ]);
                break;

            case 'vencimientos':
                columns = ['Producto', 'Lote', 'Ubicación', 'Cantidad', 'Vencimiento', 'Días Rest.'];
                rows = data.map(item => {
                    const diasRestantes = Math.ceil(
                        (new Date(item.fecha_caducidad).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    return [
                        item.producto?.nombre || '-',
                        item.lote || '-',
                        item.ubicacion?.nombre || '-',
                        item.cantidad_disponible || 0,
                        format(new Date(item.fecha_caducidad), 'dd/MM/yyyy'),
                        diasRestantes,
                    ];
                });
                break;

            case 'valorizacion':
                columns = ['Producto', 'Cantidad', 'Costo Unit.', 'Valor Total'];
                rows = data.map(item => [
                    item.producto?.nombre || '-',
                    item.cantidad_disponible || 0,
                    `$${(item.producto?.costo_promedio || 0).toFixed(2)}`,
                    `$${(item.valor_total || 0).toFixed(2)}`,
                ]);
                break;

            case 'consumo':
                columns = ['Fecha', 'Producto', 'Cantidad', 'Destino'];
                rows = data.map(item => [
                    format(new Date(item.created_at), 'dd/MM/yyyy'),
                    item.producto?.nombre || '-',
                    item.cantidad || 0,
                    item.ubicacion_destino?.nombre || '-',
                ]);
                break;
        }

        // Filtrar columnas si se especificaron
        if (config.columnas && config.columnas.length > 0) {
            const indices = config.columnas.map(col => columns.indexOf(col)).filter(i => i >= 0);
            columns = indices.map(i => columns[i]);
            rows = rows.map(row => indices.map(i => row[i]));
        }

        return { columns, rows };
    };

    // ============================================
    // GENERAR REPORTE COMPLETO
    // ============================================
    const generateReport = async (config: ReportConfig) => {
        const data = await fetchReportData(config);

        const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
        const fileName = `${config.tipo}_${timestamp}.${config.formato === 'excel' ? 'xlsx' : config.formato}`;

        switch (config.formato) {
            case 'pdf':
                exportToPDF(data, config, fileName);
                break;
            case 'excel':
                exportToExcel(data, config, fileName);
                break;
            case 'json':
                exportToJSON(data, fileName);
                break;
        }

        // Guardar en historial
        saveToHistory({
            id: `${Date.now()}`,
            nombre: fileName,
            tipo: config.tipo,
            formato: config.formato,
            fecha: new Date(),
            config,
            preview: data.slice(0, 5), // Guardar preview de 5 registros
        });

        return { success: true, fileName, recordCount: data.length };
    };

    // ============================================
    // HISTORIAL
    // ============================================
    const saveToHistory = (item: ReportHistoryItem) => {
        const history = getHistory();
        const updated = [item, ...history].slice(0, 20); // Mantener últimos 20
        localStorage.setItem('medistock_report_history', JSON.stringify(updated));
        setHistorial(updated);
    };

    const getHistory = (): ReportHistoryItem[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('medistock_report_history');
        return stored ? JSON.parse(stored) : [];
    };

    const clearHistory = () => {
        localStorage.removeItem('medistock_report_history');
        setHistorial([]);
    };

    // ============================================
    // HELPERS
    // ============================================
    const getTipoReporteLabel = (tipo: string): string => {
        const labels: Record<string, string> = {
            inventario: 'Inventario General',
            movimientos: 'Movimientos',
            vencimientos: 'Productos por Vencer',
            valorizacion: 'Valorización',
            consumo: 'Análisis de Consumo',
        };
        return labels[tipo] || tipo;
    };

    return {
        loading,
        previewData,
        historial,
        fetchReportData,
        generateReport,
        getHistory,
        clearHistory,
        setHistorial,
    };
}