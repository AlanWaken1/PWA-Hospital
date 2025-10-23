"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plus, Download, Package2, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { GradientStatCard } from '@/components/shared/GradientStatCard';
import { InventoryAnalytics } from '@/components/shared/InventoryAnalytics';
import { ExpirationAlerts } from '@/components/shared/ExpirationAlerts';
import { StaffActivity } from '@/components/shared/StaffActivity';
import { CriticalSupplies } from '@/components/shared/CriticalSupplies';
import { StockLevel } from '@/components/shared/StockLevel';
import { RecentMovements } from '@/components/shared/RecentMovements';

export default function Dashboard() {
  const titleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

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
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
        >
          <Plus size={20} />
          <span>Registrar Ingreso</span>
        </button>
        <button
          className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
        >
          <Download size={18} />
          <span>Exportar Reporte</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GradientStatCard 
          title="Total de Productos" 
          value="1,248" 
          trend="+8.2% vs mes anterior" 
          icon={Package2}
          gradientFrom="from-emerald-600"
          gradientTo="to-emerald-800"
          delay={0.1} 
        />
        <GradientStatCard 
          title="Stock Bajo" 
          value="45" 
          trend="Requieren reabastecimiento" 
          trendType="down"
          icon={AlertTriangle}
          gradientFrom="from-orange-600"
          gradientTo="to-red-700"
          delay={0.2} 
        />
        <GradientStatCard 
          title="En Uso" 
          value="856" 
          trend="+12.5% vs semana anterior" 
          icon={Activity}
          gradientFrom="from-blue-600"
          gradientTo="to-blue-800"
          delay={0.3} 
        />
        <GradientStatCard 
          title="Valor Total" 
          value="2.4M" 
          trend="+5.8% este mes" 
          icon={TrendingUp}
          gradientFrom="from-purple-600"
          gradientTo="to-purple-800"
          delay={0.4} 
        />
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
    </>
  );
}
