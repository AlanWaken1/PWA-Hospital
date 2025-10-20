import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function InventoryAnalytics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  const data = [
    { category: 'Medicamentos', value: 85, color: 'from-emerald-600 to-emerald-700' },
    { category: 'Equipos', value: 65, color: 'from-purple-600 to-purple-700' },
    { category: 'Insumos', value: 45, color: 'from-pink-600 to-pink-700' },
    { category: 'Quirúrgico', value: 90, color: 'from-cyan-600 to-cyan-700' },
    { category: 'Laboratorio', value: 55, color: 'from-indigo-600 to-indigo-700' },
    { category: 'Emergencia', value: 75, color: 'from-teal-600 to-teal-700' },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      barsRef.current.forEach((bar, index) => {
        if (bar) {
          gsap.fromTo(
            bar,
            { scaleY: 0, transformOrigin: 'bottom' },
            {
              scaleY: 1,
              duration: 1,
              delay: 0.3 + index * 0.1,
              ease: 'elastic.out(1, 0.5)',
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-emerald-500/10 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 dark:text-gray-100">Análisis de Inventario por Categoría</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">Nivel de Stock (%)</div>
      </div>
      
      <div className="flex items-end justify-between gap-4 h-64">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full">
              <div className="w-full flex-1 flex items-end justify-center relative group">
                <div
                  ref={(el) => (barsRef.current[index] = el)}
                  className={`w-full rounded-xl bg-gradient-to-t ${item.color} shadow-lg transition-all cursor-pointer`}
                  style={{ height: `${barHeight}%` }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
                      duration: 0.2,
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.2,
                    });
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.value}%
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center">{item.category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
