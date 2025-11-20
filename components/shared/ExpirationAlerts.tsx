// components/shared/ExpirationAlerts.tsx
"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import gsap from 'gsap';
import { AlertCircle, Clock, Package, ChevronRight } from 'lucide-react';
import { useExpirationAlerts } from '@/hooks/useExpirationAlerts';

export function ExpirationAlerts() {
    const t = useTranslations('dashboard.expiration_alerts');
    const locale = useLocale();
    const containerRef = useRef<HTMLDivElement>(null);
    const pulseRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const router = useRouter();

    const { alerts, loading, error } = useExpirationAlerts();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)' }
            );

            if (pulseRef.current && alerts.length > 0) {
                gsap.to(pulseRef.current, {
                    scale: 1.3,
                    opacity: 0,
                    duration: 1.5,
                    repeat: -1,
                    ease: 'power1.out',
                });
            }

            itemsRef.current.forEach((item, index) => {
                if (item) {
                    gsap.fromTo(
                        item,
                        { x: -20, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.5, delay: 0.3 + index * 0.1, ease: 'power2.out' }
                    );
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [alerts]);

    // ✨ FUNCIÓN: Ver todas las alertas
    const handleVerTodos = () => {
        router.push(`/${locale}/alerts`);
    };

    // ✨ FUNCIÓN: Click en alerta - va a la página de alertas
    const handleAlertClick = () => {
        router.push(`/${locale}/alerts`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg h-[500px] flex flex-col">
                <h3 className="mb-4 text-gray-900 dark:text-gray-100">{t('title')}</h3>
                <div className="flex items-center justify-center flex-1">
                    <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-red-200 dark:border-red-700 shadow-lg h-[500px] flex flex-col">
                <h3 className="mb-4 text-gray-900 dark:text-gray-100">{t('title')}</h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (alerts.length === 0) {
        return (
            <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg h-[500px] flex flex-col">
                <h3 className="mb-4 text-gray-900 dark:text-gray-100">{t('title')}</h3>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center flex-1 flex items-center justify-center">
                    <div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Clock className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">{t('all_good')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('no_expiring')}</p>
                    </div>
                </div>
            </div>
        );
    }

    const mostUrgent = alerts[0];
    const otherAlerts = alerts.slice(1);

    return (
        <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-red-900/20 shadow-lg dark:shadow-red-500/10 transition-all flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-gray-900 dark:text-gray-100">{t('title')}</h3>
                <button
                    onClick={handleVerTodos}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                    {t('view_all')} ({alerts.length})
                </button>
            </div>

            {/* Most urgent alert - clickeable */}
            <div
                onClick={handleAlertClick}
                className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800/50 relative overflow-hidden backdrop-blur-sm mb-3 flex-shrink-0 cursor-pointer hover:shadow-md transition-all group"
            >
                <div
                    ref={pulseRef}
                    className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"
                ></div>

                <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-1 truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                            {mostUrgent.producto}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <Package size={14} />
                            <span>{mostUrgent.unidades} {t('units')} • {t('lot')} {mostUrgent.lote}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <Clock size={14} />
                        <span className="font-semibold">
                            {mostUrgent.diasRestantes === 0
                                ? t('expires_today')
                                : t('expires_in_days', { days: mostUrgent.diasRestantes })
                            }
                        </span>
                    </div>
                    <ChevronRight size={16} className="text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            {/* Other alerts - lista clickeable */}
            {otherAlerts.length > 0 && (
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
                    <div className="space-y-2">
                        {otherAlerts.map((alert, index) => (
                            <div
                                key={index}
                                ref={(el) => {itemsRef.current[index] = el;}}
                                onClick={handleAlertClick}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                        alert.diasRestantes <= 7 ? 'bg-red-500' : 'bg-orange-500'
                                    }`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                            {alert.producto}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {alert.unidades} {t('units_short')} • {alert.diasRestantes} {t('days')}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}