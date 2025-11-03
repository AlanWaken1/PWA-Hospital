// components/shared/StaffActivity.tsx
"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Plus, Circle } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useStaffActivity } from '@/hooks/useStaffActivity';

export function StaffActivity() {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const router = useRouter();

    const { activities, loading, error } = useStaffActivity(4);

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
    }, [activities]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'En línea':
                return {
                    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                    dotColor: 'bg-green-500',
                    pulse: true
                };
            case 'Ocupado':
                return {
                    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
                    dotColor: 'bg-yellow-500',
                    pulse: false
                };
            case 'Ausente':
                return {
                    color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
                    dotColor: 'bg-gray-400',
                    pulse: false
                };
            default:
                return {
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                    dotColor: 'bg-blue-500',
                    pulse: false
                };
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .slice(0, 2)
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    // ✨ FUNCIÓN: Ver todo el personal
    const handleVerTodos = () => {
        router.push('/staff');
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col h-[500px]">
                <h3 className="text-gray-900 dark:text-gray-100 mb-6">Actividad del Personal</h3>
                <div className="flex items-center justify-center flex-1">
                    <div className="animate-spin w-10 h-10 border-4 border-theme-primary border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-red-200 dark:border-red-700 shadow-lg flex flex-col h-[500px]">
                <h3 className="text-gray-900 dark:text-gray-100 mb-4">Actividad del Personal</h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (activities.length === 0) {
        return (
            <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col h-[500px]">
                <h3 className="text-gray-900 dark:text-gray-100 mb-6">Actividad del Personal</h3>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Plus className="text-gray-400" size={28} />
                        </div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">Sin actividad reciente</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">No hay movimientos del personal</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-blue-500/10 transition-all flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                    <h3 className="text-gray-900 dark:text-gray-100">Actividad del Personal</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activities.filter(a => a.online).length} en línea • {activities.length} activos
                    </p>
                </div>
                <button
                    onClick={handleVerTodos}
                    className="text-theme-primary dark:text-theme-primary-light text-sm hover:text-theme-primary-dark dark:hover:text-theme-primary-light transition-colors flex items-center gap-1 bg-theme-primary/10 dark:bg-theme-primary/20 px-3 py-1.5 rounded-lg hover:bg-theme-primary/20 dark:hover:bg-theme-primary/30"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Ver todo</span>
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
                {activities.map((member, index) => {
                    const statusConfig = getStatusConfig(member.status);

                    return (
                        <div
                            key={member.id}
                            ref={(el) => {itemsRef.current[index] = el;}}
                            className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all backdrop-blur-sm"
                        >
                            {/* Avatar with status */}
                            <div className="relative flex-shrink-0">
                                <Avatar className="w-11 h-11 ring-2 ring-white dark:ring-gray-800">
                                    <AvatarFallback className={statusConfig.color}>
                                        {getInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                                {member.online && (
                                    <div className="absolute bottom-0 right-0">
                                        <div className={`w-3.5 h-3.5 ${statusConfig.dotColor} border-2 border-white dark:border-gray-800 rounded-full`}>
                                            {statusConfig.pulse && (
                                                <span className={`absolute inset-0 ${statusConfig.dotColor} rounded-full animate-ping opacity-75`}></span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-1">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {member.name}
                                    </h4>
                                    <Badge variant="secondary" className={`${statusConfig.color} text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0`}>
                                        {member.status}
                                    </Badge>
                                </div>

                                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                    {member.action}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="capitalize bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {member.rol}
                  </span>
                                    <Circle size={4} className="fill-current" />
                                    <span>{member.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}