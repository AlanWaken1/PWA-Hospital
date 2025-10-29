import { motion } from 'motion/react';

export function ProjectAnalytics() {
  const data = [
    { day: 'S', value: 0, label: 'Sun' },
    { day: 'M', value: 75, label: 'Mon' },
    { day: 'T', value: 60, label: 'Tue' },
    { day: 'W', value: 95, label: 'Wed' },
    { day: 'T', value: 0, label: 'Thu' },
    { day: 'F', value: 0, label: 'Fri' },
    { day: 'S', value: 0, label: 'Sat' },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="mb-6 text-gray-900">Project Analytics</h3>
      
      <div className="flex items-end justify-between gap-3 h-48 mb-4">
        {data.map((item, index) => {
          const barHeight = item.value === 0 ? 20 : (item.value / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full">
              <div className="w-full flex-1 flex items-end justify-center">
                {item.value === 0 ? (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    className="w-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden origin-bottom"
                    style={{ height: '20%', minHeight: '40px' }}
                  >
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.5) 4px, rgba(255,255,255,0.5) 8px)',
                    }}></div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    className="w-full rounded-full bg-gradient-to-t from-theme-primary-dark via-theme-primary to-theme-primary-light origin-bottom shadow-lg shadow-theme-primary/30"
                    style={{ height: `${barHeight}%` }}
                  ></motion.div>
                )}
              </div>
              <span className="text-xs text-gray-500">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
