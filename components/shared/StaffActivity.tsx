import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';

export function StaffActivity() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const staff = [
    { name: 'Dra. María González', action: 'Actualizó inventario de medicamentos', status: 'En línea', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', online: true },
    { name: 'Enf. Carlos Ramírez', action: 'Registró entrada de equipos médicos', status: 'Ocupado', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400', online: true },
    { name: 'Farm. Ana Torres', action: 'Realizó conteo de insumos quirúrgicos', status: 'En línea', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400', online: true },
    { name: 'Dr. Luis Mendoza', action: 'Solicitó resurtido de material de laboratorio', status: 'Ausente', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', online: false },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power3.out' }
      );

      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, delay: 0.6 + index * 0.1, ease: 'power2.out' }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-blue-500/10 transition-all h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 dark:text-gray-100">Actividad del Personal</h3>
        <button className="text-emerald-600 dark:text-emerald-400 text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1">
          <Plus size={16} />
          Agregar
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-auto">
        {staff.map((member, index) => (
          <div
            key={index}
            ref={(el) => {itemsRef.current[index] = el;} }
            className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow backdrop-blur-sm"
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className={member.color}>
                  {member.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {member.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-gray-900 dark:text-gray-100 mb-1">{member.name}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">{member.action}</p>
            </div>

            <Badge variant="secondary" className={`${member.color} text-xs px-2.5 py-0.5 whitespace-nowrap`}>
              {member.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
