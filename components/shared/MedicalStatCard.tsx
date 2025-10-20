import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TrendingUp, TrendingDown, ArrowUpRight, LucideIcon } from 'lucide-react';

interface MedicalStatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
  delay?: number;
}

export function MedicalStatCard({ 
  title, 
  value, 
  trend, 
  trendType = 'up', 
  variant = 'secondary',
  icon: Icon,
  delay = 0 
}: MedicalStatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const isPrimary = variant === 'primary';
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out',
      });

      // Animate number counting
      const numValue = parseInt(value.replace(/\D/g, ''));
      if (!isNaN(numValue)) {
        gsap.from({ val: 0 }, {
          val: numValue,
          duration: 1.5,
          delay: delay + 0.3,
          ease: 'power2.out',
          onUpdate: function() {
            if (valueRef.current) {
              valueRef.current.textContent = Math.floor(this.targets()[0].val).toString();
            }
          }
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, [delay, value]);

  const handleHover = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      y: -8,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleHoverEnd = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
      className={`rounded-2xl p-6 relative overflow-hidden cursor-pointer transition-all ${
        isPrimary 
          ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white shadow-xl shadow-emerald-500/30' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-sm ${isPrimary ? 'text-blue-50' : 'text-gray-600'}`}>{title}</h3>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isPrimary ? 'bg-white/20' : 'bg-emerald-50'
          }`}
        >
          {Icon ? (
            <Icon size={20} className={isPrimary ? 'text-white' : 'text-emerald-600'} />
          ) : (
            <ArrowUpRight size={20} className={isPrimary ? 'text-white' : 'text-emerald-600'} />
          )}
        </div>
      </div>
      
      <div className={`text-4xl mb-3 ${isPrimary ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
        <span ref={valueRef}>{value}</span>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
            isPrimary 
              ? 'bg-white/20 text-white' 
              : trendType === 'up' 
                ? 'bg-emerald-50 text-emerald-600' 
                : trendType === 'neutral'
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-red-50 text-red-600'
          }`}>
            {trendType === 'up' ? <TrendingUp size={12} /> : trendType === 'down' ? <TrendingDown size={12} /> : null}
            <span>{trend}</span>
          </div>
        </div>
      )}
    </div>
  );
}
