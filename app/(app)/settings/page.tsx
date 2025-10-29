// app/(app)/settings/page.tsx
"use client";

import { useState } from 'react';
import { ColorThemeSelector } from '@/components/settings/ColorThemeSelector';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings as SettingsIcon, Palette, Bell, Shield, User, Moon, Sun, Monitor } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Configuración
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Personaliza tu experiencia en MediStock
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
                    <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Palette size={16} />
                        <span className="hidden sm:inline">Apariencia</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell size={16} />
                        <span className="hidden sm:inline">Notificaciones</span>
                    </TabsTrigger>
                    <TabsTrigger value="account" className="flex items-center gap-2">
                        <User size={16} />
                        <span className="hidden sm:inline">Cuenta</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield size={16} />
                        <span className="hidden sm:inline">Seguridad</span>
                    </TabsTrigger>
                </TabsList>

                {/* Apariencia Tab */}
                <TabsContent value="appearance" className="mt-6">
                    <div className="space-y-6">
                        {/* Selector de Color del Tema */}
                        <Card className="p-6">
                            <ColorThemeSelector />
                        </Card>

                        {/* Selector de Modo Oscuro/Claro - MODERNIZADO */}
                        <Card className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                                        <Moon size={24} className="text-theme-primary" />
                                        Modo de Apariencia
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Selecciona cómo quieres ver MediStock
                                    </p>
                                </div>

                                {/* Grid de opciones de tema */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Modo Claro */}
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`
                                            relative group p-6 rounded-xl border-2 transition-all duration-200
                                            ${theme === 'light'
                                            ? 'border-theme-primary bg-theme-primary/5 shadow-lg shadow-theme-primary/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-theme-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }
                                        `}
                                    >
                                        {/* Checkmark si está activo */}
                                        {theme === 'light' && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Icono */}
                                        <div className={`
                                            w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center
                                            ${theme === 'light'
                                            ? 'bg-theme-primary text-white'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                        }
                                        `}>
                                            <Sun size={24} />
                                        </div>

                                        {/* Texto */}
                                        <div className="text-center">
                                            <h4 className={`font-semibold mb-1 ${theme === 'light' ? 'text-theme-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                                Modo Claro
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Interfaz brillante y luminosa
                                            </p>
                                        </div>

                                        {/* Preview mini */}
                                        <div className="mt-4 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <div className="h-3 bg-gray-100 border-b border-gray-200"></div>
                                            <div className="p-2 space-y-1">
                                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Modo Oscuro */}
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`
                                            relative group p-6 rounded-xl border-2 transition-all duration-200
                                            ${theme === 'dark'
                                            ? 'border-theme-primary bg-theme-primary/5 shadow-lg shadow-theme-primary/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-theme-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }
                                        `}
                                    >
                                        {theme === 'dark' && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className={`
                                            w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center
                                            ${theme === 'dark'
                                            ? 'bg-theme-primary text-white'
                                            : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                        }
                                        `}>
                                            <Moon size={24} />
                                        </div>

                                        <div className="text-center">
                                            <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-theme-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                                Modo Oscuro
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Ideal para ambientes con poca luz
                                            </p>
                                        </div>

                                        <div className="mt-4 h-16 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                                            <div className="h-3 bg-gray-800 border-b border-gray-700"></div>
                                            <div className="p-2 space-y-1">
                                                <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                                                <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Modo Automático */}
                                    <button
                                        onClick={() => setTheme('auto')}
                                        className={`
                                            relative group p-6 rounded-xl border-2 transition-all duration-200
                                            ${theme === 'auto'
                                            ? 'border-theme-primary bg-theme-primary/5 shadow-lg shadow-theme-primary/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-theme-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }
                                        `}
                                    >
                                        {theme === 'auto' && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className={`
                                            w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center
                                            ${theme === 'auto'
                                            ? 'bg-theme-primary text-white'
                                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                        }
                                        `}>
                                            <Monitor size={24} />
                                        </div>

                                        <div className="text-center">
                                            <h4 className={`font-semibold mb-1 ${theme === 'auto' ? 'text-theme-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                                Automático
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Se adapta a tu sistema
                                            </p>
                                        </div>

                                        <div className="mt-4 h-16 bg-gradient-to-r from-white to-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                                            <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-800 border-b border-gray-300"></div>
                                            <div className="p-2 space-y-1 flex gap-2">
                                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                                <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {/* Info adicional */}
                                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                                            Modo actual: {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Oscuro' : 'Automático'}
                                        </p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            {theme === 'auto'
                                                ? 'El tema cambiará automáticamente según la configuración de tu sistema operativo'
                                                : `Tu interfaz está en modo ${theme === 'light' ? 'claro' : 'oscuro'}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* Notificaciones Tab */}
                <TabsContent value="notifications" className="mt-6">
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Preferencias de Notificaciones
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Configura cómo deseas recibir notificaciones
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            Alertas de Stock Bajo
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Recibe notificaciones cuando el stock esté bajo
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-theme-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-theme-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            Notificaciones de Movimientos
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Notificaciones sobre entradas y salidas de inventario
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-theme-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-theme-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            Sonido de Notificaciones
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Reproducir sonido al recibir notificaciones
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-theme-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-theme-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Cuenta Tab */}
                <TabsContent value="account" className="mt-6">
                    <Card className="p-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Información de la Cuenta
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Administra tu información personal
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Esta sección estará disponible próximamente
                            </p>
                        </div>
                    </Card>
                </TabsContent>

                {/* Seguridad Tab */}
                <TabsContent value="security" className="mt-6">
                    <Card className="p-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Configuración de Seguridad
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Protege tu cuenta y tus datos
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Esta sección estará disponible próximamente
                            </p>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}