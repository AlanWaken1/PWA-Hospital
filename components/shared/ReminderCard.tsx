import { motion } from 'motion/react';
import { Clock, Video } from 'lucide-react';

export function ReminderCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="mb-4 text-gray-900">Reminders</h3>
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200"
      >
        <h4 className="mb-1 text-gray-900">Meeting with Arc Company</h4>
        <div className="flex items-center gap-1.5 text-gray-500 mb-4">
          <Clock size={14} />
          <span className="text-xs">Today, 09.00 - 04.00 pm</span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
        >
          <Video size={16} />
          <span>Start Meeting</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
