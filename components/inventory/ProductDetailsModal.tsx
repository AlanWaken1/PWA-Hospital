// components/inventory/ProductDetailsModal.tsx
"use client";

import { useState, useEffect } from 'react';
import { X, Package, MapPin, Clock, AlertCircle, CheckCircle, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Producto, Inventario, Movimiento } from '@/types/database.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    productoId: string;
}

export function ProductDetailsModal({ isOpen, onClose, productoId }: ProductDetailsModalProps) {
    const [loading, setLoading] = useState(true);
    const [producto, setProducto] = useState<Producto | null>(null);
    const [inventario, setInventario] = useState<Inventario[]>([]);
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [activeTab, setActiveTab] = useState<'info' | 'stock' | 'movimientos'>('info');

    useEffect(() => {
        if (isOpen && productoId) {
            fetchData();
        }
    }, [isOpen, productoId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();

            // Producto con categoría
            const { data: prod, error: prodError } = await supabase
                .from('productos')
                .select(`
          *,
          categoria:categorias(*)
        `)
                .eq('id', productoId)
                .single();

            if (prodError) throw prodError;
            setProducto(prod);

            // Inventario por ubicación
            const { data: inv, error: invError } = await supabase
                .from('inventario')
                .select(`
          *,
          ubicacion:ubicaciones(*)
        `)
                .eq('producto_id', productoId)
                .eq('esta_activo', true);

            if (invError) throw invError;
            setInventario(inv || []);

            // Últimos 10 movimientos
            const { data: mov, error: movError } = await supabase
                .from('movimientos')
                .select(`
          *,
          ubicacion_origen:ubicacion_origen_id(nombre),
          ubicacion_destino:ubicacion_destino_id(nombre)
        `)
                .eq('producto_id', productoId)
                .order('created_at', { ascending: false })
                .limit(10);

            if (movError) throw movError;
            setMovimientos(mov || []);

        } catch (err: any) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalStock = inventario.reduce((sum, inv) => sum + inv.cantidad_disponible, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Package size={28} />
                                {loading ? (
                                    <div className="h-8 w-48 bg-white/20 rounded animate-pulse" />
                                ) : (
                                    <h2 className="text-2xl font-semibold">{producto?.nombre}</h2>
                                )}
                            </div>
                            {!loading && producto && (
                                <div className="flex items-center gap-3 text-theme-primary-light">
                                    <span className="text-sm">Código: {producto.codigo}</span>
                                    <span className="text-sm">•</span>
                                    <span className="text-sm">{producto.categoria?.nombre}</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex gap-1 p-2">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'info'
                                    ? 'bg-white dark:bg-gray-800 text-theme-primary shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            Información
                        </button>
                        <button
                            onClick={() => setActiveTab('stock')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'stock'
                                    ? 'bg-white dark:bg-gray-800 text-theme-primary shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            Stock por Ubicación
                        </button>
                        <button
                            onClick={() => setActiveTab('movimientos')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'movimientos'
                                    ? 'bg-white dark:bg-gray-800 text-theme-primary shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            Movimientos
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Loader2 className="w-12 h-12 text-theme-primary animate-spin" />
                            <p className="text-gray-600 dark:text-gray-400">Cargando información...</p>
                        </div>
                    ) : !producto ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No se pudo cargar la información del producto
                        </div>
                    ) : (
                        <>
                            {/* Tab: Información */}
                            {activeTab === 'info' && (
                                <div className="space-y-6">
                                    {/* Stock Total Card */}
                                    <div className="bg-gradient-to-br from-theme-primary/10 to-theme-primary/20 dark:from-theme-primary-dark/20 dark:to-theme-primary-dark/20 rounded-xl p-6 border border-theme-primary/30 dark:border-emerald-800">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-theme-primary-dark dark:text-theme-primary-light mb-1">Stock Total</p>
                                                <p className="text-4xl font-bold text-theme-primary-dark dark:text-theme-primary-light">{totalStock}</p>
                                                <p className="text-sm text-theme-primary dark:text-theme-primary-light mt-1">{producto.unidad_medida}</p>
                                            </div>
                                            <Package size={48} className="text-theme-primary dark:text-theme-primary-light opacity-20" />
                                        </div>
                                    </div>

                                    {/* Información General */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Código</label>
                                                <p className="text-gray-900 dark:text-gray-100 font-medium">{producto.codigo}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Categoría</label>
                                                <p className="text-gray-900 dark:text-gray-100">{producto.categoria?.nombre}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Unidad de Medida</label>
                                                <p className="text-gray-900 dark:text-gray-100 capitalize">{producto.unidad_medida}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Stock Mínimo</label>
                                                <p className="text-gray-900 dark:text-gray-100">{producto.stock_minimo}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Stock Máximo</label>
                                                <p className="text-gray-900 dark:text-gray-100">{producto.stock_maximo}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Punto de Reorden</label>
                                                <p className="text-gray-900 dark:text-gray-100">{producto.punto_reorden}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    {producto.descripcion && (
                                        <div>
                                            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Descripción</label>
                                            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                                {producto.descripcion}
                                            </p>
                                        </div>
                                    )}

                                    {/* Características Especiales */}
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 block">Características</label>
                                        <div className="flex flex-wrap gap-2">
                                            {producto.requiere_receta && (
                                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100">
                                                    Requiere Receta
                                                </Badge>
                                            )}
                                            {producto.es_controlado && (
                                                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100">
                                                    Controlado
                                                </Badge>
                                            )}
                                            {producto.requiere_refrigeracion && (
                                                <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 hover:bg-cyan-100">
                                                    Refrigeración
                                                </Badge>
                                            )}
                                            {producto.controla_lote && (
                                                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-100">
                                                    Control de Lote
                                                </Badge>
                                            )}
                                            {producto.controla_caducidad && (
                                                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100">
                                                    Control de Caducidad
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Stock por Ubicación */}
                            {activeTab === 'stock' && (
                                <div className="space-y-4">
                                    {inventario.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                            <Package size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>No hay stock registrado en ninguna ubicación</p>
                                        </div>
                                    ) : (
                                        inventario.map((inv) => (
                                            <div
                                                key={inv.id}
                                                className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-theme-primary/40 dark:hover:border-theme-primary-dark transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div className="p-2 bg-theme-primary/20 dark:bg-theme-primary-dark/30 rounded-lg">
                                                            <MapPin size={20} className="text-theme-primary dark:text-theme-primary-light" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                                {inv.ubicacion?.nombre}
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                {inv.lote && (
                                                                    <span className="text-gray-600 dark:text-gray-400">
                                    Lote: <span className="font-medium">{inv.lote}</span>
                                  </span>
                                                                )}
                                                                {inv.fecha_caducidad && (
                                                                    <span className="text-gray-600 dark:text-gray-400">
                                    Caduca: <span className="font-medium">
                                      {format(new Date(inv.fecha_caducidad), 'dd/MM/yyyy', { locale: es })}
                                    </span>
                                  </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                            {inv.cantidad_disponible}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">disponible</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Tab: Movimientos */}
                            {activeTab === 'movimientos' && (
                                <div className="space-y-3">
                                    {movimientos.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                            <Clock size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>No hay movimientos registrados</p>
                                        </div>
                                    ) : (
                                        movimientos.map((mov) => (
                                            <div
                                                key={mov.id}
                                                className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        mov.tipo_movimiento === 'entrada'
                                                            ? 'bg-green-100 dark:bg-green-900/30'
                                                            : mov.tipo_movimiento === 'salida'
                                                                ? 'bg-red-100 dark:bg-red-900/30'
                                                                : 'bg-blue-100 dark:bg-blue-900/30'
                                                    }`}>
                                                        {mov.tipo_movimiento === 'entrada' ? (
                                                            <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <TrendingDown size={18} className="text-red-600 dark:text-red-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-1">
                                                            <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                                  {mov.tipo_movimiento}
                                </span>
                                                                <span className="text-gray-600 dark:text-gray-400 ml-2">
                                  {mov.cantidad > 0 ? '+' : ''}{mov.cantidad} unidades
                                </span>
                                                            </div>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(mov.created_at), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                              </span>
                                                        </div>
                                                        {(mov.ubicacion_origen || mov.ubicacion_destino) && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {mov.ubicacion_origen && `De: ${mov.ubicacion_origen.nombre}`}
                                                                {mov.ubicacion_origen && mov.ubicacion_destino && ' → '}
                                                                {mov.ubicacion_destino && `A: ${mov.ubicacion_destino.nombre}`}
                                                            </p>
                                                        )}
                                                        {mov.notas && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                {mov.notas}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}