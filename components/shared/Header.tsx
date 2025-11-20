// components/shared/Header.tsx - ARREGLADO Y FUNCIONAL
"use client";

import { Menu, Sun, Moon, User, Settings, LogOut } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
    const t = useTranslations();
    const locale = useLocale();
    // @ts-ignore
    const { isDark, toggleTheme } = useTheme();
    // @ts-ignore
    const { user, profile } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push(`/${locale}/auth/login`);
        router.refresh();
    };

    // ⭐ NUEVO: Navegación a Mi Perfil
    const handleGoToProfile = () => {
        router.push(`/${locale}/personal`);
    };

    // ⭐ NUEVO: Navegación a Configuración
    const handleGoToSettings = () => {
        router.push(`/${locale}/settings`);
    };

    return (
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

                {/* Left side - Menu button (mobile) */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Center - Empty or breadcrumbs */}
                <div className="flex-1 lg:ml-0 ml-4">
                    {/* Puedes agregar búsqueda aquí después */}
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">

                    {/* Notification Bell - Ya funciona bien */}
                    <NotificationBell />

                    {/* Theme toggle - ARREGLADO */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label={t('settings.appearance.display_mode.title')}
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    {/* User menu - ARREGLADO con onClick en cada opción */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                {/* Avatar con inicial */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-theme-primary to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {profile?.nombre_completo?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                {/* Nombre (solo en desktop) */}
                                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                                    {profile?.nombre_completo?.split(' ')[0] || t('common.user', 'Usuario')}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {profile?.nombre_completo || t('common.user', 'Usuario')}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user?.email}
                                    </p>
                                    {profile?.rol && (
                                        <p className="text-xs text-theme-primary font-medium">
                                            {t(`auth.roles.${profile.rol}`, profile.rol.charAt(0).toUpperCase() + profile.rol.slice(1))}
                                        </p>
                                    )}
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* ⭐ ARREGLADO: onClick para navegar */}
                            <DropdownMenuItem
                                onClick={handleGoToProfile}
                                className="cursor-pointer"
                            >
                                <User className="w-4 h-4 mr-2" />
                                {t('common.profile', 'Mi perfil')}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={handleGoToSettings}
                                className="cursor-pointer"
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                {t('navigation.settings')}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleSignOut}
                                className="text-red-600 focus:text-red-600 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                {t('navigation.logout')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}