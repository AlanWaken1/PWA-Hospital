// components/inventory/RegisterEntryModal.tsx
"use client";

import { useState, useEffect } from 'react'; // ← Agregar useEffect
import { X, PackagePlus } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';

interface RegisterEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productoId?: string;
}

export function RegisterEntryModal({ isOpen, onClose, onSuccess, productoId }: RegisterEntryModalProps) {
    const { productos, ubicaciones, registrarEntrada, fetchProductos, fetchUbicaciones } = useInventory(); // ← Agregar fetchProductos, fetchUbicaciones
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    // ⚠️ AGREGAR ESTE useEffect:
    useEffect(() => {
        if (isOpen) {
            console.log('🚀 Llamando fetchProductos...');
            fetchProductos();
            console.log('🚀 Llamando fetchUbicaciones...');
            fetchUbicaciones();
        }
    }, [isOpen]);

    const [formData, setFormData] = useState({
        producto_id: productoId || '',
        ubicacion_id: '',
        cantidad: 1,
        lote: '',
        fecha_caducidad: '',
        costo_unitario: '',
        documento_referencia: '',
        notas: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!formData.producto_id) {
            setError('Debe seleccionar un producto');
            return;
        }
        if (!formData.ubicacion_id) {
            setError('Debe seleccionar una ubicación');
            return;
        }
        if (!formData.cantidad || formData.cantidad <= 0) {
            setError('La cantidad debe ser mayor a 0');
            return;
        }

        const { error } = await registrarEntrada({
            producto_id: formData.producto_id,
            ubicacion_id: formData.ubicacion_id,
            cantidad: formData.cantidad,
            lote: formData.lote || undefined,
            fecha_caducidad: formData.fecha_caducidad || undefined,
            costo_unitario: formData.costo_unitario ? parseFloat(formData.costo_unitario) : undefined,
            documento_referencia: formData.documento_referencia || undefined,
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
                ubicacion_id: '',
                cantidad: 1,
                lote: '',
                fecha_caducidad: '',
                costo_unitario: '',
                documento_referencia: '',
                notas: '',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <PackagePlus size={24} />
                        <h2 className="text-xl font-semibold">Registrar Entrada</h2>
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
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Producto y Ubicación */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Producto *
                            </label>
                            <select
                                required
                                value={formData.producto_id}
                                onChange={(e) => setFormData({ ...formData, producto_id: e.target.value })}
                                disabled={!!productoId || productos.length === 0}  // ← Agregar || productos.length === 0
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            >
                                <option value="">
                                    {productos.length === 0 ? 'Cargando productos...' : 'Seleccionar producto...'}
                                </option>
                                {productos.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.codigo} - {prod.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ubicación de Destino *
                            </label>
                            <select
                                required
                                value={formData.ubicacion_id}
                                onChange={(e) => setFormData({ ...formData, ubicacion_id: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar ubicación...</option>
                                {ubicaciones.map((ub) => (
                                    <option key={ub.id} value={ub.id}>
                                        {ub.nombre} ({ub.tipo})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Cantidad y Detalles */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Cantidad *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.cantidad}
                                    onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 1 })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Costo Unitario
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.costo_unitario}
                                    onChange={(e) => setFormData({ ...formData, costo_unitario: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="$0.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Lote
                                </label>
                                <input
                                    type="text"
                                    value={formData.lote}
                                    onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: LOT-2024-001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha de Caducidad
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha_caducidad}
                                    onChange={(e) => setFormData({ ...formData, fecha_caducidad: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Documento de Referencia
                            </label>
                            <input
                                type="text"
                                value={formData.documento_referencia}
                                onChange={(e) => setFormData({ ...formData, documento_referencia: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ej: Factura, Orden de Compra, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Notas
                            </label>
                            <textarea
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Observaciones adicionales..."
                            />
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
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PackagePlus size={18} />
                            {loading ? 'Registrando...' : 'Registrar Entrada'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}