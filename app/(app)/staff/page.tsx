"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plus, Mail, Phone, UserCheck, UserX } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Personal() {
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const staff = [
    {
      id: 1,
      name: 'Dra. María González',
      role: 'Jefa de Farmacia',
      email: 'maria.gonzalez@hospital.com',
      phone: '+52 55 1234-5678',
      status: 'online',
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      activities: 156,
      lastActive: 'Hace 5 min',
    },
    {
      id: 2,
      name: 'Enf. Carlos Ramírez',
      role: 'Enfermero Jefe',
      email: 'carlos.ramirez@hospital.com',
      phone: '+52 55 2345-6789',
      status: 'online',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      activities: 142,
      lastActive: 'Hace 12 min',
    },
    {
      id: 3,
      name: 'Farm. Ana Torres',
      role: 'Farmacéutica',
      email: 'ana.torres@hospital.com',
      phone: '+52 55 3456-7890',
      status: 'online',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      activities: 128,
      lastActive: 'Hace 8 min',
    },
    {
      id: 4,
      name: 'Dr. Luis Mendoza',
      role: 'Médico Internista',
      email: 'luis.mendoza@hospital.com',
      phone: '+52 55 4567-8901',
      status: 'offline',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      activities: 98,
      lastActive: 'Hace 2 horas',
    },
    {
      id: 5,
      name: 'Enf. Patricia Ruiz',
      role: 'Enfermera',
      email: 'patricia.ruiz@hospital.com',
      phone: '+52 55 5678-9012',
      status: 'online',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
      activities: 134,
      lastActive: 'Hace 3 min',
    },
    {
      id: 6,
      name: 'Farm. Roberto Díaz',
      role: 'Farmacéutico',
      email: 'roberto.diaz@hospital.com',
      phone: '+52 55 6789-0123',
      status: 'offline',
      color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
      activities: 89,
      lastActive: 'Hace 1 hora',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, delay: 0.1 + index * 0.1, ease: 'back.out(1.7)' }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const onlineStaff = staff.filter(s => s.status === 'online').length;
  const totalActivities = staff.reduce((sum, s) => sum + s.activities, 0);

  return (
    <>
      {/* Page Title */}
      <div ref={titleRef} className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100 mb-2">Gestión de Personal</h1>
        <p className="text-gray-500 dark:text-gray-400">Administra el equipo médico y de farmacia del hospital.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-2xl p-6 text-white shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-emerald-100">Personal Total</h3>
            <UserCheck className="text-white" size={24} />
          </div>
          <div className="text-4xl mb-2">{staff.length}</div>
          <p className="text-emerald-200 text-sm">Miembros activos</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-gray-600 dark:text-gray-400">En Línea</h3>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-4xl text-gray-900 dark:text-gray-100 mb-2">{onlineStaff}</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Disponibles ahora</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-gray-600 dark:text-gray-400">Actividades</h3>
            <UserX className="text-gray-400" size={24} />
          </div>
          <div className="text-4xl text-gray-900 dark:text-gray-100 mb-2">{totalActivities}</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Este mes</p>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 dark:text-gray-100">Equipo Médico</h3>
        <button
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
        >
          <Plus size={20} />
          <span>Agregar Personal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {staff.map((member, index) => (
          <div
            key={member.id}
            ref={(el) => {cardsRef.current[index] = el;}}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all cursor-pointer"
            onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -4, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className={member.color}>
                    {member.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {member.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900 dark:text-gray-100">{member.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                  <Badge className={member.status === 'online' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}>
                    {member.status === 'online' ? 'En línea' : 'Ausente'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={14} />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone size={14} />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Actividades: </span>
                    <span className="text-gray-900 dark:text-gray-100">{member.activities}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{member.lastActive}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
