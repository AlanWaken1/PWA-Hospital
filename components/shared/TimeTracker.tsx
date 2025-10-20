import { motion } from 'motion/react';
import { Pause, Square } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TimeTracker() {
  const [time, setTime] = useState({ hours: 1, minutes: 24, seconds: 8 });
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev;
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
        }
        if (minutes === 60) {
          minutes = 0;
          hours++;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-emerald-500/30"
    >
      {/* Decorative wave pattern */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10">
        <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
          <defs>
            <pattern id="wave" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q 10 10, 20 20 T 40 20" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#wave)"/>
        </svg>
      </div>

      <h3 className="mb-6 text-emerald-50 relative z-10">Time Tracker</h3>
      
      <motion.div
        key={`${time.hours}:${time.minutes}:${time.seconds}`}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        className="text-5xl mb-6 relative z-10 tracking-tight"
      >
        {formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}
      </motion.div>

      <div className="flex items-center gap-3 relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsRunning(!isRunning)}
          className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <Pause size={20} fill="white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsRunning(false);
            setTime({ hours: 0, minutes: 0, seconds: 0 });
          }}
          className="w-12 h-12 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <Square size={16} fill="white" />
        </motion.button>
      </div>
    </motion.div>
  );
}
