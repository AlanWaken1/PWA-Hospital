// components/inventory/EditProductModal.tsx
"use client";

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { UnidadMedida, Producto } from '@/types/database.types';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productoId: string;
}

export function EditProductModal({ isOpen, onClose, onSuccess, productoId }: EditProductModalProps) {
    const { categorias, updateProducto, fetchCategorias } = useInventory(); // ← Agregar fetchCategorias
    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoria_id: '',
        unidad_medida: 'pieza' as UnidadMedida,
        stock_minimo: 10,
        stock_maximo: 100,
        punto_reorden: 20,
        requiere_receta: false,
        es_controlado: false,
        requiere_refrigeracion: false,
        controla_lote: true,
        controla_caducidad: true,
    });

    // Cargar datos del producto
    useEffect(() => {
        if (isOpen && productoId) {
            fetchCategorias();  // ← Agregar esta línea
            fetchProducto();
        }
    }, [isOpen, productoId]);

    const fetchProducto = async () => {
        try {
            setLoadingProduct(true);
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();

            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('id', productoId)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    codigo: data.codigo,
                    nombre: data.nombre,
                    descripcion: data.descripcion || '',
                    categoria_id: data.categoria_id,
                    unidad_medida: data.unidad_medida,
                    stock_minimo: data.stock_minimo,
                    stock_maximo: data.stock_maximo,
                    punto_reorden: data.punto_reorden,
                    requiere_receta: data.requiere_receta,
                    es_controlado: data.es_controlado,
                    requiere_refrigeracion: data.requiere_refrigeracion,
                    controla_lote: data.controla_lote,
                    controla_caducidad: data.controla_caducidad,
                });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingProduct(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await updateProducto(productoId, formData);

        setLoading(false);

        if (error) {
            setError(error);
        } else {
            onSuccess();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Editar Producto</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Loading State */}
                {loadingProduct ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-theme-primary animate-spin" />
                        <p className="text-gray-600 dark:text-gray-400">Cargando producto...</p>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Información Básica */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Información Básica</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Código *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.codigo}
                                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Categoría *
                                    </label>
                                    <select
                                        required
                                        value={formData.categoria_id}
                                        onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {categorias.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre del Producto *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Información de Stock */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Control de Stock</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Unidad de Medida *
                                    </label>
                                    <select
                                        required
                                        value={formData.unidad_medida}
                                        onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value as UnidadMedida })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                    >
                                        <option value="pieza">Pieza</option>
                                        <option value="caja">Caja</option>
                                        <option value="frasco">Frasco</option>
                                        <option value="ampolleta">Ampolleta</option>
                                        <option value="litro">Litro</option>
                                        <option value="mililitro">Mililitro</option>
                                        <option value="gramo">Gramo</option>
                                        <option value="kilogramo">Kilogramo</option>
                                        <option value="paquete">Paquete</option>
                                        <option value="rollo">Rollo</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Stock Mínimo *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock_minimo}
                                        onChange={(e) => setFormData({ ...formData, stock_minimo: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Stock Máximo *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock_maximo}
                                        onChange={(e) => setFormData({ ...formData, stock_maximo: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Punto de Reorden *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.punto_reorden}
                                        onChange={(e) => setFormData({ ...formData, punto_reorden: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Características Especiales */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Características Especiales</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.requiere_receta}
                                        onChange={(e) => setFormData({ ...formData, requiere_receta: e.target.checked })}
                                        className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Requiere Receta</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.es_controlado}
                                        onChange={(e) => setFormData({ ...formData, es_controlado: e.target.checked })}
                                        className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Medicamento Controlado</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.requiere_refrigeracion}
                                        onChange={(e) => setFormData({ ...formData, requiere_refrigeracion: e.target.checked })}
                                        className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Requiere Refrigeración</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.controla_lote}
                                        onChange={(e) => setFormData({ ...formData, controla_lote: e.target.checked })}
                                        className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Controlar Lote</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.controla_caducidad}
                                        onChange={(e) => setFormData({ ...formData, controla_caducidad: e.target.checked })}
                                        className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Controlar Caducidad</span>
                                </label>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white rounded-lg hover:shadow-lg hover:shadow-theme-primary/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}