// components/shared/StockLevel.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStockLevel } from '@/hooks/useStockLevel';

export function StockLevel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<SVGCircleElement>(null);
    const [animatedProgress, setAnimatedProgress] = useState(0);

    const { stockLevel, loading, error } = useStockLevel();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
            );

            // Animate progress counter
            if (!loading && !error) {
                gsap.to({ val: 0 }, {
                    val: stockLevel.percentage,
                    duration: 2,
                    delay: 0.5,
                    ease: 'power2.out',
                    onUpdate: function() {
                        setAnimatedProgress(Math.floor(this.targets()[0].val));
                    }
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [stockLevel, loading, error]);

    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (animatedProgress / 100) * circumference;

    // Determinar color basado en el porcentaje
    const getColorScheme = () => {
        if (animatedProgress >= 70) {
            return {
                gradient: 'emeraldGradient',
                text: 'text-green-600 dark:text-green-400',
                icon: CheckCircle,
                status: 'Excelente',
                statusColor: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
            };
        } else if (animatedProgress >= 40) {
            return {
                gradient: 'orangeGradient',
                text: 'text-orange-600 dark:text-orange-400',
                icon: TrendingUp,
                status: 'Aceptable',
                statusColor: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
            };
        } else {
            return {
                gradient: 'redGradient',
                text: 'text-red-600 dark:text-red-400',
                icon: AlertTriangle,
                status: 'Crítico',
                statusColor: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
            };
        }
    };

    const colorScheme = getColorScheme();
    const StatusIcon = colorScheme.icon;

    // Loading state
    if (loading) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <h3 className="mb-4 text-gray-900 dark:text-gray-100">Nivel de Stock Global</h3>
                <div className="flex items-center justify-center h-60">
                    <div className="animate-spin w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-red-200 dark:border-red-700 shadow-lg">
                <h3 className="mb-4 text-gray-900 dark:text-gray-100">Nivel de Stock Global</h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-theme-primary/10 transition-all">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900 dark:text-gray-100">Nivel de Stock Global</h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorScheme.statusColor}`}>
          {colorScheme.status}
        </span>
            </div>

            <div className="relative flex items-center justify-center mb-6">
                <svg className="w-48 h-48 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="70"
                        fill="none"
                        className="stroke-gray-200 dark:stroke-gray-700"
                        strokeWidth="16"
                    />
                    {/* Progress circle */}
                    <circle
                        ref={circleRef}
                        cx="96"
                        cy="96"
                        r="70"
                        fill="none"
                        stroke={`url(#${colorScheme.gradient})`}
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                    <defs>
                        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#059669" />
                            <stop offset="50%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ea580c" />
                            <stop offset="50%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#fb923c" />
                        </linearGradient>
                        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#dc2626" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#f87171" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <StatusIcon className={`${colorScheme.text} mb-2`} size={24} />
                    <div className={`text-4xl font-bold ${colorScheme.text}`}>{animatedProgress}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stock Disponible</div>
                </div>
            </div>

            {/* Stats detalladas */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Disponible</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {stockLevel.totalDisponible.toLocaleString()}
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Capacidad</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {stockLevel.totalCapacidad.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Indicadores de estado */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                        <span className="text-gray-600 dark:text-gray-400">Óptimo</span>
                    </div>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">
            {stockLevel.totalDisponible - stockLevel.stockBajo - stockLevel.stockCritico}
          </span>
                </div>

                {stockLevel.stockBajo > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span className="text-gray-600 dark:text-gray-400">Bajo</span>
                        </div>
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
              {stockLevel.stockBajo}
            </span>
                    </div>
                )}

                {stockLevel.stockCritico > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-gray-600 dark:text-gray-400">Crítico</span>
                        </div>
                        <span className="text-red-600 dark:text-red-400 font-semibold">
              {stockLevel.stockCritico}
            </span>
                    </div>
                )}
            </div>
        </div>
    );
}