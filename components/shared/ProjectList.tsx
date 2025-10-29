import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

export function ProjectList() {
  const projects = [
    { name: 'Develop API Endpoints', date: 'Due date: Nov 05, 2021', icon: '⚡', color: 'bg-purple-100' },
    { name: 'Onboarding Flow', date: 'Due date: Nov 05, 2021', icon: '🎯', color: 'bg-blue-100' },
    { name: 'Build Dashboard', date: 'Due date: Nov 30, 2021', icon: '🚀', color: 'bg-pink-100' },
    { name: 'Optimize Page Load', date: 'Due date: March 3, 2021', icon: '⚙️', color: 'bg-yellow-100' },
    { name: 'Cross-Browser Testing', date: 'Due date: Dec 6, 2021', icon: '🎨', color: 'bg-red-100' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">Project</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-theme-primary hover:text-theme-primary-dark border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">New</span>
        </motion.button>
      </div>

      <div className="space-y-3">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className={`w-10 h-10 ${project.color} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
              {project.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-gray-900">{project.name}</h4>
              <p className="text-xs text-gray-500">{project.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
