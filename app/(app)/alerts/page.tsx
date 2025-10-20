"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AlertTriangle, Clock, Package, AlertCircle, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Alertas() {
  const titleRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<(HTMLDivElement | null)[]>([]);

  const alerts = [
    {
      id: 1,
      type: 'vencimiento',
      priority: 'alta',
      title: 'Antibióticos Categoría A',
      description: '15 unidades próximas a vencer',
      time: '7 días restantes',
      icon: Clock,
      color: 'red',
    },
    {
      id: 2,
      type: 'stock',
      priority: 'critica',
      title: 'Jeringas desechables 5ml',
      description: 'Stock crítico detectado',
      time: '12 unidades disponibles',
      icon: AlertCircle,
      color: 'red',
    },
    {
      id: 3,
      type: 'stock',
      priority: 'media',
      title: 'Mascarillas N95',
      description: 'Stock bajo el nivel mínimo',
      time: '45 unidades disponibles',
      icon: Package,
      color: 'yellow',
    },
    {
      id: 4,
      type: 'vencimiento',
      priority: 'media',
      title: 'Solución salina',
      description: '30 unidades vencen pronto',
      time: '15 días restantes',
      icon: Clock,
      color: 'yellow',
    },
    {
      id: 5,
      type: 'stock',
      priority: 'media',
      title: 'Termómetros digitales',
      description: 'Reabastecimiento requerido',
      time: '8 unidades disponibles',
      icon: AlertCircle,
      color: 'yellow',
    },
    {
      id: 6,
      type: 'vencimiento',
      priority: 'baja',
      title: 'Vendas elásticas',
      description: 'Revisar fechas de vencimiento',
      time: '30 días restantes',
      icon: Bell,
      color: 'blue',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      alertsRef.current.forEach((alert, index) => {
        if (alert) {
          gsap.fromTo(
            alert,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.6, delay: 0.1 + index * 0.1, ease: 'power2.out' }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colors = {
      red: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800/50' },
      yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800/50' },
      blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/50' },
    };
    return colors[color as keyof typeof colors][variant];
  };

  return (
    <>
      {/* Page Title */}
      <div ref={titleRef} className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100 mb-2">Alertas y Notificaciones</h1>
        <p className="text-gray-500 dark:text-gray-400">Monitorea situaciones críticas y alertas del inventario.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-2xl p-6 text-white shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-red-100">Alertas Críticas</h3>
            <AlertTriangle className="text-white" size={24} />
          </div>
          <div className="text-4xl mb-2">2</div>
          <p className="text-red-200 text-sm">Requieren atención inmediata</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 dark:from-yellow-700 dark:to-yellow-800 rounded-2xl p-6 text-white shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-yellow-100">Prioridad Media</h3>
            <Clock className="text-white" size={24} />
          </div>
          <div className="text-4xl mb-2">4</div>
          <p className="text-yellow-200 text-sm">Revisar próximamente</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-6 text-white shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-blue-100">Informativas</h3>
            <Bell className="text-white" size={24} />
          </div>
          <div className="text-4xl mb-2">6</div>
          <p className="text-blue-200 text-sm">Total de notificaciones</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              ref={(el) => { alertsRef.current[index] = el; }}
              className={`bg-gradient-to-r ${getColorClasses(alert.color, 'bg')} rounded-2xl p-6 border ${getColorClasses(alert.color, 'border')} hover:shadow-lg transition-all cursor-pointer`}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { x: 4, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { x: 0, duration: 0.2 })}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${alert.color === 'red' ? 'bg-red-100 dark:bg-red-900/50' : alert.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/50' : 'bg-blue-100 dark:bg-blue-900/50'} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={getColorClasses(alert.color, 'text')} size={24} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900 dark:text-gray-100 mb-1">{alert.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{alert.description}</p>
                    </div>
                    <Badge className={`${getColorClasses(alert.color, 'bg')} ${getColorClasses(alert.color, 'text')} hover:${getColorClasses(alert.color, 'bg')} capitalize`}>
                      {alert.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                      <Clock size={14} />
                      <span>{alert.time}</span>
                    </div>
                    <button className={`${getColorClasses(alert.color, 'text')} hover:underline text-sm transition-colors`}>
                      Ver detalles →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
