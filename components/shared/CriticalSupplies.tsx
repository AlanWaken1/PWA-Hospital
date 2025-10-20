import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plus, Pill, Syringe, Thermometer, Stethoscope, Activity } from 'lucide-react';

export function CriticalSupplies() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const supplies = [
    { name: 'Paracetamol 500mg', stock: 'Stock bajo: 45 unidades', icon: Pill, color: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400' },
    { name: 'Jeringas desechables 5ml', stock: 'Stock crítico: 12 unidades', icon: Syringe, color: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
    { name: 'Termómetros digitales', stock: 'Stock bajo: 8 unidades', icon: Thermometer, color: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600 dark:text-yellow-400' },
    { name: 'Estetoscopios', stock: 'Stock normal: 24 unidades', icon: Stethoscope, color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
    { name: 'Oxímetros de pulso', stock: 'Stock bajo: 15 unidades', icon: Activity, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
  ];

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
  }, []);

  return (
    <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-orange-900/20 shadow-lg dark:shadow-orange-500/10 transition-all h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 dark:text-gray-100">Suministros Críticos</h3>
        <button className="text-emerald-600 dark:text-emerald-400 text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1">
          <Plus size={16} />
          Nuevo
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-auto">
        {supplies.map((supply, index) => {
          const Icon = supply.icon;
          return (
            <div
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow backdrop-blur-sm"
            >
              <div className={`w-10 h-10 ${supply.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={supply.iconColor} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-gray-900 dark:text-gray-100 mb-1">{supply.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">{supply.stock}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
