import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AlertCircle, Clock } from 'lucide-react';

export function ExpirationAlerts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)' }
      );

      // Pulse animation for alert
      gsap.to(pulseRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: 'power1.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-red-900/20 shadow-lg dark:shadow-red-500/10 transition-all">
      <h3 className="mb-4 text-gray-900 dark:text-gray-100">Alertas de Vencimiento</h3>
      
      <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800/50 relative overflow-hidden backdrop-blur-sm">
        <div 
          ref={pulseRef}
          className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full"
        ></div>
        
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-gray-900 dark:text-gray-100 mb-1">Antibióticos Categoría A</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">15 unidades próximas a vencer</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-4">
          <Clock size={14} />
          <span className="text-xs">Vencimiento: 7 días</span>
        </div>
        
        <button className="w-full bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all">
          <AlertCircle size={16} />
          <span>Ver Detalles</span>
        </button>
      </div>
    </div>
  );
}
