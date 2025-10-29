// components/shared/HospitalSidebar.tsx
"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Importa useRouter
import gsap from 'gsap';
import {
    LayoutDashboard, Package, AlertTriangle, BarChart3, Users, Settings, HelpCircle, LogOut, Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client'; // <--- Importa el cliente de Supabase

interface HospitalSidebarProps {}

export function HospitalSidebar({}: HospitalSidebarProps) {
    const router = useRouter(); // <--- Hook para la redirección
    const sidebarRef = useRef<HTMLDivElement>(null);
    const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const pathname = usePathname();

    // --- LÓGICA REAL DE SIGNOUT ---
    const signOut = async () => {
        console.log("Cerrando sesión...");
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (!error) {
            // Redirige al login y refresca para asegurar que el estado se limpie
            router.push('/auth/login');
            router.refresh();
        } else {
            console.error('Error al cerrar sesión:', error.message);
            // Podrías mostrar un toast o alerta aquí
            alert(`Error al cerrar sesión: ${error.message}`);
        }
    };
    // --- FIN LÓGICA REAL ---

    // Animación GSAP (sin cambios)
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(sidebarRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
            gsap.fromTo(menuItemsRef.current.filter(item => item !== null), { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 });
        }, sidebarRef);
        return () => ctx.revert();
    }, []);

    // Tus rutas correctas (sin /protected)
    const menuItems = [
        { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'inventario', href: '/inventory', icon: Package, label: 'Inventario' },
        { id: 'analiticas', href: '/analytics', icon: Activity, label: 'Analíticas' },
        { id: 'alertas', href: '/alerts', icon: AlertTriangle, label: 'Alertas', badge: '12' },
        { id: 'reportes', href: '/reports', icon: BarChart3, label: 'Reportes' },
        { id: 'personal', href: '/staff', icon: Users, label: 'Personal' },
    ];

    const generalItems = [
        { id: 'configuracion', href: '/settings', icon: Settings, label: 'Configuración' },
        { id: 'ayuda', href: '/help', icon: HelpCircle, label: 'Ayuda' },
        { id: 'logout', icon: LogOut, label: 'Cerrar Sesión' },
    ];

    return (
        <aside
            ref={sidebarRef}
            className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col transition-colors duration-300"
        >
            {/* Logo */}
            <div className="p-6 pb-0">
                <Link href="/dashboard" className="flex items-center gap-2 mb-8 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-theme-primary to-theme-primary-dark flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-theme-primary transition-colors">MediStock</span>
                </Link>
            </div>

            {/* Menús */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
                {/* Menú Principal */}
                <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider px-2">Menú Principal</p>
                    <nav className="space-y-1">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            // Lógica isActive más robusta
                            const isActive = item.href === '/dashboard'
                                ? pathname === item.href // Coincidencia exacta para dashboard
                                : pathname.startsWith(item.href); // Coincidencia de prefijo para los demás

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    ref={(el) => { menuItemsRef.current[index] = el; }}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                                        isActive
                                            ? 'bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white shadow-md hover:shadow-lg'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon size={18} className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-theme-primary dark:group-hover:text-theme-primary-light'}`} />
                                    <span className="font-medium">{item.label}</span>
                                    {item.badge && (
                                        <Badge variant="destructive" className="ml-auto text-white bg-red-600 border-transparent">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Menú General */}
                <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider px-2">General</p>
                    <nav className="space-y-1">
                        {generalItems.map((item, index) => {
                            const Icon = item.icon;

                            // --- BOTÓN LOGOUT CON LÓGICA REAL ---
                            if (item.id === 'logout') {
                                return (
                                    <button
                                        key={item.id}
                                        onClick={signOut} // Llama a la función signOut real
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                );
                            }
                            // --- FIN BOTÓN LOGOUT ---

                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href || '#'}
                                    ref={(el) => { menuItemsRef.current[menuItems.length + index] = el; }}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                                        isActive
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon size={18} className={`transition-colors ${isActive ? 'text-theme-primary dark:text-theme-primary-light' : 'text-gray-400 dark:text-gray-500 group-hover:text-theme-primary dark:group-hover:text-theme-primary-light'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </aside>
    );
}