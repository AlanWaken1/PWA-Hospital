// app/(app)/personal/page.tsx - PÁGINA DE PERSONAL CON DATOS REALES
"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plus, Mail, Phone, UserCheck, Users, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useStaff } from '@/hooks/useStaff';

export default function Personal() {
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // ⭐ DATOS REALES de Supabase
    const { staff, loading, error } = useStaff();

    // Colores por rol
    const getColorByRole = (rol: string) => {
        const colors: Record<string, string> = {
            admin: 'bg-theme-primary/20 text-theme-primary dark:bg-theme-primary-dark/30 dark:text-theme-primary-light',
            doctor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            enfermera: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
            farmaceutico: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            almacenista: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
            tecnico: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
        };
        return colors[rol] || 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    };

    // Formato legible del rol
    const formatRole = (rol: string) => {
        const roles: Record<string, string> = {
            admin: 'Administrador',
            doctor: 'Médico',
            enfermera: 'Enfermera',
            farmaceutico: 'Farmacéutico',
            almacenista: 'Almacenista',
            tecnico: 'Técnico',
        };
        return roles[rol] || rol.charAt(0).toUpperCase() + rol.slice(1);
    };

    // Formato de fecha
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
        return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    };

    useEffect(() => {
        if (loading) return;

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
    }, [loading, staff]);

    // Contadores
    const totalStaff = staff.length;
    const adminCount = staff.filter(s => s.rol === 'admin').length;

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-32 animate-pulse"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-48 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <>
            {/* Page Title */}
            <div ref={titleRef} className="mb-6">
                <h1 className="text-gray-900 dark:text-gray-100 mb-2">Gestión de Personal</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Usuarios registrados en el sistema de inventario.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <div className="bg-gradient-to-br from-theme-primary to-theme-primary-dark dark:from-theme-primary-dark dark:to-theme-primary-dark rounded-2xl p-6 text-white shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-theme-primary-light">Usuarios Totales</h3>
                        <Users className="text-white" size={24} />
                    </div>
                    <div className="text-4xl mb-2">{totalStaff}</div>
                    <p className="text-theme-primary-light text-sm">Registrados en el sistema</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-gray-600 dark:text-gray-400">Administradores</h3>
                        <Shield className="text-theme-primary" size={24} />
                    </div>
                    <div className="text-4xl text-gray-900 dark:text-gray-100 mb-2">{adminCount}</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Con acceso completo</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-gray-600 dark:text-gray-400">Activos</h3>
                        <UserCheck className="text-green-500" size={24} />
                    </div>
                    <div className="text-4xl text-gray-900 dark:text-gray-100 mb-2">{totalStaff}</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Usuarios habilitados</p>
                </div>
            </div>

            {/* Staff Cards */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-gray-100">Equipo del Sistema</h3>
                {/* Botón opcional para agregar - puedes implementar después */}
                {/* <button
          className="bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white px-6 py-2 rounded-xl shadow-lg shadow-theme-primary/30 flex items-center gap-2 hover:shadow-xl hover:shadow-theme-primary/40 transition-all"
        >
          <Plus size={20} />
          <span>Agregar Usuario</span>
        </button> */}
            </div>

            {staff.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
                    <Users size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No hay usuarios registrados
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Los usuarios se crean automáticamente cuando se registran en el sistema.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {staff.map((member, index) => (
                        <div
                            key={member.id}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                            onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -4, duration: 0.2 })}
                            onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative">
                                    <Avatar className="w-16 h-16">
                                        <AvatarFallback className={getColorByRole(member.rol)}>
                                            {member.nombre_completo
                                                .split(' ')
                                                .slice(0, 2)
                                                .map(n => n[0])
                                                .join('')
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Indicador de activo */}
                                    {member.esta_activo && (
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-theme-primary-light border-2 border-white dark:border-gray-800 rounded-full"></div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="text-gray-900 dark:text-gray-100 font-semibold">
                                                {member.nombre_completo}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatRole(member.rol)}
                                            </p>
                                        </div>
                                        <Badge className={getColorByRole(member.rol)}>
                                            {formatRole(member.rol)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Mail size={14} />
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                        {member.telefono && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Phone size={14} />
                                                <span>{member.telefono}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <div className="text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Departamento: </span>
                                            <span className="text-gray-900 dark:text-gray-100">
                        {member.departamento || 'Sin asignar'}
                      </span>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(member.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}