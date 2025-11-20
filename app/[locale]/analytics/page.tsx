// app/(app)/analytics/page.tsx - PÁGINA DE ANALYTICS COMPLETA
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Package,
    DollarSign,
    Activity,
    Calendar,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    BarChart3,
    PieChart,
    Zap
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart as RechartsPie,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// Colores para gráficos
const COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

// Variantes de animación
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export default function AnalyticsPage() {
    const [diasAtras, setDiasAtras] = useState(30);
    const { data, loading, error, refetch } = useAnalytics(diasAtras);

    // Filtros de periodo
    const periodos = [
        { label: '7 días', value: 7 },
        { label: '30 días', value: 30 },
        { label: '90 días', value: 90 },
        { label: '6 meses', value: 180 },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <motion.div
                    className="w-16 h-16 border-4 border-theme-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Análisis de Inventario
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Insights y métricas de tu inventario hospitalario
                    </p>
                </div>

                {/* Filtros de periodo */}
                <div className="flex gap-2">
                    {periodos.map(periodo => (
                        <motion.button
                            key={periodo.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDiasAtras(periodo.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                diasAtras === periodo.value
                                    ? 'bg-theme-primary text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {periodo.label}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Métricas principales */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Activity}
                    title="Total Movimientos"
                    value={data.totalMovimientos.toLocaleString()}
                    subtitle={`${data.totalEntradas} entradas • ${data.totalSalidas} salidas`}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={Package}
                    title="Entradas"
                    value={data.totalEntradas.toLocaleString()}
                    subtitle="Productos ingresados"
                    trend={`+${Math.round((data.totalEntradas / data.totalMovimientos) * 100)}%`}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="Salidas"
                    value={data.totalSalidas.toLocaleString()}
                    subtitle="Productos usados"
                    trend={`${Math.round((data.totalSalidas / data.totalMovimientos) * 100)}%`}
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <MetricCard
                    icon={DollarSign}
                    title="Valor Total"
                    value={`$${(data.valorActual / 1000000).toFixed(1)}M`}
                    subtitle={`Costo: $${(data.costoTotal / 1000000).toFixed(1)}M`}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </motion.div>

            {/* Predicciones críticas */}
            {data.predicciones.length > 0 && (
                <motion.div variants={itemVariants}>
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                                <Zap className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                                    ⚡ Predicciones Críticas
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Productos que necesitan atención inmediata
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {data.predicciones.map((pred, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-4 rounded-xl border-2 ${
                                        pred.tipo === 'critico'
                                            ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                                            : pred.tipo === 'advertencia'
                                                ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'
                                                : 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                                    }`}
                                >
                                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                        {pred.nombre}
                                    </div>
                                    <div className={`text-sm font-medium mb-2 ${
                                        pred.tipo === 'critico' ? 'text-red-700 dark:text-red-300' :
                                            pred.tipo === 'advertencia' ? 'text-orange-700 dark:text-orange-300' :
                                                'text-green-700 dark:text-green-300'
                                    }`}>
                                        {pred.mensaje}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        Uso promedio: {pred.promedioUso} unidades/día
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Gráficos principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tendencia mensual */}
                <motion.div variants={itemVariants}>
                    <ChartCard
                        title="Tendencia de Movimientos"
                        subtitle="Últimos 6 meses"
                        icon={BarChart3}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.tendenciaMensual}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="mes" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="entradas" fill="#10b981" name="Entradas" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="salidas" fill="#f59e0b" name="Salidas" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </motion.div>

                {/* Distribución por categoría */}
                <motion.div variants={itemVariants}>
                    <ChartCard
                        title="Distribución por Categoría"
                        subtitle="Valor en inventario"
                        icon={PieChart}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsPie>
                                <Pie
                                    data={data.distribucionCategorias}
                                    dataKey="valor"
                                    nameKey="categoria"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ categoria, porcentaje }) => `${categoria} ${porcentaje}%`}
                                >
                                    {data.distribucionCategorias.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                />
                            </RechartsPie>
                        </ResponsiveContainer>
                    </ChartCard>
                </motion.div>

                {/* Actividad por día */}
                <motion.div variants={itemVariants}>
                    <ChartCard
                        title="Actividad Semanal"
                        subtitle="Movimientos por día"
                        icon={Clock}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.actividadPorDia}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="dia" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="movimientos"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', r: 6 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </motion.div>

                {/* Costo mensual */}
                <motion.div variants={itemVariants}>
                    <ChartCard
                        title="Evolución de Costos"
                        subtitle="Inversión mensual"
                        icon={DollarSign}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.tendenciaMensual}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="mes" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="costo"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ fill: '#ef4444', r: 6 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </motion.div>
            </div>

            {/* Top 10 listas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top más usados */}
                <motion.div variants={itemVariants}>
                    <TopListCard
                        title="Top 10 Más Usados"
                        subtitle="Por cantidad de salidas"
                        icon={TrendingUp}
                        items={data.topMasUsados.map(item => ({
                            name: item.nombre,
                            value: item.cantidad,
                            badge: `${item.porcentaje}%`,
                            color: 'text-orange-600'
                        }))}
                    />
                </motion.div>

                {/* Top más caros */}
                <motion.div variants={itemVariants}>
                    <TopListCard
                        title="Top 10 Mayor Valor"
                        subtitle="Por valor en inventario"
                        icon={DollarSign}
                        items={data.topMasCaros.map(item => ({
                            name: item.nombre,
                            value: item.valor,
                            badge: `${item.cantidad} uds`,
                            color: 'text-purple-600',
                            isCurrency: true
                        }))}
                    />
                </motion.div>

                {/* Top bajo stock */}
                <motion.div variants={itemVariants}>
                    <TopListCard
                        title="Top 10 Stock Crítico"
                        subtitle="Requieren reabastecimiento"
                        icon={AlertTriangle}
                        items={data.topBajoStock.map(item => ({
                            name: item.nombre,
                            value: item.cantidad,
                            badge: `${item.porcentaje}%`,
                            color: 'text-red-600'
                        }))}
                        isAlert
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}

// Componente MetricCard
function MetricCard({
                        icon: Icon,
                        title,
                        value,
                        subtitle,
                        trend,
                        color
                    }: {
    icon: any;
    title: string;
    value: string;
    subtitle: string;
    trend?: string;
    color: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className={`${color} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}
        >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="text-sm font-medium opacity-90">{title}</div>
                    <Icon size={20} className="opacity-90" />
                </div>
                <div className="text-3xl font-bold mb-2">{value}</div>
                <div className="text-sm opacity-75">{subtitle}</div>
                {trend && (
                    <div className="mt-3 flex items-center gap-1 text-sm font-medium">
                        {trend.includes('+') ? (
                            <ArrowUpRight size={16} />
                        ) : (
                            <ArrowDownRight size={16} />
                        )}
                        {trend}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Componente ChartCard
function ChartCard({
                       title,
                       subtitle,
                       icon: Icon,
                       children
                   }: {
    title: string;
    subtitle: string;
    icon: any;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-theme-primary to-theme-primary-dark flex items-center justify-center">
                    <Icon className="text-white" size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

// Componente TopListCard
function TopListCard({
                         title,
                         subtitle,
                         icon: Icon,
                         items,
                         isAlert = false
                     }: {
    title: string;
    subtitle: string;
    icon: any;
    items: Array<{
        name: string;
        value: number;
        badge: string;
        color: string;
        isCurrency?: boolean;
    }>;
    isAlert?: boolean;
}) {
    return (
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl ${isAlert ? 'bg-red-500' : 'bg-gradient-to-br from-theme-primary to-theme-primary-dark'} flex items-center justify-center`}>
                    <Icon className="text-white" size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
            </div>

            <div className="space-y-3">
                {items.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {item.name}
                            </div>
                            <div className={`text-xs font-semibold ${item.color}`}>
                                {item.isCurrency ? `$${item.value.toLocaleString()}` : `${item.value} unidades`}
                            </div>
                        </div>
                        <div className="ml-2 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
                            {item.badge}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}