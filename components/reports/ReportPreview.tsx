// components/reports/ReportPreview.tsx
"use client";

import { useState, useMemo } from 'react';
import { Search, Download, X, ArrowUpDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ReportPreviewProps {
    data: any[];
    columns: string[];
    onClose: () => void;
    onDownload: () => void;
    title: string;
}

export function ReportPreview({ data, columns, onClose, onDownload, title }: ReportPreviewProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Filtrar datos
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter(row =>
            Object.values(row).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    // Ordenar datos
    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const aStr = String(aValue || '');
            const bStr = String(bValue || '');
            return sortDirection === 'asc'
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
        });
    }, [filteredData, sortColumn, sortDirection]);

    // Paginación
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Obtener valor formateado de celda
    const getCellValue = (row: any, column: string) => {
        const key = column.toLowerCase().replace(/\s+/g, '_');
        const value = row[key] || row[column] || '-';

        // Formatear estados con badges
        if (column === 'Estado' || column === 'estado_stock') {
            return <StateBadge estado={String(value)} />;
        }

        // Formatear números con decimales
        if (typeof value === 'number' && value % 1 !== 0) {
            return value.toFixed(2);
        }

        return value;
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Vista Previa
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {title} • {sortedData.length} registros
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar en los resultados..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button
                        onClick={onDownload}
                        className="bg-theme-primary hover:bg-theme-primary-dark"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                    </Button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                            <TableRow>
                                {columns.map(column => (
                                    <TableHead
                                        key={column}
                                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => handleSort(column)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {column}
                                            <ArrowUpDown className="w-3 h-3 text-gray-400" />
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                                        No se encontraron resultados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((row, idx) => (
                                    <TableRow key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        {columns.map(column => (
                                            <TableCell key={column}>
                                                {getCellValue(row, column)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-500">
                            Página {currentPage} de {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Componente auxiliar para badges de estado
function StateBadge({ estado }: { estado: string }) {
    const variants: Record<string, { color: string; label: string }> = {
        critico: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Crítico' },
        bajo: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Bajo' },
        reorden: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'Reorden' },
        normal: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Normal' },
    };

    const variant = variants[estado.toLowerCase()] || variants.normal;

    return (
        <Badge className={`${variant.color} border-0`}>
            {variant.label}
        </Badge>
    );
}