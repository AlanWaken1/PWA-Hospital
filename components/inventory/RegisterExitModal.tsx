// components/inventory/RegisterExitModal.tsx - CON VALIDACIÓN OFFLINE
"use client";

import { useState, useEffect } from 'react';
import { X, PackageMinus, Loader2, AlertCircle } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { Inventario } from '@/types/database.types';
import { isOnline } from '@/lib/offline/sync';
import { useTranslations } from 'next-intl';

interface RegisterExitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productoId?: string;
}

export function RegisterExitModal({ isOpen, onClose, onSuccess, productoId }: RegisterExitModalProps) {
    const t = useTranslations('inventory.modals.register_exit');

    const [loading, setLoading] = useState(false);
    const [loadingInventario, setLoadingInventario] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inventarios, setInventarios] = useState<Inventario[]>([]);

    const { productos, registrarSalida, fetchProductos } = useInventory();
    const offline = !isOnline();

    useEffect(() => {
        if (isOpen) {
            fetchProductos();
        }
    }, [isOpen]);

    const [formData, setFormData] = useState({
        producto_id: productoId || '',
        inventario_id: '',
        cantidad: 0,
        motivo: '',
        notas: '',
    });

    // Cargar inventarios cuando cambia el producto
    useEffect(() => {
        if (formData.producto_id) {
            fetchInventarios(formData.producto_id);
        } else {
            setInventarios([]);
            setFormData(prev => ({ ...prev, inventario_id: '' }));
        }
    }, [formData.producto_id]);

    const fetchInventarios = async (prodId: string) => {
        // ✅ VALIDACIÓN OFFLINE - Bloquear si no hay internet
        if (offline) {
            console.log('📴 Offline: No se pueden cargar inventarios');
            setError(t('offline_message'));
            setLoadingInventario(false);
            return;
        }

        try {
            setLoadingInventario(true);
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();

            const { data, error } = await supabase
                .from('inventario')
                .select(`
          *,
          ubicacion:ubicaciones(*)
        `)
                .eq('producto_id', prodId)
                .eq('esta_activo', true)
                .gt('cantidad_disponible', 0);

            if (error) throw error;
            setInventarios(data || []);
        } catch (err: any) {
            console.error('Error loading inventarios:', err);
            setError(err.message);
        } finally {
            setLoadingInventario(false);
        }
    };

    const selectedInventario = inventarios.find(inv => inv.id === formData.inventario_id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // ✅ VALIDACIÓN OFFLINE - Bloquear submit si no hay internet
        if (offline) {
            setError(t('error_requires_internet'));
            return;
        }

        if (!formData.producto_id) {
            setError(t('error_select_product'));
            return;
        }
        if (!formData.inventario_id) {
            setError(t('error_select_location'));
            return;
        }
        // Validación
        if (!selectedInventario) {
            setError(t('error_select_location'));
            return;
        }

        if (formData.cantidad > selectedInventario.cantidad_disponible) {
            setError(`${t('error_insufficient_stock')} ${selectedInventario.cantidad_disponible}`);
            return;
        }

        setLoading(true);

        const { error } = await registrarSalida({
            inventario_id: formData.inventario_id,
            cantidad: formData.cantidad,
            motivo: formData.motivo || undefined,
            notas: formData.notas || undefined,
        });

        setLoading(false);

        if (error) {
            setError(error);
        } else {
            onSuccess();
            onClose();
            setFormData({
                producto_id: productoId || '',
                inventario_id: '',
                cantidad: 1,
                motivo: '',
                notas: '',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <PackageMinus size={24} />
                        <h2 className="text-xl font-semibold">{t('title')}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* ⚠️ MENSAJE OFFLINE */}
                    {offline && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="text-orange-600 dark:text-orange-400 flex-shrink-0" size={20} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1">
                                        {t('offline_title')}
                                    </p>
                                    <p className="text-sm text-orange-800 dark:text-orange-200">
                                        {t('offline_message')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && !offline && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Producto */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('product')} *
                            </label>
                            <select
                                required
                                value={formData.producto_id}
                                onChange={(e) => setFormData({ ...formData, producto_id: e.target.value })}
                                disabled={!!productoId || productos.length === 0 || offline}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                            >
                                <option value="">
                                    {productos.length === 0 ? t('loading_products') : t('select_product')}
                                </option>
                                {productos.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.codigo} - {prod.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ubicación/Lote */}
                        {formData.producto_id && !offline && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('location_batch')} *
                                </label>
                                {loadingInventario ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                                    </div>
                                ) : inventarios.length === 0 ? (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg text-sm">
                                        {t('no_stock_available')}
                                    </div>
                                ) : (
                                    <select
                                        required
                                        value={formData.inventario_id}
                                        onChange={(e) => setFormData({ ...formData, inventario_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">{t('select_location_batch')}</option>
                                        {inventarios.map((inv) => (
                                            <option key={inv.id} value={inv.id}>
                                                {inv.ubicacion?.nombre}
                                                {inv.lote && ` - Lote: ${inv.lote}`}
                                                {' '}- Disponible: {inv.cantidad_disponible}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Stock Disponible Card */}
                    {selectedInventario && !offline && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">{t('stock_available')}</p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                        {selectedInventario.cantidad_disponible}
                                    </p>
                                </div>
                                <PackageMinus size={40} className="text-blue-600 dark:text-blue-400 opacity-20" />
                            </div>
                            {selectedInventario.fecha_caducidad && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                    {t('expires')}: {new Date(selectedInventario.fecha_caducidad).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Cantidad y Detalles - Solo si hay internet */}
                    {!offline && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('quantity_to_withdraw')} *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max={selectedInventario?.cantidad_disponible || 999999}
                                    value={formData.cantidad}
                                    onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 1 })}
                                    onFocus={(e) => e.target.select()}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    disabled={!selectedInventario}
                                />
                                {selectedInventario && formData.cantidad > selectedInventario.cantidad_disponible && (
                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                                        {t('error_quantity_exceeds')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('reason')} *
                                </label>
                                <select
                                    required
                                    value={formData.motivo}
                                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">{t('select_reason')}</option>
                                    <option value="Dispensación">{t('reasons.dispensation')}</option>
                                    <option value="Solicitud Interna">{t('reasons.internal_request')}</option>
                                    <option value="Urgencias">{t('reasons.emergency')}</option>
                                    <option value="Cirugía">{t('reasons.surgery')}</option>
                                    <option value="Consulta">{t('reasons.consultation')}</option>
                                    <option value="Merma">{t('reasons.loss')}</option>
                                    <option value="Caducidad">{t('reasons.expired')}</option>
                                    <option value="Otro">{t('reasons.other')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('notes')}
                                </label>
                                <textarea
                                    value={formData.notas}
                                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder={t('notes_placeholder')}
                                />
                            </div>
                        </div>
                    )}

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
                            disabled={offline || loading || !selectedInventario || formData.cantidad > (selectedInventario?.cantidad_disponible || 0)}
                            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    {t('registering')}
                                </>
                            ) : (
                                <>
                                    <PackageMinus size={18} />
                                    {offline ? t('requires_internet') : t('register')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}