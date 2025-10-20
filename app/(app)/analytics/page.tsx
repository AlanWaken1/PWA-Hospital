"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Package,
  AlertTriangle,
  Calendar,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Analiticas() {
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);
  const [counter4, setCounter4] = useState(0);

  // Data para gráficos
  const movementData = [
    { mes: 'Ene', entradas: 4200, salidas: 2800, stock: 8500 },
    { mes: 'Feb', entradas: 3800, salidas: 3200, stock: 9100 },
    { mes: 'Mar', entradas: 5100, salidas: 2900, stock: 11300 },
    { mes: 'Abr', entradas: 4600, salidas: 3400, stock: 12500 },
    { mes: 'May', entradas: 5400, salidas: 3100, stock: 14800 },
    { mes: 'Jun', entradas: 6200, salidas: 3600, stock: 17400 },
  ];

  const categoryData = [
    { name: 'Medicamentos', value: 45, color: '#10b981' },
    { name: 'Insumos', value: 25, color: '#3b82f6' },
    { name: 'Equipos', value: 18, color: '#8b5cf6' },
    { name: 'Quirúrgico', value: 12, color: '#f59e0b' },
  ];

  const topProductsData = [
    { producto: 'Paracetamol', cantidad: 1245, valor: 24500 },
    { producto: 'Jeringas 5ml', cantidad: 890, valor: 18900 },
    { producto: 'Guantes', cantidad: 2340, valor: 15600 },
    { producto: 'Mascarillas', cantidad: 1560, valor: 12300 },
    { producto: 'Alcohol Gel', cantidad: 780, valor: 9800 },
  ];

  const performanceData = [
    { category: 'Rotación', value: 85 },
    { category: 'Disponibilidad', value: 92 },
    { category: 'Eficiencia', value: 78 },
    { category: 'Cumplimiento', value: 88 },
    { category: 'Calidad', value: 95 },
  ];

  const dailyActivityData = [
    { dia: 'Lun', movimientos: 45 },
    { dia: 'Mar', movimientos: 52 },
    { dia: 'Mié', movimientos: 38 },
    { dia: 'Jue', movimientos: 67 },
    { dia: 'Vie', movimientos: 58 },
    { dia: 'Sáb', movimientos: 23 },
    { dia: 'Dom', movimientos: 12 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.1 + index * 0.05, ease: 'power2.out' }
          );
        }
      });
    });

    // Animated counters
    const duration = 2000;
    const steps = 60;
    const increment1 = 24567 / steps;
    const increment2 = 18943 / steps;
    const increment3 = 342 / steps;
    const increment4 = 1245 / steps;

    let current = 0;
    const timer = setInterval(() => {
      current++;
      setCounter1(Math.floor(increment1 * current));
      setCounter2(Math.floor(increment2 * current));
      setCounter3(Math.floor(increment3 * current));
      setCounter4(Math.floor(increment4 * current));

      if (current >= steps) {
        clearInterval(timer);
        setCounter1(24567);
        setCounter2(18943);
        setCounter3(342);
        setCounter4(1245);
      }
    }, duration / steps);

    return () => {
      ctx.revert();
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {/* Page Title */}
      <div ref={titleRef} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-gray-100 mb-2">Analíticas Avanzadas</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Monitoreo en tiempo real y análisis profundo del inventario
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          ref={(el) => {cardsRef.current[0] = el;}}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm text-emerald-100">Movimientos Totales</h4>
            <Activity className="text-white" size={20} />
          </div>
          <div className="text-3xl mb-2">{counter1.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-emerald-100 text-sm">
            <TrendingUp size={14} />
            <span>+12.5% vs mes anterior</span>
          </div>
        </div>

        <div
          ref={(el) => {cardsRef.current[1] = el}}
          className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm text-blue-100">Productos Activos</h4>
            <Package className="text-white" size={20} />
          </div>
          <div className="text-3xl mb-2">{counter2.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <TrendingUp size={14} />
            <span>+8.3% este mes</span>
          </div>
        </div>

        <div
          ref={(el) => {{cardsRef.current[2] = el}}}
          className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm text-purple-100">Valor Inventario</h4>
            <DollarSign className="text-white" size={20} />
          </div>
          <div className="text-3xl mb-2">${counter3.toLocaleString()}K</div>
          <div className="flex items-center gap-2 text-purple-100 text-sm">
            <TrendingUp size={14} />
            <span>+5.7% valorización</span>
          </div>
        </div>

        <div
          ref={(el) => {cardsRef.current[3] = el;}}
          className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm text-orange-100">Movimientos Hoy</h4>
            <BarChart3 className="text-white" size={20} />
          </div>
          <div className="text-3xl mb-2">{counter4.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-orange-100 text-sm">
            <TrendingDown size={14} />
            <span>-3.2% vs ayer</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Area Chart - Stock Evolution */}
        <div
          ref={(el) => {cardsRef.current[4] = el}}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900 dark:text-gray-100 mb-1">Evolución del Stock</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Entradas vs Salidas (Últimos 6 meses)
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Salidas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Stock Total</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={movementData}>
              <defs>
                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="mes" stroke="#9ca3af" className="dark:stroke-gray-400" />
              <YAxis stroke="#9ca3af" className="dark:stroke-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: '#374151' }}
              />
              <Area
                type="monotone"
                dataKey="entradas"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorEntradas)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="salidas"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorSalidas)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="stock"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorStock)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Categorías */}
        <div
          ref={(el) => {cardsRef.current[5] = el;}}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
        >
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-gray-100 mb-1">Distribución por Categoría</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Porcentaje del inventario</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                </div>
                <span className="text-gray-900 dark:text-gray-100">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Bar Chart - Top Products */}
        <div
          ref={(el) => {cardsRef.current[6] = el;}}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
        >
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-gray-100 mb-1">Top 5 Productos Más Movidos</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Por cantidad de movimientos</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProductsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis type="number" stroke="#9ca3af" className="dark:stroke-gray-400" />
              <YAxis type="category" dataKey="producto" stroke="#9ca3af" className="dark:stroke-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="cantidad" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart - Performance */}
        <div
          ref={(el) => {cardsRef.current[7] = el}}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
        >
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-gray-100 mb-1">Rendimiento General</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Métricas clave del sistema</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <PolarAngleAxis dataKey="category" stroke="#9ca3af" className="dark:stroke-gray-400" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Line Chart - Daily Activity */}
        <div
          ref={(el) => {cardsRef.current[8] = el;}}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
        >
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-gray-100 mb-1">Actividad Semanal</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Movimientos por día</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="dia" stroke="#9ca3af" className="dark:stroke-gray-400" />
              <YAxis stroke="#9ca3af" className="dark:stroke-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="movimientos"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats Grid */}
        <div
          ref={(el) => {cardsRef.current[9] = el;}}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
        >
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-gray-100 mb-1">Resumen Rápido</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Indicadores principales</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Crecimiento</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">+15.3%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">vs periodo anterior</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="text-blue-600 dark:text-blue-400" size={20} />
                <span className="text-xs text-blue-600 dark:text-blue-400">Eficiencia</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">92.5%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">operacional</p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                <span className="text-xs text-purple-600 dark:text-purple-400">Tiempo Prom.</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">2.3 días</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">de procesamiento</p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-orange-600 dark:text-orange-400" size={20} />
                <span className="text-xs text-orange-600 dark:text-orange-400">Alertas</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-gray-100">8</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">pendientes</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
