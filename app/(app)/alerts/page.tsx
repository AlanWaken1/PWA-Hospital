// app/(app)/alerts/page.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AlertTriangle, Clock, Package, AlertCircle, Bell, Check, X, Loader2, Filter, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAlerts } from '@/hooks/useAlerts';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Alertas() {
    const titleRef = useRef<HTMLDivElement>(null);
    const alertsRef = useRef<(HTMLDivElement | null)[]>([]);

    const { alertas, loading, marcarComoLeida, marcarTodasComoLeidas, eliminarAlerta, getStats } = useAlerts();
    const [filtroSeveridad, setFiltroSeveridad] = useState<string>('all');
    const [filtroLeida, setFiltroLeida] = useState<string>('all');

    const stats = getStats();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
        });

        return () => ctx.revert();
    }, []);

    // Animar alertas cuando cambien
    useEffect(() => {
        if (!loading && alertas.length > 0) {
            alertsRef.current.forEach((alert, index) => {
                if (alert) {
                    gsap.fromTo(
                        alert,
                        { opacity: 0, x: -30 },
                        { opacity: 1, x: 0, duration: 0.6, delay: index * 0.05, ease: 'power2.out' }
                    );
                }
            });
        }
    }, [loading, alertas]);

    const getIconBySeveridad = (severidad: string, tipo: string) => {
        if (tipo === 'caducidad_proxima' || tipo === 'caducado') return Clock;
        if (tipo === 'stock_critico') return AlertCircle;
        if (tipo === 'stock_bajo') return Package;
        if (tipo === 'punto_reorden') return AlertTriangle;
        return Bell;
    };

    const getColorBySeveridad = (severidad: string) => {
        switch (severidad) {
            case 'critical':
            case 'error':
                return 'red';
            case 'warning':
                return 'yellow';
            case 'info':
                return 'blue';
            default:
                return 'blue';
        }
    };

    const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
        const colors = {
            red: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800/50' },
            yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800/50' },
            blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/50' },
        };
        return colors[color as keyof typeof colors][variant];
    };

    const getPriorityLabel = (severidad: string) => {
        switch (severidad) {
            case 'critical':
                return 'Crítica';
            case 'error':
                return 'Alta';
            case 'warning':
                return 'Media';
            case 'info':
                return 'Baja';
            default:
                return 'Info';
        }
    };

    // Filtrar alertas
    const alertasFiltradas = alertas.filter(alerta => {
        const matchSeveridad = filtroSeveridad === 'all' || alerta.severidad === filtroSeveridad;
        const matchLeida =
            filtroLeida === 'all' ||
            (filtroLeida === 'leidas' && alerta.leida) ||
            (filtroLeida === 'no_leidas' && !alerta.leida);
        return matchSeveridad && matchLeida;
    });

    const handleMarcarLeida = async (e: React.MouseEvent, alertaId: string) => {
        e.stopPropagation();
        await marcarComoLeida(alertaId);
    };

    const handleEliminar = async (e: React.MouseEvent, alertaId: string) => {
        e.stopPropagation();
        await eliminarAlerta(alertaId);
    };

    return (
        <>
            {/* Page Title */}
            <div ref={titleRef} className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-gray-900 dark:text-gray-100 mb-2">Alertas y Notificaciones</h1>
                        <p className="text-gray-500 dark:text-gray-400">Monitorea situaciones críticas y alertas del inventario.</p>
                    </div>
                    {stats.noLeidas > 0 && (
                        <button
                            onClick={() => marcarTodasComoLeidas()}
                            className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition-colors text-sm"
                        >
                            <CheckCircle2 size={16} />
                            Marcar todas como leídas
                        </button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <div className="bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-2xl p-6 text-white shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-red-100">Alertas Críticas</h3>
                        <AlertTriangle className="text-white" size={24} />
                    </div>
                    <div className="text-4xl mb-2">{stats.criticas + stats.altas}</div>
                    <p className="text-red-200 text-sm">Requieren atención inmediata</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 dark:from-yellow-700 dark:to-yellow-800 rounded-2xl p-6 text-white shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-yellow-100">Prioridad Media</h3>
                        <Clock className="text-white" size={24} />
                    </div>
                    <div className="text-4xl mb-2">{stats.medias}</div>
                    <p className="text-yellow-200 text-sm">Revisar próximamente</p>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-6 text-white shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-blue-100">Sin Leer</h3>
                        <Bell className="text-white" size={24} />
                    </div>
                    <div className="text-4xl mb-2">{stats.noLeidas}</div>
                    <p className="text-blue-200 text-sm">De {stats.total} totales</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Filtros:</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFiltroSeveridad('all')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                filtroSeveridad === 'all'
                                    ? 'bg-theme-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFiltroSeveridad('critical')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                filtroSeveridad === 'critical'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            Críticas
                        </button>
                        <button
                            onClick={() => setFiltroSeveridad('warning')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                filtroSeveridad === 'warning'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            Medias
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:ml-auto">
                        <button
                            onClick={() => setFiltroLeida('all')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                filtroLeida === 'all'
                                    ? 'bg-theme-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFiltroLeida('no_leidas')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                filtroLeida === 'no_leidas'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            Sin leer
                        </button>
                        <button
                            onClick={() => setFiltroLeida('leidas')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                filtroLeida === 'leidas'
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            Leídas
                        </button>
                    </div>
                </div>
            </div>

            {/* Alerts List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-theme-primary animate-spin" />
                </div>
            ) : alertasFiltradas.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                    <Bell size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                        {alertas.length === 0 ? 'No hay alertas' : 'No hay alertas con estos filtros'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        {alertas.length === 0 ? '¡Todo está en orden!' : 'Prueba cambiando los filtros'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {alertasFiltradas.map((alerta, index) => {
                        const Icon = getIconBySeveridad(alerta.severidad, alerta.tipo);
                        const color = getColorBySeveridad(alerta.severidad);

                        return (
                            <div
                                key={alerta.id}
                                ref={(el) => { alertsRef.current[index] = el; }}
                                className={`relative bg-gradient-to-r ${getColorClasses(color, 'bg')} rounded-2xl p-6 border ${getColorClasses(color, 'border')} hover:shadow-lg transition-all ${
                                    alerta.leida ? 'opacity-60' : ''
                                }`}
                            >
                                {/* Indicador de no leída */}
                                {!alerta.leida && (
                                    <div className="absolute top-4 right-4 w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                                )}

                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 ${
                                        color === 'red' ? 'bg-red-100 dark:bg-red-900/50' :
                                            color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                                                'bg-blue-100 dark:bg-blue-900/50'
                                    } rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={getColorClasses(color, 'text')} size={24} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-gray-900 dark:text-gray-100 font-medium">
                                                        {alerta.titulo}
                                                    </h3>
                                                    <Badge className={`${getColorClasses(color, 'bg')} ${getColorClasses(color, 'text')} hover:${getColorClasses(color, 'bg')} capitalize text-xs`}>
                                                        {getPriorityLabel(alerta.severidad)}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300">{alerta.mensaje}</p>
                                                {alerta.producto && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        Producto: <span className="font-medium">{alerta.producto.codigo} - {alerta.producto.nombre}</span>
                                                    </p>
                                                )}
                                                {alerta.inventario?.ubicacion && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Ubicación: <span className="font-medium">{alerta.inventario.ubicacion.nombre}</span>
                                                        {alerta.inventario.lote && ` • Lote: ${alerta.inventario.lote}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                                <Clock size={14} />
                                                <span>
                          {formatDistanceToNow(new Date(alerta.created_at), {
                              addSuffix: true,
                              locale: es
                          })}
                        </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!alerta.leida && (
                                                    <button
                                                        onClick={(e) => handleMarcarLeida(e, alerta.id)}
                                                        className={`${getColorClasses(color, 'text')} hover:underline text-sm transition-colors flex items-center gap-1`}
                                                    >
                                                        <Check size={14} />
                                                        Marcar leída
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleEliminar(e, alerta.id)}
                                                    className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm transition-colors flex items-center gap-1"
                                                >
                                                    <X size={14} />
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}