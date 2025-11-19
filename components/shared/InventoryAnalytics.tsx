// components/shared/InventoryAnalytics.tsx - HÍBRIDO (divs normales + Framer)
"use client";

import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInventoryAnalytics } from '@/hooks/useInventoryAnalytics';

export function InventoryAnalytics() {
    const barsRef = useRef<(HTMLDivElement | null)[]>([]);
    const controls = useAnimation();

    // Hook para obtener datos reales
    const { data, loading, error } = useInventoryAnalytics();

    // Si no hay datos, usar datos de ejemplo
    const displayData = data.length > 0 ? data : [
        { category: 'Medicamentos', value: 85, color: 'linear-gradient(to top, #059669, #10b981)', count: 0 },
        { category: 'Equipos', value: 65, color: 'linear-gradient(to top, #7c3aed, #8b5cf6)', count: 0 },
        { category: 'Insumos', value: 45, color: 'linear-gradient(to top, #e11d48, #f43f5e)', count: 0 },
    ];

    const maxValue = Math.max(...displayData.map(d => d.value));

    // Animar barras cuando carguen
    useEffect(() => {
        const animateBars = async () => {
            // Primero hacer fade in del contenedor
            await controls.start({ opacity: 1, y: 0 });

            // Luego animar cada barra
            barsRef.current.forEach((bar, index) => {
                if (bar) {
                    bar.style.transformOrigin = 'bottom';
                    bar.style.transform = 'scaleY(0)';

                    setTimeout(() => {
                        if (bar) {
                            bar.style.transition = 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
                            bar.style.transform = 'scaleY(1)';
                        }
                    }, 300 + index * 100);
                }
            });
        };

        if (displayData.length > 0) {
            animateBars();
        }
    }, [displayData, controls]);

    // Loading state
    if (loading) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-theme-primary/10 transition-all">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 dark:text-gray-100">Análisis de Inventario por Categoría</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Cargando...</div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-red-200 dark:border-red-700 shadow-lg">
                <h3 className="text-gray-900 dark:text-gray-100 mb-4">Análisis de Inventario por Categoría</h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-theme-primary/10 transition-all"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-gray-900 dark:text-gray-100">Análisis de Inventario por Categoría</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {displayData.reduce((acc, item) => acc + item.count, 0)} productos totales
                    </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Nivel de Stock (%)</div>
            </div>

            <div className="flex items-end justify-between gap-4 h-64">
                {displayData.map((item, index) => {
                    const barHeight = (item.value / maxValue) * 100;

                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-3 h-full"
                        >
                            <div className="w-full flex-1 flex items-end justify-center relative group">
                                {/* ⭐ DIV NORMAL (como GSAP) - NO motion.div */}
                                <div
                                    ref={(el) => { barsRef.current[index] = el; }}
                                    className="w-full rounded-xl shadow-lg transition-all cursor-pointer hover:scale-105 hover:shadow-2xl"
                                    style={{
                                        height: `${barHeight}%`,
                                        background: item.color, // ⭐ EXACTAMENTE IGUAL QUE GSAP
                                    }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
                                        <div className="font-semibold">{item.value}% Stock</div>
                                        <div className="text-gray-300">{item.count} productos</div>
                                    </div>
                                </div>
                            </div>

                            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {item.category}
              </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}