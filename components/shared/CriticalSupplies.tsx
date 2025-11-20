// components/shared/CriticalSupplies.tsx
"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import gsap from 'gsap';
import { Plus, AlertTriangle, TrendingDown, Package2 } from 'lucide-react';
import { useCriticalSupplies } from '@/hooks/useCriticalSupplies';

export function CriticalSupplies() {
    const t = useTranslations('dashboard.critical_supplies');
    const locale = useLocale();
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const router = useRouter();

    const { supplies, loading, error } = useCriticalSupplies();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
            );

            itemsRef.current.forEach((item, index) => {
                if (item) {
                    gsap.fromTo(
                        item,
                        { x: -20, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.5, delay: 0.7 + index * 0.08, ease: 'power2.out' }
                    );
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [supplies]);

    const getStatusConfig = (estado: string) => {
        switch (estado) {
            case 'critico':
                return {
                    bg: 'bg-red-100 dark:bg-red-900/30',
                    text: 'text-red-600 dark:text-red-400',
                    badge: 'bg-red-500',
                    icon: 'text-red-600 dark:text-red-400'
                };
            case 'bajo':
                return {
                    bg: 'bg-orange-100 dark:bg-orange-900/30',
                    text: 'text-orange-600 dark:text-orange-400',
                    badge: 'bg-orange-500',
                    icon: 'text-orange-600 dark:text-orange-400'
                };
            default:
                return {
                    bg: 'bg-blue-100 dark:bg-blue-900/30',
                    text: 'text-blue-600 dark:text-blue-400',
                    badge: 'bg-blue-500',
                    icon: 'text-blue-600 dark:text-blue-400'
                };
        }
    };

    // ✨ FUNCIÓN: Ver todos los suministros críticos en Alertas
    const handleVerTodos = () => {
        router.push(`/${locale}/alerts`);
    };

    // ✨ FUNCIÓN: Click en suministro - va a Inventario
    const handleSupplyClick = () => {
        router.push(`/${locale}/inventory`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col h-[500px]">
                <h3 className="text-gray-900 dark:text-gray-100 mb-6">{t('title')}</h3>
                <div className="flex items-center justify-center flex-1">
                    <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-red-200 dark:border-red-700 shadow-lg flex flex-col h-[500px]">
                <h3 className="text-gray-900 dark:text-gray-100 mb-4">{t('title')}</h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (supplies.length === 0) {
        return (
            <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col h-[500px]">
                <h3 className="text-gray-900 dark:text-gray-100 mb-6">{t('title')}</h3>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Package2 className="text-green-600 dark:text-green-400" size={28} />
                        </div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">{t('healthy_stock')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('no_critical')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-orange-900/20 shadow-lg dark:shadow-orange-500/10 transition-all flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                    <h3 className="text-gray-900 dark:text-gray-100">{t('title')}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {supplies.length} {t('products_need_attention')}
                    </p>
                </div>
                <button
                    onClick={handleVerTodos}
                    className="text-theme-primary dark:text-theme-primary-light text-sm hover:text-theme-primary-dark dark:hover:text-theme-primary transition-colors flex items-center gap-1 bg-theme-primary/10 dark:bg-theme-primary/20 px-3 py-1.5 rounded-lg hover:bg-theme-primary/20 dark:hover:bg-theme-primary/30"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">{t('view_all')}</span>
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
                {supplies.map((supply, index) => {
                    const colors = getStatusConfig(supply.estado);
                    const percentage = supply.stockMinimo > 0
                        ? Math.round((supply.stock / supply.stockMinimo) * 100)
                        : 0;

                    return (
                        <div
                            key={supply.id}
                            ref={(el) => {itemsRef.current[index] = el;}}
                            onClick={handleSupplyClick}
                            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                                    {supply.estado === 'critico' ? (
                                        <AlertTriangle className={colors.icon} size={20} />
                                    ) : (
                                        <TrendingDown className={colors.icon} size={20} />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate group-hover:text-theme-primary dark:group-hover:text-theme-primary-light transition-colors">
                                        {supply.nombre}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {supply.categoria}
                                    </p>
                                </div>

                                <span className={`text-xs font-bold ${colors.text} uppercase tracking-wide flex-shrink-0`}>
                  {t(`status.${supply.estado}`, supply.estado)}
                </span>
                            </div>

                            {/* Stock bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('stock')}: <span className="font-semibold text-gray-900 dark:text-gray-100">{supply.stock}</span> / {supply.stockMinimo}
                  </span>
                                    <span className={`font-bold ${colors.text}`}>
                    {percentage}%
                  </span>
                                </div>

                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            supply.estado === 'critico'
                                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                                : 'bg-gradient-to-r from-orange-500 to-orange-600'
                                        }`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}