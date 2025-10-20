import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface GradientStatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  delay?: number;
}

export function GradientStatCard({ 
  title, 
  value, 
  trend, 
  trendType = 'up', 
  icon: Icon,
  gradientFrom,
  gradientTo,
  delay = 0 
}: GradientStatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay, ease: 'power3.out' }
      );

      // Animate number counting
      const numValue = parseInt(value.replace(/\D/g, ''));
      if (!isNaN(numValue) && valueRef.current) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: numValue,
          duration: 1.5,
          delay: delay + 0.3,
          ease: 'power2.out',
          onUpdate: () => {
            if (valueRef.current) {
              const currentVal = Math.floor(counter.val);
              // Preserve any prefix/suffix from original value
              if (value.includes('$')) {
                valueRef.current.textContent = '$' + currentVal.toLocaleString();
              } else if (value.includes('M')) {
                const decimal = Math.floor((counter.val % 1) * 10);
                valueRef.current.textContent = currentVal + '.' + decimal + 'M';
              } else if (value.includes(',')) {
                valueRef.current.textContent = currentVal.toLocaleString();
              } else {
                valueRef.current.textContent = currentVal.toString();
              }
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
      className={`rounded-2xl p-6 relative overflow-hidden cursor-pointer transition-all bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
      style={{
        boxShadow: `0 20px 60px -15px ${gradientFrom.includes('emerald') ? 'rgba(16, 185, 129, 0.6)' : 
                    gradientFrom.includes('orange') ? 'rgba(249, 115, 22, 0.6)' :
                    gradientFrom.includes('blue') ? 'rgba(59, 130, 246, 0.6)' :
                    'rgba(168, 85, 247, 0.6)'}`
      }}
    >
      {/* Decorative elements */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute right-1/4 top-1/3 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm text-white font-medium">{title}</h3>
          <div className="w-12 h-12 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
            {Icon && <Icon size={24} className="text-white drop-shadow-lg" />}
          </div>
        </div>
        
        <div className="text-4xl mb-3 text-white drop-shadow-lg">
          <span ref={valueRef}>{value}</span>
        </div>
        
        {trend && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-white/25 backdrop-blur-sm text-white shadow-lg">
              {trendType === 'up' ? <TrendingUp size={12} /> : trendType === 'down' ? <TrendingDown size={12} /> : null}
              <span className="font-medium">{trend}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
