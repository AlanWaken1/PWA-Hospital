// app/(app)/dashboard/page.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Plus, Download, Package2, Activity, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import { GradientStatCard } from '@/components/shared/GradientStatCard';
import { InventoryAnalytics } from '@/components/shared/InventoryAnalytics';
import { ExpirationAlerts } from '@/components/shared/ExpirationAlerts';
import { StaffActivity } from '@/components/shared/StaffActivity';
import { CriticalSupplies } from '@/components/shared/CriticalSupplies';
import { StockLevel } from '@/components/shared/StockLevel';
import { RecentMovements } from '@/components/shared/RecentMovements';
import { RegisterEntryModal } from '@/components/inventory/RegisterEntryModal';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { toast } from '@/hooks/use-toast';

export default function Dashboard() {
    const titleRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { stats, loading, error } = useDashboardStats();
    const [isExporting, setIsExporting] = useState(false);
    const [showEntryModal, setShowEntryModal] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power2.out',
            });

            gsap.from(buttonsRef.current, {
                opacity: 0,
                y: 10,
                duration: 0.6,
                delay: 0.2,
                ease: 'power2.out',
            });
        });

        return () => ctx.revert();
    }, []);

    // ✨ FUNCIÓN: Abrir modal de registro
    const handleRegistrarIngreso = () => {
        setShowEntryModal(true);
    };

    // ✨ FUNCIÓN: Exportar Reporte del Dashboard
    const handleExportarReporte = async () => {
        setIsExporting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const reportData = {
                fecha: new Date().toLocaleDateString('es-MX'),
                stats: stats,
                titulo: 'Reporte Dashboard - Inventario Hospitalario'
            };

            const dataStr = JSON.stringify(reportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dashboard-${new Date().getTime()}.json`;
            link.click();
            URL.revokeObjectURL(url);

            // @ts-ignore
            toast({
                title: "✅ Reporte exportado",
                description: "El reporte del dashboard se descargó exitosamente",
            });
        } catch (error) {
            // @ts-ignore
            toast({
                title: "❌ Error",
                description: "No se pudo exportar el reporte",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    // ✨ FUNCIÓN: Click en stats cards
    const handleStatClick = (type: string) => {
        switch(type) {
            case 'total':
                router.push('/inventory');
                break;
            case 'bajo':
            case 'critico':
                router.push('/alerts');
                break;
            case 'valor':
                router.push('/reports');
                break;
        }
    };

    return (
        <>
            {/* Dashboard Title */}
            <div ref={titleRef} className="mb-6">
                <h1 className="text-gray-900 dark:text-gray-100 mb-2">Panel de Control - Inventario Hospitalario</h1>
                <p className="text-gray-500 dark:text-gray-400">Gestiona y monitorea el inventario médico de forma eficiente y segura.</p>
            </div>

            {/* Action Buttons */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                    onClick={handleRegistrarIngreso}
                    disabled={loading}
                    className="bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white px-6 py-2.5 rounded-xl shadow-lg shadow-theme-primary/30 flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:shadow-theme-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    onMouseEnter={(e) => !loading && gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                >
                    <Plus size={20} />
                    <span>Registrar Ingreso</span>
                </button>

                <button
                    onClick={handleExportarReporte}
                    disabled={isExporting || loading}
                    className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onMouseEnter={(e) => !isExporting && gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                >
                    {isExporting ? (
                        <>
                            <div className="animate-spin w-4 h-4 border-2 border-gray-700 dark:border-gray-200 border-t-transparent rounded-full" />
                            <span>Exportando...</span>
                        </>
                    ) : (
                        <>
                            <Download size={18} />
                            <span>Exportar Reporte</span>
                        </>
                    )}
                </button>

                {/* Botón Reportes */}
                <button
                    onClick={() => router.push('/reports')}
                    className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                >
                    <FileText size={18} />
                    <span className="hidden sm:inline">Reportes</span>
                </button>
            </div>

            {/* Stats Grid - CON CLICKS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div onClick={() => handleStatClick('total')} className="cursor-pointer">
                    <GradientStatCard
                        title="Total de Productos"
                        value={loading ? "..." : stats.totalProductos.toLocaleString()}
                        trend="+8.2% vs mes anterior"
                        icon={Package2}
                        gradientFrom="from-theme-primary"
                        gradientTo="to-theme-primary-dark"
                        delay={0.1}
                    />
                </div>

                <div onClick={() => handleStatClick('bajo')} className="cursor-pointer">
                    <GradientStatCard
                        title="Stock Bajo"
                        value={loading ? "..." : stats.stockBajo.toString()}
                        trend="Requieren reabastecimiento"
                        trendType="down"
                        icon={AlertTriangle}
                        gradientFrom="from-orange-600"
                        gradientTo="to-red-700"
                        delay={0.2}
                    />
                </div>

                <div onClick={() => handleStatClick('critico')} className="cursor-pointer">
                    <GradientStatCard
                        title="Stock Crítico"
                        value={loading ? "..." : stats.stockCritico.toString()}
                        trend="Atención inmediata"
                        trendType="down"
                        icon={Activity}
                        gradientFrom="from-red-600"
                        gradientTo="to-red-800"
                        delay={0.3}
                    />
                </div>

                <div onClick={() => handleStatClick('valor')} className="cursor-pointer">
                    <GradientStatCard
                        title="Valor Total"
                        value={loading ? "..." : `$${(stats.valorTotal / 1000000).toFixed(1)}M`}
                        trend={loading ? "..." : `${stats.movimientosHoy} movimientos hoy`}
                        icon={TrendingUp}
                        gradientFrom="from-purple-600"
                        gradientTo="to-purple-800"
                        delay={0.4}
                    />
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <InventoryAnalytics />
                    <StaffActivity />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4 sm:gap-6">
                    <ExpirationAlerts />
                    <CriticalSupplies />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
                <StockLevel />
                <div className="lg:col-span-2">
                    <RecentMovements />
                </div>
            </div>

            {/* Modal de Registro */}
            <RegisterEntryModal
                isOpen={showEntryModal}
                onClose={() => setShowEntryModal(false)}
                onSuccess={() => {
                    // @ts-ignore
                    toast({
                        title: "✅ Entrada registrada",
                        description: "El producto se agregó correctamente al inventario",
                    });
                    // Aquí podrías refrescar los datos si es necesario
                }}
            />
        </>
    );
}