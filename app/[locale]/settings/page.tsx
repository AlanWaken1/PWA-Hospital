// app/[locale]/settings/page.tsx
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ColorThemeSelector } from '@/components/settings/ColorThemeSelector';
import { LanguageSelector } from '@/components/settings/LanguageSelector';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { NotificationsSection } from '@/components/settings/NotificationsSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings as SettingsIcon, Palette, Bell, Shield, User, Moon, Sun, Monitor, ChevronRight, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
    const t = useTranslations();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('appearance');

    return (
        <div className="min-h-screen pb-20 lg:pb-6">
            {/* Header - Responsive */}
            <div className="mb-6 lg:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-theme-primary to-theme-primary-dark rounded-xl">
                        <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                            {t('settings.title')}
                        </h1>
                    </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-0 sm:ml-14">
                    {t('settings.subtitle')}
                </p>
            </div>

            {/* Mobile: Cards Navigation */}
            <div className="block lg:hidden mb-6 space-y-2">
                <button
                    onClick={() => setActiveTab('appearance')}
                    className={`
                        w-full p-4 rounded-xl flex items-center justify-between transition-all
                        ${activeTab === 'appearance'
                        ? 'bg-gradient-to-br from-theme-primary/20 to-theme-primary/10 border-2 border-theme-primary shadow-lg shadow-theme-primary/20'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-theme-primary/30'
                    }
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeTab === 'appearance' ? 'bg-theme-primary/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <Palette size={20} className={activeTab === 'appearance' ? 'text-theme-primary' : 'text-gray-600 dark:text-gray-400'} />
                        </div>
                        <span className={`font-medium ${activeTab === 'appearance' ? 'text-theme-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                            {t('settings.tabs.appearance')}
                        </span>
                    </div>
                    <ChevronRight size={20} className={activeTab === 'appearance' ? 'text-theme-primary' : 'text-gray-400'} />
                </button>

                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`
                        w-full p-4 rounded-xl flex items-center justify-between transition-all
                        ${activeTab === 'notifications'
                        ? 'bg-gradient-to-br from-theme-primary/20 to-theme-primary/10 border-2 border-theme-primary shadow-lg shadow-theme-primary/20'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-theme-primary/30'
                    }
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeTab === 'notifications' ? 'bg-theme-primary/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <Bell size={20} className={activeTab === 'notifications' ? 'text-theme-primary' : 'text-gray-600 dark:text-gray-400'} />
                        </div>
                        <span className={`font-medium ${activeTab === 'notifications' ? 'text-theme-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                            {t('settings.tabs.notifications')}
                        </span>
                    </div>
                    <ChevronRight size={20} className={activeTab === 'notifications' ? 'text-theme-primary' : 'text-gray-400'} />
                </button>

                <button
                    onClick={() => setActiveTab('account')}
                    className={`
                        w-full p-4 rounded-xl flex items-center justify-between transition-all
                        ${activeTab === 'account'
                        ? 'bg-gradient-to-br from-theme-primary/20 to-theme-primary/10 border-2 border-theme-primary shadow-lg shadow-theme-primary/20'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-theme-primary/30'
                    }
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeTab === 'account' ? 'bg-theme-primary/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <User size={20} className={activeTab === 'account' ? 'text-theme-primary' : 'text-gray-600 dark:text-gray-400'} />
                        </div>
                        <span className={`font-medium ${activeTab === 'account' ? 'text-theme-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                            {t('settings.tabs.account')}
                        </span>
                    </div>
                    <ChevronRight size={20} className={activeTab === 'account' ? 'text-theme-primary' : 'text-gray-400'} />
                </button>

                <button
                    onClick={() => setActiveTab('security')}
                    className={`
                        w-full p-4 rounded-xl flex items-center justify-between transition-all
                        ${activeTab === 'security'
                        ? 'bg-gradient-to-br from-theme-primary/20 to-theme-primary/10 border-2 border-theme-primary shadow-lg shadow-theme-primary/20'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-theme-primary/30'
                    }
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeTab === 'security' ? 'bg-theme-primary/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <Shield size={20} className={activeTab === 'security' ? 'text-theme-primary' : 'text-gray-600 dark:text-gray-400'} />
                        </div>
                        <span className={`font-medium ${activeTab === 'security' ? 'text-theme-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                            {t('settings.tabs.security')}
                        </span>
                    </div>
                    <ChevronRight size={20} className={activeTab === 'security' ? 'text-theme-primary' : 'text-gray-400'} />
                </button>

                <button
                    onClick={() => setActiveTab('language')}
                    className={`
                        w-full p-4 rounded-xl flex items-center justify-between transition-all
                        ${activeTab === 'language'
                        ? 'bg-gradient-to-br from-theme-primary/20 to-theme-primary/10 border-2 border-theme-primary shadow-lg shadow-theme-primary/20'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-theme-primary/30'
                    }
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeTab === 'language' ? 'bg-theme-primary/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <Globe size={20} className={activeTab === 'language' ? 'text-theme-primary' : 'text-gray-600 dark:text-gray-400'} />
                        </div>
                        <span className={`font-medium ${activeTab === 'language' ? 'text-theme-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                            {t('settings.tabs.language')}
                        </span>
                    </div>
                    <ChevronRight size={20} className={activeTab === 'language' ? 'text-theme-primary' : 'text-gray-400'} />
                </button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Desktop TabsList */}
                <TabsList className="hidden lg:grid w-full grid-cols-5 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <TabsTrigger
                        value="appearance"
                        className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-lg"
                    >
                        <Palette size={16} />
                        {t('settings.tabs.appearance')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-lg"
                    >
                        <Bell size={16} />
                        {t('settings.tabs.notifications')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="account"
                        className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-lg"
                    >
                        <User size={16} />
                        {t('settings.tabs.account')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-lg"
                    >
                        <Shield size={16} />
                        {t('settings.tabs.security')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="language"
                        className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-lg"
                    >
                        <Globe size={16} />
                        {t('settings.tabs.language')}
                    </TabsTrigger>
                </TabsList>

                {/* Apariencia Tab */}
                <TabsContent value="appearance" className="mt-0">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Selector de Color del Tema */}
                        <Card className="p-4 sm:p-6">
                            <ColorThemeSelector />
                        </Card>

                        {/* Selector de Modo Oscuro/Claro */}
                        <Card className="p-4 sm:p-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                                        <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-theme-primary" />
                                        {t('settings.appearance.display_mode.title')}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        {t('settings.appearance.display_mode.subtitle')}
                                    </p>
                                </div>

                                {/* Grid de opciones de tema - Responsive */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                    {/* Modo Claro */}
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`
                                            relative group p-4 sm:p-6 rounded-xl border-2 transition-all duration-200
                                            ${theme === 'light'
                                            ? 'border-theme-primary bg-theme-primary/5 shadow-lg shadow-theme-primary/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-theme-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }
                                        `}
                                    >
                                        {theme === 'light' && (
                                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-theme-primary rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className={`
                                            w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center
                                            ${theme === 'light'
                                            ? 'bg-theme-primary text-white'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                        }
                                        `}>
                                            <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <div className="text-center">
                                            <h4 className={`text-sm sm:text-base font-semibold mb-1 ${theme === 'light' ? 'text-theme-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {t('settings.appearance.display_mode.light')}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {t('settings.appearance.display_mode.light_desc')}
                                            </p>
                                        </div>

                                        <div className="mt-3 sm:mt-4 h-12 sm:h-16 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <div className="h-2 sm:h-3 bg-gray-100 border-b border-gray-200"></div>
                                            <div className="p-1.5 sm:p-2 space-y-1">
                                                <div className="h-1.5 sm:h-2 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-1.5 sm:h-2 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Modo Oscuro */}
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`
                                            relative group p-4 sm:p-6 rounded-xl border-2 transition-all duration-200
                                            ${theme === 'dark'
                                            ? 'border-theme-primary bg-theme-primary/5 shadow-lg shadow-theme-primary/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-theme-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }
                                        `}
                                    >
                                        {theme === 'dark' && (
                                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-theme-primary rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className={`
                                            w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center
                                            ${theme === 'dark'
                                            ? 'bg-theme-primary text-white'
                                            : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                        }
                                        `}>
                                            <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <div className="text-center">
                                            <h4 className={`text-sm sm:text-base font-semibold mb-1 ${theme === 'dark' ? 'text-theme-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {t('settings.appearance.display_mode.dark')}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {t('settings.appearance.display_mode.dark_desc')}
                                            </p>
                                        </div>

                                        <div className="mt-3 sm:mt-4 h-12 sm:h-16 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                                            <div className="h-2 sm:h-3 bg-gray-800 border-b border-gray-700"></div>
                                            <div className="p-1.5 sm:p-2 space-y-1">
                                                <div className="h-1.5 sm:h-2 bg-gray-700 rounded w-3/4"></div>
                                                <div className="h-1.5 sm:h-2 bg-gray-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Modo Automático */}
                                    <button
                                        onClick={() => setTheme('auto')}
                                        className={`
                                            relative group p-4 sm:p-6 rounded-xl border-2 transition-all duration-200
                                            ${theme === 'auto'
                                            ? 'border-theme-primary bg-theme-primary/5 shadow-lg shadow-theme-primary/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-theme-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }
                                        `}
                                    >
                                        {theme === 'auto' && (
                                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-theme-primary rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className={`
                                            w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center
                                            ${theme === 'auto'
                                            ? 'bg-theme-primary text-white'
                                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                        }
                                        `}>
                                            <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <div className="text-center">
                                            <h4 className={`text-sm sm:text-base font-semibold mb-1 ${theme === 'auto' ? 'text-theme-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {t('settings.appearance.display_mode.auto')}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {t('settings.appearance.display_mode.auto_desc')}
                                            </p>
                                        </div>

                                        <div className="mt-3 sm:mt-4 h-12 sm:h-16 bg-gradient-to-r from-white to-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                                            <div className="h-2 sm:h-3 bg-gradient-to-r from-gray-100 to-gray-800 border-b border-gray-300"></div>
                                            <div className="p-1.5 sm:p-2 space-y-1 flex gap-2">
                                                <div className="h-1.5 sm:h-2 bg-gray-200 rounded w-1/2"></div>
                                                <div className="h-1.5 sm:h-2 bg-gray-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {/* Info adicional */}
                                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                                            {t('settings.appearance.display_mode.current_mode')} {theme === 'light' ? t('settings.appearance.display_mode.light') : theme === 'dark' ? t('settings.appearance.display_mode.dark') : t('settings.appearance.display_mode.auto')}
                                        </p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            {theme === 'auto'
                                                ? t('settings.appearance.display_mode.auto_info')
                                                : `${t('settings.appearance.display_mode.mode_info')} ${theme === 'light' ? t('settings.appearance.display_mode.light').toLowerCase() : t('settings.appearance.display_mode.dark').toLowerCase()}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* Notificaciones Tab */}
                <TabsContent value="notifications" className="mt-0">
                    <Card className="p-4 sm:p-6">
                        <NotificationsSection />
                    </Card>
                </TabsContent>

                {/* Cuenta Tab */}
                <TabsContent value="account" className="mt-0">
                    <Card className="p-4 sm:p-6">
                        <ProfileSection />
                    </Card>
                </TabsContent>

                {/* Seguridad Tab */}
                <TabsContent value="security" className="mt-0">
                    <Card className="p-4 sm:p-6">
                        <SecuritySection />
                    </Card>
                </TabsContent>

                {/* Idioma Tab */}
                <TabsContent value="language" className="mt-0">
                    <Card className="p-4 sm:p-6">
                        <LanguageSelector />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}