import { motion } from 'motion/react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  variant?: 'primary' | 'secondary';
  delay?: number;
}

export function StatCard({ title, value, trend, trendType = 'up', variant = 'secondary', delay = 0 }: StatCardProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`rounded-2xl p-6 relative overflow-hidden ${
        isPrimary 
          ? 'bg-gradient-to-br from-theme-primary via-theme-primary to-theme-primary-dark text-white shadow-lg shadow-theme-primary/20' 
          : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-sm ${isPrimary ? 'text-theme-primary-light' : 'text-gray-600'}`}>{title}</h3>
        <motion.div
          whileHover={{ rotate: 45, scale: 1.1 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isPrimary ? 'bg-white/20' : 'bg-gray-100'
          }`}
        >
          <ArrowUpRight size={16} className={isPrimary ? 'text-white' : 'text-gray-600'} />
        </motion.div>
      </div>
      
      <div className={`text-4xl mb-3 ${isPrimary ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </div>
      
      {trend && (
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
            isPrimary 
              ? 'bg-white/20 text-white' 
              : trendType === 'up' 
                ? 'bg-theme-primary/10 text-theme-primary' 
                : trendType === 'neutral'
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-red-50 text-red-600'
          }`}>
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
