// components/shared/RecentMovements.tsx
"use client";

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ArrowUpRight, ArrowDownRight, RefreshCw, ArrowRightLeft, Package, User, MapPin } from 'lucide-react';
import { useRecentMovements } from '@/hooks/useRecentMovements';

export function RecentMovements() {
    const t = useTranslations('movements');
    const containerRef = useRef<HTMLDivElement>(null);
    const movementsRef = useRef<(HTMLDivElement | null)[]>([]);

    const { movements, loading, error } = useRecentMovements(4);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
            );

            movementsRef.current.forEach((movement, index) => {
                if (movement) {
                    gsap.fromTo(
                        movement,
                        { opacity: 0, x: -20 },
                        { opacity: 1, x: 0, duration: 0.5, delay: 0.2 + index * 0.1, ease: 'power2.out' }
                    );
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [movements]);

    const getMovementConfig = (type: string) => {
        switch (type) {
            case 'entrada':
                return {
                    icon: ArrowUpRight,
                    color: 'text-green-600 dark:text-green-400',
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-200 dark:border-green-800/50',
                    label: t('types.entry'),
                    badgeBg: 'bg-green-500'
                };
            case 'salida':
                return {
                    icon: ArrowDownRight,
                    color: 'text-red-600 dark:text-red-400',
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    border: 'border-red-200 dark:border-red-800/50',
                    label: t('types.exit'),
                    badgeBg: 'bg-red-500'
                };
            case 'transferencia':
                return {
                    icon: ArrowRightLeft,
                    color: 'text-blue-600 dark:text-blue-400',
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-200 dark:border-blue-800/50',
                    label: t('types.transfer'),
                    badgeBg: 'bg-blue-500'
                };
            case 'ajuste':
                return {
                    icon: RefreshCw,
                    color: 'text-purple-600 dark:text-purple-400',
                    bg: 'bg-purple-50 dark:bg-purple-900/20',
                    border: 'border-purple-200 dark:border-purple-800/50',
                    label: t('types.adjustment'),
                    badgeBg: 'bg-purple-500'
                };
            default:
                return {
                    icon: Package,
                    color: 'text-gray-600 dark:text-gray-400',
                    bg: 'bg-gray-50 dark:bg-gray-900/20',
                    border: 'border-gray-200 dark:border-gray-800/50',
                    label: t('types.movement'),
                    badgeBg: 'bg-gray-500'
                };
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-theme-primary via-theme-primary to-theme-primary-dark dark:from-theme-primary-dark dark:via-theme-primary-dark dark:to-theme-primary-dark rounded-2xl p-6 text-white shadow-xl shadow-theme-primary/30 dark:shadow-theme-primary/20 relative overflow-hidden">
                <h3 className="text-white mb-6">{t('recent')}</h3>
                <div className="flex items-center justify-center h-60">
                    <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-white mb-4">{t('recent')}</h3>
                <div className="bg-red-900/30 p-4 rounded-xl">
                    <p className="text-red-100 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (movements.length === 0) {
        return (
            <div ref={containerRef} className="bg-gradient-to-br from-theme-primary via-theme-primary to-theme-primary-dark dark:from-theme-primary-dark dark:via-theme-primary-dark dark:to-theme-primary-dark rounded-2xl p-6 text-white shadow-xl shadow-theme-primary/30 dark:shadow-theme-primary/20 relative overflow-hidden">
                <h3 className="text-white mb-6">{t('recent')}</h3>
                <div className="flex items-center justify-center h-60">
                    <div className="text-center">
                        <Package className="w-16 h-16 text-white/50 mx-auto mb-3" />
                        <p className="text-white/80">{t('no_movements')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="bg-gradient-to-br from-theme-primary via-theme-primary to-theme-primary-dark dark:from-theme-primary-dark dark:via-theme-primary-dark dark:to-theme-primary-dark rounded-2xl p-6 text-white shadow-xl shadow-theme-primary/30 dark:shadow-theme-primary/20 relative overflow-hidden transition-all">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-1">{t('recent')}</h3>
                        <p className="text-white/70 text-sm">{t('recent_subtitle')}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {movements.map((movement, index) => {
                        const config = getMovementConfig(movement.type);
                        const Icon = config.icon;
                        const isPositive = movement.type === 'entrada';

                        return (
                            <div
                                key={movement.id}
                                ref={(el) => {movementsRef.current[index] = el;}}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={config.color} size={24} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-semibold mb-1 truncate">
                                                    {movement.item}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-white/70">
                                                    <User size={12} />
                                                    <span className="truncate">{movement.usuario}</span>
                                                </div>
                                            </div>

                                            {/* Quantity badge */}
                                            <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${config.bg} border ${config.border} flex-shrink-0`}>
                        <span className={`text-sm font-bold ${config.color}`}>
                          {isPositive ? '+' : ''}{movement.quantity}
                        </span>
                                            </div>
                                        </div>

                                        {/* Footer info */}
                                        <div className="flex items-center justify-between text-xs text-white/60">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                <span className="truncate">{movement.ubicacion}</span>
                                            </div>
                                            <span className="flex-shrink-0">{movement.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}