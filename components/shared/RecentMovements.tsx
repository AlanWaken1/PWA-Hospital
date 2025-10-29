import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

export function RecentMovements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const movementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const movements = [
    { type: 'entrada', item: 'Guantes quirúrgicos', quantity: '+500 uds', time: 'Hace 2 horas', color: 'text-green-600', bg: 'bg-green-50' },
    { type: 'salida', item: 'Mascarillas N95', quantity: '-120 uds', time: 'Hace 3 horas', color: 'text-red-600', bg: 'bg-red-50' },
    { type: 'entrada', item: 'Alcohol en gel', quantity: '+200 uds', time: 'Hace 5 horas', color: 'text-green-600', bg: 'bg-green-50' },
    { type: 'salida', item: 'Vendas elásticas', quantity: '-45 uds', time: 'Hace 6 horas', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      );

      movementsRef.current.forEach((movement, index) => {
        if (movement) {
          gsap.fromTo(
            movement,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, delay: 0.2 + index * 0.1, ease: 'power2.out' }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-gradient-to-br from-theme-primary via-theme-primary to-theme-primary-dark dark:from-theme-primary-dark dark:via-theme-primary-dark dark:to-theme-primary-dark rounded-2xl p-6 text-white shadow-xl shadow-theme-primary/30 dark:shadow-theme-primary/20 relative overflow-hidden transition-all">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Package className="text-theme-primary-light" size={20} />
          <h3 className="text-theme-primary-light">Movimientos Recientes</h3>
        </div>
        
        <div className="space-y-2">
          {movements.map((movement, index) => (
            <div
              key={index}
              ref={(el) => (movementsRef.current[index] = el)}
              className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { x: 4, duration: 0.2 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { x: 0, duration: 0.2 });
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${movement.bg} rounded-lg flex items-center justify-center`}>
                  {movement.type === 'entrada' ? (
                    <ArrowDownRight className={movement.color} size={16} />
                  ) : (
                    <ArrowUpRight className={movement.color} size={16} />
                  )}
                </div>
                <div>
                  <div className="text-sm text-white">{movement.item}</div>
                  <div className="text-xs text-theme-primary-light">{movement.time}</div>
                </div>
              </div>
              <div className={`text-sm ${movement.color} bg-white px-2 py-1 rounded`}>
                {movement.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
