// app/(app)/inventory/page.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import {
    Plus,
    Search,
    Download,
    Package,
    AlertTriangle,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    PackagePlus,
    PackageMinus,
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { CreateProductModal } from '@/components/inventory/CreateProductModal';
import { RegisterEntryModal } from '@/components/inventory/RegisterEntryModal';
import { RegisterExitModal } from '@/components/inventory/RegisterExitModal';
import { EditProductModal } from '@/components/inventory/EditProductModal';
import { ProductDetailsModal } from '@/components/inventory/ProductDetailsModal';
import { ConfirmDialog } from '@/components/inventory/ConfirmDialog';
import { Badge } from '@/components/ui/badge';

export default function InventoryPage() {
    const titleRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    const { stockTotal, loading, fetchStockTotal, fetchProductos, deleteProducto } = useInventory();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEntryModal, setShowEntryModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Selected product for actions
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // Confirm dialog
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => {},
    });

    // Fetch productos al montar
    useEffect(() => {
        fetchProductos();
        fetchStockTotal();
    }, []);

    // Animaciones GSAP
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power2.out',
            });

            gsap.from(statsRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                delay: 0.2,
                ease: 'power2.out',
            });

            gsap.from(tableRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                delay: 0.4,
                ease: 'power2.out',
            });
        });

        return () => ctx.revert();
    }, []);

    // Filtrar productos
    const filteredProducts = useMemo(() => {
        return stockTotal.filter((product) => {
            const matchesSearch =
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.categoria.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === 'all' || product.categoria === selectedCategory;

            const matchesStatus =
                selectedStatus === 'all' ||
                (selectedStatus === 'critico' && product.estado_stock === 'critico') ||
                (selectedStatus === 'bajo' && product.estado_stock === 'bajo') ||
                (selectedStatus === 'normal' && (product.estado_stock === 'normal' || product.estado_stock === 'reorden'));

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [stockTotal, searchTerm, selectedCategory, selectedStatus]);

    // Stats
    const stats = useMemo(() => {
        const total = stockTotal.length;
        const criticos = stockTotal.filter(p => p.estado_stock === 'critico').length;
        const bajos = stockTotal.filter(p => p.estado_stock === 'bajo').length;
        const reorden = stockTotal.filter(p => p.estado_stock === 'reorden').length;

        return { total, criticos, bajos, reorden };
    }, [stockTotal]);

    // Obtener categorías únicas
    const categorias = useMemo(() => {
        const cats = new Set(stockTotal.map(p => p.categoria));
        return Array.from(cats).sort();
    }, [stockTotal]);

    // Función para obtener badge de estado
    const getStatusBadge = (estado: string) => {
        switch (estado) {
            case 'critico':
                return <Badge variant="destructive" className="text-xs">Crítico</Badge>;
            case 'bajo':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">Bajo</Badge>;
            case 'reorden':
                return <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">Reorden</Badge>;
            default:
                return <Badge className="bg-green-500 hover:bg-green-600 text-xs">Normal</Badge>;
        }
    };

    // Handlers
    const handleRefresh = () => {
        fetchStockTotal();
        fetchProductos();
    };

    const handleDelete = (id: string, nombre: string) => {
        setConfirmDialog({
            isOpen: true,
            title: '¿Eliminar producto?',
            description: `¿Estás seguro de que deseas eliminar "${nombre}"? Esta acción no se puede deshacer.`,
            onConfirm: async () => {
                const { error } = await deleteProducto(id);
                if (error) {
                    // TODO: Mostrar toast de error
                    console.error('Error al eliminar:', error);
                } else {
                    handleRefresh();
                }
            },
        });
    };

    const handleRegisterEntry = (productoId: string) => {
        setSelectedProductId(productoId);
        setShowEntryModal(true);
    };

    const handleRegisterExit = (productoId: string) => {
        setSelectedProductId(productoId);
        setShowExitModal(true);
    };

    const handleEdit = (productoId: string) => {
        setSelectedProductId(productoId);
        setShowEditModal(true);
    };

    const handleViewDetails = (productoId: string) => {
        setSelectedProductId(productoId);
        setShowDetailsModal(true);
    };


    return (
        <>
            {/* Page Title */}
            <div ref={titleRef} className="mb-6">
                <h1 className="text-gray-900 dark:text-gray-100 mb-2">Gestión de Inventario</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Control completo del inventario médico y farmacéutico
                </p>
            </div>

            {/* Stats Cards */}
            <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm text-gray-600 dark:text-gray-400">Total Productos</h4>
                        <Package className="text-blue-600 dark:text-blue-400" size={20} />
                    </div>
                    <div className="text-3xl text-gray-900 dark:text-gray-100 mb-1">{stats.total}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">En catálogo</p>
                </div>

                <div className="bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-2xl p-6 text-white shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-red-100">Stock Crítico</h4>
                        <AlertTriangle className="text-white" size={20} />
                    </div>
                    <div className="text-3xl mb-1">{stats.criticos}</div>
                    <p className="text-red-200 text-sm">Requieren atención urgente</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 dark:from-yellow-700 dark:to-yellow-800 rounded-2xl p-6 text-white shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-yellow-100">Stock Bajo</h4>
                        <TrendingUp className="text-white" size={20} />
                    </div>
                    <div className="text-3xl mb-1">{stats.bajos}</div>
                    <p className="text-yellow-200 text-sm">Cerca del mínimo</p>
                </div>

                <div className="bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 rounded-2xl p-6 text-white shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-orange-100">Punto Reorden</h4>
                        <Package className="text-white" size={20} />
                    </div>
                    <div className="text-3xl mb-1">{stats.reorden}</div>
                    <p className="text-orange-200 text-sm">Solicitar reabastecimiento</p>
                </div>
            </div>

            {/* Toolbar */}
            <div ref={tableRef} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, código o categoría..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="all">Todas las categorías</option>
                                {categorias.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="critico">Crítico</option>
                                <option value="bajo">Bajo</option>
                                <option value="normal">Normal</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-emerald-500/30 flex items-center gap-2 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">Nuevo Producto</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                            <Package size={48} className="mb-4 opacity-50" />
                            <p className="text-lg">No se encontraron productos</p>
                            <p className="text-sm">Intenta ajustar los filtros o agregar nuevos productos</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Código</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Producto</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Categoría</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">Stock Actual</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">Stock Mín.</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">Estado</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.map((product) => (
                                <tr
                                    key={product.producto_id}
                                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                        {product.codigo}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {product.nombre}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {product.unidad_medida}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {product.categoria}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {product.cantidad_total || 0}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                        {product.stock_minimo}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getStatusBadge(product.estado_stock)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleRegisterEntry(product.producto_id)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Registrar Entrada"
                                            >
                                                <PackagePlus size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleRegisterExit(product.producto_id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Registrar Salida"
                                            >
                                                <PackageMinus size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleViewDetails(product.producto_id)}
                                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title="Ver Detalles"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(product.producto_id)}
                                                className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.producto_id, product.nombre)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {filteredProducts.length} de {stockTotal.length} productos
                    </p>
                    <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                        <Download size={16} />
                        Exportar a Excel
                    </button>
                </div>
            </div>

            {/* Modals */}
            <CreateProductModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleRefresh}
            />

            <RegisterEntryModal
                key={`entry-${showEntryModal}-${selectedProductId}`}  // ← AGREGAR ESTA LÍNEA
                isOpen={showEntryModal}
                onClose={() => {
                    setShowEntryModal(false);
                    setSelectedProductId(null);
                }}
                onSuccess={handleRefresh}
                productoId={selectedProductId || undefined}
            />

            <RegisterExitModal
                key={`exit-${showExitModal}-${selectedProductId}`}
                isOpen={showExitModal}
                onClose={() => {
                    setShowExitModal(false);
                    setSelectedProductId(null);
                }}
                onSuccess={handleRefresh}
                productoId={selectedProductId || undefined}
            />

            {selectedProductId && (
                <>
                    <EditProductModal
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedProductId(null);
                        }}
                        onSuccess={handleRefresh}
                        productoId={selectedProductId}
                    />

                    <ProductDetailsModal
                        isOpen={showDetailsModal}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedProductId(null);
                        }}
                        productoId={selectedProductId}
                    />
                </>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                description={confirmDialog.description}
                variant="danger"
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
        </>
    );
}