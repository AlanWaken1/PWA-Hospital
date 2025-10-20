import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function StockLevel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const [progress, setProgress] = useState(0);
  const targetProgress = 73;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
      );

      // Animate progress
      gsap.to({ val: 0 }, {
        val: targetProgress,
        duration: 2,
        delay: 0.5,
        ease: 'power2.out',
        onUpdate: function() {
          setProgress(Math.floor(this.targets()[0].val));
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-emerald-500/10 transition-all">
      <h3 className="mb-4 text-gray-900 dark:text-gray-100">Nivel de Stock Global</h3>
      
      <div className="relative flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="16"
          />
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx="96"
            cy="96"
            r="70"
            fill="none"
            stroke="url(#emeraldGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
          <defs>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl text-gray-900 dark:text-gray-100">{progress}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Stock Disponible</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Bajo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Crítico</span>
        </div>
      </div>
    </div>
  );
}
