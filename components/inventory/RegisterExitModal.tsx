// components/inventory/RegisterExitModal.tsx
"use client";

import { useState, useEffect } from 'react';
import { X, PackageMinus, Loader2, AlertCircle } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { Inventario } from '@/types/database.types';

interface RegisterExitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productoId?: string;
}

export function RegisterExitModal({ isOpen, onClose, onSuccess, productoId }: RegisterExitModalProps) {
    const [loading, setLoading] = useState(false);
    const [loadingInventario, setLoadingInventario] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inventarios, setInventarios] = useState<Inventario[]>([]);

    const { productos, registrarSalida, fetchProductos } = useInventory(); // ← Agregar fetchProductos


    useEffect(() => {
        if (isOpen) {
            fetchProductos();
        }
    }, [isOpen]);



    const [formData, setFormData] = useState({
        producto_id: productoId || '',
        inventario_id: '',
        cantidad: 1,
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


        if (!formData.producto_id) {
            setError('Debe seleccionar un producto');
            return;
        }
        if (!formData.inventario_id) {
            setError('Debe seleccionar una ubicación/lote');
            return;
        }
        // Validación
        if (!selectedInventario) {
            setError('Debe seleccionar una ubicación/lote');
            return;
        }

        if (formData.cantidad > selectedInventario.cantidad_disponible) {
            setError(`Stock insuficiente. Disponible: ${selectedInventario.cantidad_disponible}`);
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
                        <h2 className="text-xl font-semibold">Registrar Salida</h2>
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
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Producto */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Producto *
                            </label>
                            <select
                                required
                                value={formData.producto_id}
                                onChange={(e) => setFormData({ ...formData, producto_id: e.target.value, inventario_id: '' })}
                                disabled={!!productoId || productos.length === 0}  // ← Agregar || productos.length === 0
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
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

                        {/* Ubicación/Lote */}
                        {formData.producto_id && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ubicación / Lote *
                                </label>
                                {loadingInventario ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                                    </div>
                                ) : inventarios.length === 0 ? (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg text-sm">
                                        No hay stock disponible para este producto
                                    </div>
                                ) : (
                                    <select
                                        required
                                        value={formData.inventario_id}
                                        onChange={(e) => setFormData({ ...formData, inventario_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">Seleccionar ubicación/lote...</option>
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
                    {selectedInventario && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Stock Disponible</p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                        {selectedInventario.cantidad_disponible}
                                    </p>
                                </div>
                                <PackageMinus size={40} className="text-blue-600 dark:text-blue-400 opacity-20" />
                            </div>
                            {selectedInventario.fecha_caducidad && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                    Caduca: {new Date(selectedInventario.fecha_caducidad).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Cantidad y Detalles */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cantidad a Retirar *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max={selectedInventario?.cantidad_disponible || 999999}
                                value={formData.cantidad}
                                onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 1 })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                disabled={!selectedInventario}
                            />
                            {selectedInventario && formData.cantidad > selectedInventario.cantidad_disponible && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                                    Cantidad excede el stock disponible
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Motivo *
                            </label>
                            <select
                                required
                                value={formData.motivo}
                                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar motivo...</option>
                                <option value="Dispensación">Dispensación a Paciente</option>
                                <option value="Solicitud Interna">Solicitud Interna</option>
                                <option value="Urgencias">Uso en Urgencias</option>
                                <option value="Cirugía">Uso en Cirugía</option>
                                <option value="Consulta">Uso en Consulta</option>
                                <option value="Merma">Merma o Pérdida</option>
                                <option value="Caducidad">Producto Caducado</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Notas
                            </label>
                            <textarea
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                            disabled={loading || !selectedInventario || formData.cantidad > (selectedInventario?.cantidad_disponible || 0)}
                            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <PackageMinus size={18} />
                                    Registrar Salida
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}