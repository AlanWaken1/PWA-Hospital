// app/(app)/reports/page.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FileText, TrendingUp, Clock, Download, Sparkles } from 'lucide-react';
import { ReportConfigurator } from '@/components/reports/ReportConfigurator';
import { ReportPreview } from '@/components/reports/ReportPreview';
import { ReportHistory } from '@/components/reports/ReportHistory';
import { useAdvancedReports, ReportConfig } from '@/hooks/useAdvancedReports';
import { useToast } from '@/hooks/use-toast';
import {error} from "next/dist/build/output/log";
import {result} from "es-toolkit/compat";

export default function ReportesAvanzados() {
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const { toast } = useToast();

    const {
        loading,
        previewData,
        historial,
        fetchReportData,
        generateReport,
        getHistory,
        clearHistory,
        setHistorial,
    } = useAdvancedReports();

    const [showPreview, setShowPreview] = useState(false);
    const [currentConfig, setCurrentConfig] = useState<ReportConfig | null>(null);
    const [previewColumns, setPreviewColumns] = useState<string[]>([]);

    // Cargar historial al montar
    useEffect(() => {
        setHistorial(getHistory());
    }, []);

    // Animaciones GSAP
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

    // ============================================
    // HANDLERS
    // ============================================

    const handlePreview = async (config: ReportConfig) => {
        try {
            setCurrentConfig(config);
            await fetchReportData(config);

            // Determinar columnas según el tipo
            const columns = getColumnsForType(config.tipo);
            setPreviewColumns(columns);
            setShowPreview(true);

            toast({
                id: "",
                title: "Vista previa lista",
                description: "Revisa los datos antes de descargar"
            });
        } catch (error: any) {
            toast({
                id: "",
                title: "Error",
                description: error.message || "No se pudo generar la vista previa",
                variant: "destructive"
            });
        }
    };

    const handleGenerate = async (config: ReportConfig) => {
        try {
            const result = await generateReport(config);

            toast({
                action: undefined, id: "", variant: undefined,
                title: "¡Reporte generado!",
                description: `${result.recordCount} registros exportados exitosamente`
            });

            // Actualizar historial
            setHistorial(getHistory());
        } catch (error: any) {
            toast({
                id: "",
                title: "Error",
                description: error.message || "No se pudo generar el reporte",
                variant: "destructive"
            });
        }
    };

    const handleDownloadFromPreview = async () => {
        if (!currentConfig) return;

        setShowPreview(false);
        await handleGenerate(currentConfig);
    };

    const handleRegenerate = async (item: any) => {
        try {
            await generateReport(item.config);

            toast({
                id: "",
                title: "Reporte regenerado",
                description: "El reporte se ha descargado nuevamente"
            });
        } catch (error: any) {
            toast({
                id: "",
                title: "Error",
                description: error.message || "No se pudo regenerar el reporte",
                variant: "destructive"
            });
        }
    };

    const handleClearHistory = () => {
        clearHistory();
        toast({
            id: "",
            title: "Historial limpiado",
            description: "Se eliminaron todos los registros"
        });
    };

    // ============================================
    // HELPERS
    // ============================================

    const getColumnsForType = (tipo: string): string[] => {
        const columns: Record<string, string[]> = {
            inventario: ['codigo', 'nombre', 'categoria', 'cantidad_total', 'stock_minimo', 'punto_reorden', 'estado_stock'],
            movimientos: ['created_at', 'tipo_movimiento', 'producto', 'cantidad', 'ubicacion_origen', 'ubicacion_destino', 'usuario'],
            vencimientos: ['producto', 'lote', 'ubicacion', 'cantidad_disponible', 'fecha_caducidad', 'dias_restantes'],
            valorizacion: ['producto', 'cantidad_disponible', 'costo_promedio', 'valor_total'],
            consumo: ['created_at', 'producto', 'cantidad', 'ubicacion_destino'],
        };
        return columns[tipo] || [];
    };

    return (
        <>
            {/* Page Title */}
            <div ref={titleRef} className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-theme-primary-light to-theme-primary flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-gray-900 dark:text-gray-100">Reportes Avanzados</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Genera reportes personalizados con vista previa y múltiples formatos
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div
                    ref={(el) => {cardsRef.current[0] = el;}}
                    className="bg-gradient-to-br from-theme-primary-light to-theme-primary rounded-xl p-6 text-white"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Sparkles className="w-8 h-8" />
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Nuevo
            </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">
                        {historial.length}
                    </h3>
                    <p className="text-theme-primary-light">Reportes Generados</p>
                </div>

                <div
                    ref={(el) => {cardsRef.current[1] = el;}}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {previewData.length}
                    </h3>
                    <p className="text-gray-500">Registros en Preview</p>
                </div>

                <div
                    ref={(el) => {cardsRef.current[2] = el;}}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        3
                    </h3>
                    <p className="text-gray-500">Formatos Disponibles</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Configurador de Reportes */}
                <div ref={(el) => {cardsRef.current[3] = el;}}>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Configurar Reporte
                        </h2>
                        <p className="text-sm text-gray-500">
                            Personaliza tu reporte con fechas, columnas y filtros
                        </p>
                    </div>
                    <ReportConfigurator
                        onGenerate={handleGenerate}
                        onPreview={handlePreview}
                        loading={loading}
                    />
                </div>

                {/* Historial de Reportes */}
                <div ref={(el) => {cardsRef.current[4] = el;} }>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Historial
                        </h2>
                        <p className="text-sm text-gray-500">
                            Reportes generados recientemente
                        </p>
                    </div>
                    <ReportHistory
                        history={historial}
                        onRegenerate={handleRegenerate}
                        onClear={handleClearHistory}
                        onRefresh={() => setHistorial(getHistory())}
                    />
                </div>
            </div>

            {/* Modal de Vista Previa */}
            {showPreview && (
                <ReportPreview
                    data={previewData}
                    columns={previewColumns}
                    onClose={() => setShowPreview(false)}
                    onDownload={handleDownloadFromPreview}
                    title={currentConfig ? getTipoLabel(currentConfig.tipo) : 'Reporte'}
                />
            )}

            {/* Feature Highlights */}
            <div ref={(el) => {cardsRef.current[5] = el;} } className="mt-8">
                <div className="bg-gradient-to-r from-theme-primary/10 to-blue-50 dark:from-theme-primary-dark/20 dark:to-blue-900/20 rounded-xl p-8 border border-theme-primary/30 dark:border-emerald-800">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        ✨ Características Avanzadas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FeatureCard
                            icon="👁️"
                            title="Vista Previa"
                            description="Revisa los datos antes de descargar con filtros y ordenamiento"
                        />
                        <FeatureCard
                            icon="📅"
                            title="Selector de Fechas"
                            description="Calendario visual para rangos de fechas precisos"
                        />
                        <FeatureCard
                            icon="⚙️"
                            title="Personalizable"
                            description="Elige columnas, filtros y opciones específicas"
                        />
                        <FeatureCard
                            icon="📄"
                            title="PDF Profesional"
                            description="Reportes en PDF con logo, headers y paginación"
                        />
                        <FeatureCard
                            icon="📊"
                            title="Excel Real"
                            description="Archivos .xlsx nativos, no solo CSV"
                        />
                        <FeatureCard
                            icon="💾"
                            title="Historial"
                            description="Guarda y regenera reportes anteriores"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

// Componente auxiliar para feature cards
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="flex gap-3">
            <div className="text-2xl">{icon}</div>
            <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </div>
    );
}

function getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
        inventario: 'Inventario General',
        movimientos: 'Movimientos',
        vencimientos: 'Productos por Vencer',
        valorizacion: 'Valorización',
        consumo: 'Análisis de Consumo',
    };
    return labels[tipo] || tipo;
}