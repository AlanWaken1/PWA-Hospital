// hooks/useAnalytics.ts - CORREGIDO con nombres de tablas correctos
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AnalyticsData {
    // Métricas generales
    totalMovimientos: number;
    totalEntradas: number;
    totalSalidas: number;
    costoTotal: number;
    valorActual: number;

    // Tendencias mensuales (últimos 6 meses)
    tendenciaMensual: {
        mes: string;
        entradas: number;
        salidas: number;
        costo: number;
    }[];

    // Top productos
    topMasUsados: {
        id: string;
        nombre: string;
        codigo: string;
        cantidad: number;
        porcentaje: number;
    }[];

    topMasCaros: {
        id: string;
        nombre: string;
        codigo: string;
        valor: number;
        cantidad: number;
    }[];

    topBajoStock: {
        id: string;
        nombre: string;
        codigo: string;
        cantidad: number;
        minimo: number;
        porcentaje: number;
    }[];

    // Distribución por categoría
    distribucionCategorias: {
        categoria: string;
        cantidad: number;
        valor: number;
        porcentaje: number;
    }[];

    // Análisis temporal
    actividadPorDia: {
        dia: string;
        movimientos: number;
    }[];

    // Predicciones
    predicciones: {
        productoId: string;
        nombre: string;
        diasRestantes: number;
        promedioUso: number;
        mensaje: string;
        tipo: 'critico' | 'advertencia' | 'normal';
    }[];
}

