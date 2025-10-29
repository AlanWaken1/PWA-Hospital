import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function ProjectProgress() {
  const [progress, setProgress] = useState(0);
  const targetProgress = 41;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="mb-4 text-gray-900">Project Progress</h3>
      
      <div className="relative flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle with pattern */}
          <defs>
            <pattern id="stripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(229, 231, 235, 0.5)" strokeWidth="4" />
            </pattern>
          </defs>
          <circle
            cx="96"
            cy="96"
            r="70"
            fill="none"
            stroke="url(#stripes)"
            strokeWidth="24"
          />
          {/* Progress circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="70"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="24"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="text-4xl text-gray-900">{progress}%</div>
          <div className="text-xs text-gray-500">Project Ended</div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-theme-primary-light to-theme-primary-dark"></div>
          <span className="text-xs text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span className="text-xs text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span className="text-xs text-gray-600">Pending</span>
        </div>
      </div>
    </div>
  );
}
