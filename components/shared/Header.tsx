// components/shared/Header.tsx
"use client";

import { useRef, useEffect, useState } from 'react';
import { Menu, X, Search, Mail, Bell, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Verifica ruta
import { createClient } from '@/lib/supabase/client';        // Cliente Supabase del navegador
import { User } from '@supabase/supabase-js';
import gsap from 'gsap'; // Asegúrate que esté instalado: npm install gsap
import { ThemeSwitcher } from '@/components/theme-switcher'; // Verifica ruta y existencia
import { LogoutButton } from '@/components/auth/logout-button';
import Link from "next/link";
import {Button} from "@/components/ui/button";   // Verifica ruta y existencia

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

// Helper para obtener iniciales (mejorado para manejar nombres de una sola palabra)
const getInitials = (name?: string | null): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean); // Filtra espacios extra
    if (parts.length === 1 && parts[0].length > 0) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    if (parts.length >= 2) {
        // Usa la primera letra del primer nombre y la primera del último nombre/apellido
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    // Fallback si el nombre es raro o vacío después de trim/split
    return name.substring(0, 2).toUpperCase() || 'U';
};

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
    const headerRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Obtener usuario de Supabase al montar el componente
    useEffect(() => {
        let isMounted = true; // Para evitar actualizaciones si el componente se desmonta rápido
        const fetchUser = async () => {
            setLoadingUser(true);
            const supabase = createClient();
            const { data: { user: currentUser }, error } = await supabase.auth.getUser();

            if (isMounted) {
                if (!error && currentUser) {
                    setUser(currentUser);
                } else if (error) {
                    console.error("Error fetching user:", error.message);
                }
                setLoadingUser(false);
            }
        };
        fetchUser();

        // Listener para cambios de autenticación (login/logout en otra pestaña)
        const supabase = createClient();
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (isMounted) {
                setUser(session?.user ?? null);
                setLoadingUser(false); // Asegura que el loading termine
            }
        });


        // Cleanup al desmontar
        return () => {
            isMounted = false;
            authListener?.subscription.unsubscribe();
        };
    }, []);

    // Animación GSAP (se ejecuta una vez al montar)
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                y: -20,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out',
            });
        });
        return () => ctx.revert(); // Limpia la animación al desmontar
    }, []); // Array vacío para que corra solo una vez

    return (
        <div
            ref={headerRef}
            className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors shadow-sm" // Añadí shadow-sm
        >
            <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Mobile Menu + Search */}
                    <div className="flex items-center gap-3 flex-1"> {/* Quitamos max-w-2xl para que se ajuste mejor */}
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md"> {/* Ajustamos max-w */}
                            {/* Ocultar en pantallas muy pequeñas, mostrar desde sm */}
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                <input
                                    type="search" // Cambiado a search
                                    placeholder="Buscar..." // Simplificado
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions + User Profile */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Theme Switcher */}
                        <ThemeSwitcher />

                        {/* Mail Icon */}
                        <button
                            className="hidden sm:flex w-8 h-8 items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" // Ajustado tamaño y redondeo
                            aria-label="Mensajes"
                        >
                            <Mail size={18} />
                        </button>

                        {/* Bell Icon */}
                        <button
                            className="relative flex w-8 h-8 items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" // Ajustado tamaño y redondeo
                            aria-label="Notificaciones"
                        >
                            <Bell size={18} />
                            {/* Badge */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                                <span className="text-white text-[9px] font-bold leading-none">3</span>
                            </div>
                        </button>

                        {/* Separador */}
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1"></div>

                        {/* User Profile */}
                        <div className="relative flex items-center gap-2">
                            {loadingUser ? (
                                // Skeleton Loader mientras carga el usuario
                                <div className='flex items-center gap-2'>
                                    <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse'></div>
                                    <div className='hidden md:flex flex-col gap-1'>
                                        <div className='h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                                        <div className='h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
                                    </div>
                                </div>
                            ) : user ? (
                                // Mostrar info del usuario (podrías envolver esto en un DropdownMenu de shadcn)
                                <>
                                    <Avatar className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-emerald-500/50 transition-all">
                                        {/* Podrías añadir AvatarImage si guardas la URL en metadata */}
                                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-medium text-sm">
                                            {getInitials(user?.user_metadata?.nombre_completo || user?.email)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="hidden md:flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight truncate max-w-[150px]" title={user?.user_metadata?.nombre_completo || user?.email || ''}>
                      {user?.user_metadata?.nombre_completo || user?.email}
                    </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight capitalize">
                      {user?.user_metadata?.rol || 'Miembro'}
                    </span>
                                    </div>
                                    {/* <ChevronDown size={16} className="hidden md:block text-gray-400 cursor-pointer ml-1" /> */}

                                </>
                            ) : (
                                // Si no hay usuario (error o no logueado)
                                <Link href="/auth/login">
                                    <Button variant="outline" size="sm">Iniciar Sesión</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}