export function useAnalytics(diasAtras: number = 30) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, [diasAtras]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const supabase = createClient();

            // Fecha de inicio
            const fechaInicio = new Date();
            fechaInicio.setDate(fechaInicio.getDate() - diasAtras);
            const fechaInicioStr = fechaInicio.toISOString();

            // 1. MÉTRICAS GENERALES
            // CORREGIDO: tabla = "movimientos", campo = "tipo_movimiento"
            const { data: movimientos, error: errorMovimientos } = await supabase
                .from('movimientos')
                .select('tipo_movimiento, cantidad, costo_unitario, created_at')
                .gte('created_at', fechaInicioStr);

            if (errorMovimientos) throw errorMovimientos;

            const totalMovimientos = movimientos?.length || 0;
            const totalEntradas = movimientos?.filter(m => m.tipo_movimiento === 'entrada').length || 0;
            const totalSalidas = movimientos?.filter(m => m.tipo_movimiento === 'salida').length || 0;
            const costoTotal = movimientos?.reduce((acc, m) =>
                acc + (m.costo_unitario || 0) * (m.cantidad || 0), 0) || 0;

            // 2. VALOR ACTUAL DEL INVENTARIO
            // CORREGIDO: campo = "cantidad_disponible"
            const { data: inventario, error: errorInventario } = await supabase
                .from('inventario')
                .select('cantidad_disponible, costo_unitario')
                .eq('esta_activo', true);

            if (errorInventario) throw errorInventario;

            const valorActual = inventario?.reduce((acc, inv) =>
                acc + (inv.cantidad_disponible || 0) * (inv.costo_unitario || 0), 0) || 0;

            // 3. TENDENCIA MENSUAL (últimos 6 meses)
            const fechaInicio6Meses = new Date();
            fechaInicio6Meses.setMonth(fechaInicio6Meses.getMonth() - 6);

            const { data: movimientos6Meses, error: errorMov6 } = await supabase
                .from('movimientos')
                .select('tipo_movimiento, cantidad, costo_unitario, created_at')
                .gte('created_at', fechaInicio6Meses.toISOString())
                .order('created_at', { ascending: true });

            if (errorMov6) throw errorMov6;

            // Agrupar por mes
            const mesesMap = new Map<string, { entradas: number; salidas: number; costo: number }>();

            movimientos6Meses?.forEach(mov => {
                const fecha = new Date(mov.created_at);
                const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

                if (!mesesMap.has(mesKey)) {
                    mesesMap.set(mesKey, { entradas: 0, salidas: 0, costo: 0 });
                }

                const mes = mesesMap.get(mesKey)!;
                const costo = (mov.costo_unitario || 0) * (mov.cantidad || 0);

                if (mov.tipo_movimiento === 'entrada') {
                    mes.entradas += mov.cantidad || 0;
                } else if (mov.tipo_movimiento === 'salida') {
                    mes.salidas += mov.cantidad || 0;
                }
                mes.costo += costo;
            });

            // Convertir a array y formatear
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const tendenciaMensual = Array.from(mesesMap.entries())
                .map(([key, value]) => {
                    const [año, mes] = key.split('-');
                    const mesNum = parseInt(mes) - 1;
                    return {
                        mes: `${meses[mesNum]} ${año.slice(2)}`,
                        entradas: value.entradas,
                        salidas: value.salidas,
                        costo: Math.round(value.costo)
                    };
                })
                .slice(-6); // Últimos 6 meses

            // 4. TOP PRODUCTOS MÁS USADOS (por salidas)
            const { data: topUsados, error: errorTopUsados } = await supabase
                .from('movimientos')
                .select(`
          producto_id,
          cantidad,
          productos!inner(id, codigo, nombre)
        `)
                .eq('tipo_movimiento', 'salida')
                .gte('created_at', fechaInicioStr);

            if (errorTopUsados) throw errorTopUsados;

            // Agrupar por producto
            const productosMap = new Map<string, { nombre: string; codigo: string; cantidad: number }>();

            topUsados?.forEach(mov => {
                const prodId = mov.producto_id;
                const producto = (mov as any).productos;

                if (!productosMap.has(prodId)) {
                    productosMap.set(prodId, {
                        nombre: producto?.nombre || 'Sin nombre',
                        codigo: producto?.codigo || 'N/A',
                        cantidad: 0
                    });
                }
                productosMap.get(prodId)!.cantidad += mov.cantidad || 0;
            });

            const totalSalidasNum = Array.from(productosMap.values())
                .reduce((acc, p) => acc + p.cantidad, 0);

            const topMasUsados = Array.from(productosMap.entries())
                .map(([id, data]) => ({
                    id,
                    nombre: data.nombre,
                    codigo: data.codigo,
                    cantidad: data.cantidad,
                    porcentaje: totalSalidasNum > 0 ? Math.round((data.cantidad / totalSalidasNum) * 100) : 0
                }))
                .sort((a, b) => b.cantidad - a.cantidad)
                .slice(0, 10);

            // 5. TOP PRODUCTOS MÁS CAROS (por valor en inventario)
            const { data: productosCostosos, error: errorCostosos } = await supabase
                .from('inventario')
                .select(`
          producto_id,
          cantidad_disponible,
          costo_unitario,
          productos!inner(id, codigo, nombre)
        `)
                .eq('esta_activo', true)
                .order('costo_unitario', { ascending: false })
                .limit(10);

            if (errorCostosos) throw errorCostosos;

            const topMasCaros = productosCostosos?.map(inv => {
                const producto = (inv as any).productos;
                return {
                    id: producto?.id || '',
                    nombre: producto?.nombre || 'Sin nombre',
                    codigo: producto?.codigo || 'N/A',
                    valor: Math.round((inv.costo_unitario || 0) * (inv.cantidad_disponible || 0)),
                    cantidad: inv.cantidad_disponible || 0
                };
            }) || [];

            // 6. PRODUCTOS CON BAJO STOCK
            const { data: bajoStock, error: errorBajoStock } = await supabase
                .from('inventario')
                .select(`
          producto_id,
          cantidad_disponible,
          productos!inner(id, codigo, nombre, stock_minimo)
        `)
                .eq('esta_activo', true);

            if (errorBajoStock) throw errorBajoStock;

            const topBajoStock = bajoStock
                ?.filter(inv => {
                    const producto = (inv as any).productos;
                    const stockMin = producto?.stock_minimo || 10;
                    return inv.cantidad_disponible <= stockMin;
                })
                .map(inv => {
                    const producto = (inv as any).productos;
                    const stockMin = producto?.stock_minimo || 10;
                    const porcentaje = Math.round((inv.cantidad_disponible / stockMin) * 100);
                    return {
                        id: producto?.id || '',
                        nombre: producto?.nombre || 'Sin nombre',
                        codigo: producto?.codigo || 'N/A',
                        cantidad: inv.cantidad_disponible || 0,
                        minimo: stockMin,
                        porcentaje
                    };
                })
                .sort((a, b) => a.porcentaje - b.porcentaje)
                .slice(0, 10) || [];

            // 7. DISTRIBUCIÓN POR CATEGORÍA
            const { data: categorias, error: errorCat } = await supabase
                .from('productos')
                .select(`
          id,
          categoria_id,
          categorias!inner(nombre),
          inventario!inner(cantidad_disponible, costo_unitario)
        `)
                .eq('esta_activo', true);

            if (errorCat) throw errorCat;

            const catMap = new Map<string, { cantidad: number; valor: number }>();

            categorias?.forEach(prod => {
                const categoria = (prod as any).categorias;
                const catNombre = categoria?.nombre || 'Sin categoría';

                if (!catMap.has(catNombre)) {
                    catMap.set(catNombre, { cantidad: 0, valor: 0 });
                }

                const cat = catMap.get(catNombre)!;
                const inventarios = (prod as any).inventario;

                if (Array.isArray(inventarios)) {
                    inventarios.forEach((inv: any) => {
                        cat.cantidad += inv.cantidad_disponible || 0;
                        cat.valor += (inv.cantidad_disponible || 0) * (inv.costo_unitario || 0);
                    });
                }
            });

            const totalCantidad = Array.from(catMap.values()).reduce((acc, c) => acc + c.cantidad, 0);

            const distribucionCategorias = Array.from(catMap.entries())
                .map(([categoria, data]) => ({
                    categoria,
                    cantidad: data.cantidad,
                    valor: Math.round(data.valor),
                    porcentaje: totalCantidad > 0 ? Math.round((data.cantidad / totalCantidad) * 100) : 0
                }))
                .sort((a, b) => b.valor - a.valor);

            // 8. ACTIVIDAD POR DÍA (últimos 7 días)
            const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            const actividadMap = new Map<string, number>();

            movimientos?.forEach(mov => {
                const fecha = new Date(mov.created_at);
                const diaKey = diasSemana[fecha.getDay()];
                actividadMap.set(diaKey, (actividadMap.get(diaKey) || 0) + 1);
            });

            const actividadPorDia = diasSemana.map(dia => ({
                dia,
                movimientos: actividadMap.get(dia) || 0
            }));

            // 9. PREDICCIONES (productos que se acabarán pronto)
            const predicciones = topBajoStock.slice(0, 5).map(prod => {
                const diasRestantes = Math.max(1, Math.floor((prod.cantidad / prod.minimo) * 30));
                const promedioUso = Math.ceil(prod.cantidad / diasRestantes);

                let tipo: 'critico' | 'advertencia' | 'normal' = 'normal';
                let mensaje = '';

                if (diasRestantes <= 7) {
                    tipo = 'critico';
                    mensaje = `¡Crítico! Te quedarás sin stock en ${diasRestantes} días`;
                } else if (diasRestantes <= 15) {
                    tipo = 'advertencia';
                    mensaje = `Reabastecer pronto. Stock para ${diasRestantes} días`;
                } else {
                    tipo = 'normal';
                    mensaje = `Stock estable por ${diasRestantes} días`;
                }

                return {
                    productoId: prod.id,
                    nombre: prod.nombre,
                    diasRestantes,
                    promedioUso,
                    mensaje,
                    tipo
                };
            });

            setData({
                totalMovimientos,
                totalEntradas,
                totalSalidas,
                costoTotal,
                valorActual,
                tendenciaMensual,
                topMasUsados,
                topMasCaros,
                topBajoStock,
                distribucionCategorias,
                actividadPorDia,
                predicciones
            });

        } catch (err: any) {
            console.error('Error fetching analytics:', err);
            setError(err.message || 'Error cargando analytics');
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch: fetchAnalytics };
}