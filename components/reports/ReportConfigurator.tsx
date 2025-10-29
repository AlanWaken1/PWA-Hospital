// components/reports/ReportConfigurator.tsx
"use client";

import { useState } from 'react';
import { Calendar, Filter, FileType, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReportConfig } from '@/hooks/useAdvancedReports';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface ReportConfiguratorProps {
    onGenerate: (config: ReportConfig) => void;
    onPreview: (config: ReportConfig) => void;
    loading?: boolean;
}

export function ReportConfigurator({ onGenerate, onPreview, loading }: ReportConfiguratorProps) {
    const [config, setConfig] = useState<ReportConfig>({
        tipo: 'inventario',
        formato: 'pdf',
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    // Opciones de columnas por tipo de reporte
    const columnOptions: Record<string, string[]> = {
        inventario: ['Código', 'Producto', 'Categoría', 'Stock', 'Mín', 'Reorden', 'Estado'],
        movimientos: ['Fecha', 'Tipo', 'Producto', 'Cantidad', 'Origen', 'Destino', 'Usuario'],
        vencimientos: ['Producto', 'Lote', 'Ubicación', 'Cantidad', 'Vencimiento', 'Días Rest.'],
        valorizacion: ['Producto', 'Cantidad', 'Costo Unit.', 'Valor Total'],
        consumo: ['Fecha', 'Producto', 'Cantidad', 'Destino'],
    };

    const handleUpdate = (key: keyof ReportConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleColumnToggle = (column: string) => {
        const current = config.columnas || [];
        const updated = current.includes(column)
            ? current.filter(c => c !== column)
            : [...current, column];
        handleUpdate('columnas', updated);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">

            {/* Tipo de Reporte */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <FileType className="w-4 h-4 text-theme-primary" />
                    Tipo de Reporte
                </Label>
                <Select
                    value={config.tipo}
                    onValueChange={(value: any) => handleUpdate('tipo', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="inventario">Inventario General</SelectItem>
                        <SelectItem value="movimientos">Movimientos</SelectItem>
                        <SelectItem value="vencimientos">Productos por Vencer</SelectItem>
                        <SelectItem value="valorizacion">Valorización de Inventario</SelectItem>
                        <SelectItem value="consumo">Análisis de Consumo</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Formato */}
            <div className="space-y-2">
                <Label>Formato de Exportación</Label>
                <div className="flex gap-2">
                    {['pdf', 'excel', 'json'].map(formato => (
                        <Button
                            key={formato}
                            variant={config.formato === formato ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdate('formato', formato)}
                            className={config.formato === formato ? 'bg-theme-primary hover:bg-theme-primary-dark' : ''}
                        >
                            {formato.toUpperCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Date Range */}
            {['movimientos', 'consumo'].includes(config.tipo) && (
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-theme-primary" />
                        Rango de Fechas
                    </Label>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Fecha Inicio */}
                        <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Desde</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        {config.fechaInicio ? (
                                            format(config.fechaInicio, 'dd/MM/yyyy', { locale: es })
                                        ) : (
                                            <span className="text-gray-500">Seleccionar...</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={config.fechaInicio}
                                        onSelect={(date) => handleUpdate('fechaInicio', date)}
                                        initialFocus
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Fecha Fin */}
                        <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Hasta</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        {config.fechaFin ? (
                                            format(config.fechaFin, 'dd/MM/yyyy', { locale: es })
                                        ) : (
                                            <span className="text-gray-500">Seleccionar...</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={config.fechaFin}
                                        onSelect={(date) => handleUpdate('fechaFin', date)}
                                        initialFocus
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Quick date presets */}
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const today = new Date();
                                const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                handleUpdate('fechaInicio', lastWeek);
                                handleUpdate('fechaFin', today);
                            }}
                        >
                            Última semana
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const today = new Date();
                                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                                handleUpdate('fechaInicio', lastMonth);
                                handleUpdate('fechaFin', today);
                            }}
                        >
                            Último mes
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const today = new Date();
                                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                                handleUpdate('fechaInicio', firstDayOfMonth);
                                handleUpdate('fechaFin', today);
                            }}
                        >
                            Este mes
                        </Button>
                    </div>
                </div>
            )}

            {/* Opciones Avanzadas */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full justify-between"
                >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Opciones Avanzadas
          </span>
                    <span className="text-xs text-gray-500">
            {showAdvanced ? '▲' : '▼'}
          </span>
                </Button>

                {showAdvanced && (
                    <div className="mt-4 space-y-4">
                        {/* Selección de Columnas */}
                        <div>
                            <Label className="mb-2 block">Columnas a Incluir</Label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {columnOptions[config.tipo]?.map(column => (
                                    <div key={column} className="flex items-center gap-2">
                                        <Checkbox
                                            id={column}
                                            checked={!config.columnas || config.columnas.includes(column)}
                                            onCheckedChange={() => handleColumnToggle(column)}
                                        />
                                        <label
                                            htmlFor={column}
                                            className="text-sm cursor-pointer"
                                        >
                                            {column}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Filtros adicionales */}
                        {config.tipo === 'inventario' && (
                            <div>
                                <Label className="mb-2 block flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filtrar por Estado
                                </Label>
                                <div className="space-y-2">
                                    {['critico', 'bajo', 'reorden', 'normal'].map(estado => (
                                        <div key={estado} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`estado-${estado}`}
                                                checked={config.filtros?.estados?.includes(estado) || false}
                                                onCheckedChange={(checked) => {
                                                    const current = config.filtros?.estados || [];
                                                    const updated = checked
                                                        ? [...current, estado]
                                                        : current.filter(e => e !== estado);
                                                    handleUpdate('filtros', { ...config.filtros, estados: updated });
                                                }}
                                            />
                                            <label htmlFor={`estado-${estado}`} className="text-sm capitalize cursor-pointer">
                                                {estado}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3 pt-4">
                <Button
                    onClick={() => onPreview(config)}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                >
                    Vista Previa
                </Button>
                <Button
                    onClick={() => onGenerate(config)}
                    className="flex-1 bg-theme-primary hover:bg-theme-primary-dark"
                    disabled={loading}
                >
                    {loading ? 'Generando...' : 'Generar y Descargar'}
                </Button>
            </div>
        </div>
    );
}