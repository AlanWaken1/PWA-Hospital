// components/reports/ReportHistory.tsx
"use client";

import {JSX, useEffect} from 'react';
import { Clock, Download, FileText, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReportHistoryItem } from '@/hooks/useAdvancedReports';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ReportHistoryProps {
    history: ReportHistoryItem[];
    onRegenerate: (item: ReportHistoryItem) => void;
    onClear: () => void;
    onRefresh: () => void;
}

export function ReportHistory({ history, onRegenerate, onClear, onRefresh }: ReportHistoryProps) {
    useEffect(() => {
        onRefresh();
    }, []);

    if (history.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                <div className="text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Sin historial
                    </h3>
                    <p className="text-gray-500">
                        Los reportes generados aparecerán aquí
                    </p>
                </div>
            </div>
        );
    }

    const getFormatIcon = (formato: string) => {
        const icons: Record<string, JSX.Element> = {
            pdf: <FileText className="w-4 h-4 text-red-500" />,
            excel: <FileText className="w-4 h-4 text-green-600" />,
            json: <FileText className="w-4 h-4 text-blue-500" />,
        };
        return icons[formato] || <FileText className="w-4 h-4" />;
    };

    const getTipoLabel = (tipo: string): string => {
        const labels: Record<string, string> = {
            inventario: 'Inventario',
            movimientos: 'Movimientos',
            vencimientos: 'Vencimientos',
            valorizacion: 'Valorización',
            consumo: 'Consumo',
        };
        return labels[tipo] || tipo;
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Historial de Reportes
                    </h3>
                    <Badge variant="secondary" className="ml-2">
                        {history.length}
                    </Badge>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRefresh}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Limpiar historial?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminarán todos los registros del historial.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={onClear}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Limpiar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Lista de reportes */}
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">

                            {/* Info del reporte */}
                            <div className="flex items-start gap-3 flex-1">
                                <div className="mt-1">
                                    {getFormatIcon(item.formato)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {item.nombre}
                                        </h4>
                                        <Badge variant="outline" className="text-xs">
                                            {getTipoLabel(item.tipo)}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                        {format(new Date(item.fecha), "dd MMM yyyy 'a las' HH:mm", { locale: es })}
                    </span>
                                        <span className="uppercase text-xs font-medium">
                      {item.formato}
                    </span>
                                    </div>

                                    {/* Preview de datos si existen */}
                                    {item.preview && item.preview.length > 0 && (
                                        <div className="mt-2 text-xs text-gray-400">
                                            {item.preview.length} registros guardados
                                        </div>
                                    )}

                                    {/* Rango de fechas si existen */}
                                    {item.config.fechaInicio && item.config.fechaFin && (
                                        <div className="mt-1 text-xs text-gray-500">
                                            {format(new Date(item.config.fechaInicio), 'dd/MM/yyyy')} -{' '}
                                            {format(new Date(item.config.fechaFin), 'dd/MM/yyyy')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Acciones */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onRegenerate(item)}
                                className="shrink-0"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Re-generar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}