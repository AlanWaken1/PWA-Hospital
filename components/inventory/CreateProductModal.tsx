// components/inventory/CreateProductModal.tsx
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Save } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { UnidadMedida } from '@/types/database.types';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
    const t = useTranslations('inventory.modals.create_product');
    const { categorias, createProducto } = useInventory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        codigo: `PROD-${Date.now()}`,
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await createProducto({
            ...formData,
            codigo_barras: null,
            es_fragil: false,
            imagen_url: null,
            fabricante: null,
            principio_activo: null,
            concentracion: null,
            forma_farmaceutica: null,
            costo_promedio: null,
            precio_ultima_compra: null,
            esta_activo: true,
        });

        setLoading(false);

        if (error) {
            setError(error);
        } else {
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                codigo: '',
                nombre: '',
                descripcion: '',
                categoria_id: '',
                unidad_medida: 'pieza',
                stock_minimo: 10,
                stock_maximo: 100,
                punto_reorden: 20,
                requiere_receta: false,
                es_controlado: false,
                requiere_refrigeracion: false,
                controla_lote: true,
                controla_caducidad: true,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t('title')}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Información Básica */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('basic_info')}</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('code')} *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.codigo}
                                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                    placeholder={t('placeholder_code')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('category')} *
                                </label>
                                <select
                                    required
                                    value={formData.categoria_id}
                                    onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                >
                                    <option value="">{t('select')}</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('product_name')} *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                placeholder={t('placeholder_name')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('description')}
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                placeholder={t('placeholder_description')}
                            />
                        </div>
                    </div>

                    {/* Información de Stock */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('stock_control')}</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('unit_measure')} *
                                </label>
                                <select
                                    required
                                    value={formData.unidad_medida}
                                    onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value as UnidadMedida })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                                >
                                    <option value="pieza">{t('units.piece')}</option>
                                    <option value="caja">{t('units.box')}</option>
                                    <option value="frasco">{t('units.bottle')}</option>
                                    <option value="ampolleta">{t('units.ampoule')}</option>
                                    <option value="litro">{t('units.liter')}</option>
                                    <option value="mililitro">{t('units.milliliter')}</option>
                                    <option value="gramo">{t('units.gram')}</option>
                                    <option value="kilogramo">{t('units.kilogram')}</option>
                                    <option value="paquete">{t('units.package')}</option>
                                    <option value="rollo">{t('units.roll')}</option>
                                    <option value="otro">{t('units.other')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('min_stock')} *
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
                                    {t('max_stock')} *
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
                                    {t('reorder_point')} *
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
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('special_features')}</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.requiere_receta}
                                    onChange={(e) => setFormData({ ...formData, requiere_receta: e.target.checked })}
                                    className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('requires_prescription')}</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.es_controlado}
                                    onChange={(e) => setFormData({ ...formData, es_controlado: e.target.checked })}
                                    className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('controlled_medication')}</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.requiere_refrigeracion}
                                    onChange={(e) => setFormData({ ...formData, requiere_refrigeracion: e.target.checked })}
                                    className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('requires_refrigeration')}</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.controla_lote}
                                    onChange={(e) => setFormData({ ...formData, controla_lote: e.target.checked })}
                                    className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('control_batch')}</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.controla_caducidad}
                                    onChange={(e) => setFormData({ ...formData, controla_caducidad: e.target.checked })}
                                    className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('control_expiration')}</span>
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
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white rounded-lg hover:shadow-lg hover:shadow-theme-primary/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {loading ? t('creating') : t('create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}