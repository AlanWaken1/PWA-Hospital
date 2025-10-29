import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

export function TeamCollaboration() {
  const members = [
    { name: 'Alexandra Daff', project: 'GitHub Project Repository', status: 'Completed', color: 'bg-red-100 text-red-600' },
    { name: 'Edwin Adenika', project: 'Integrate User Authentication System', status: 'In Progress', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Ijapie Oluwatemsifemi', project: 'Develop Search and Filter Functionality', status: 'Pending', color: 'bg-blue-100 text-blue-600' },
    { name: 'David Oshodi', project: 'Responsive Layout for Homepage', status: 'In Progress', color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">Team Collaboration</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-theme-primary hover:text-theme-primary-dark border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">Add Member</span>
        </motion.button>
      </div>

      <div className="space-y-3">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className={index % 4 === 0 ? 'bg-red-100 text-red-600' : index % 4 === 1 ? 'bg-green-100 text-green-600' : index % 4 === 2 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-gray-900">{member.name}</h4>
              <p className="text-xs text-gray-500 truncate">Working on: {member.project}</p>
            </div>

            <Badge variant="secondary" className={`${member.color} text-xs px-2.5 py-0.5 whitespace-nowrap`}>
              {member.status}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
