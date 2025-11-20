// components/settings/ColorThemeSelector.tsx
"use client";

import { useColorTheme, themes, ColorTheme } from '@/contexts/ColorThemeContext';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export function ColorThemeSelector() {
    const t = useTranslations('settings.appearance.color_theme');
    const { theme: currentTheme, setTheme } = useColorTheme();

    const themeOptions: { key: ColorTheme; name: string; color: string; gradient: string }[] = [
        {
            key: 'blue',
            name: t('blue'),
            color: '#0ea5e9',
            gradient: 'from-sky-500 to-blue-600'
        },
        {
            key: 'green',
            name: t('green'),
            color: '#059669',
            gradient: 'from-theme-primary-light to-green-600'
        },
        {
            key: 'purple',
            name: t('purple'),
            color: '#8b5cf6',
            gradient: 'from-violet-500 to-purple-600'
        }
    ];

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t('title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                    <motion.button
                        key={option.key}
                        onClick={() => setTheme(option.key)}
                        className={`
              relative p-6 rounded-2xl border-2 transition-all
              ${currentTheme === option.key
                            ? 'border-current shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
            `}
                        style={{
                            borderColor: currentTheme === option.key ? option.color : undefined
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Color preview */}
                        <div className={`
              w-full h-20 rounded-xl mb-4 bg-gradient-to-br ${option.gradient}
              shadow-lg
            `} style={{
                            boxShadow: currentTheme === option.key
                                ? `0 10px 30px -5px ${option.color}40`
                                : undefined
                        }} />

                        {/* Theme name */}
                        <div className="text-center">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {option.name}
                            </p>
                        </div>

                        {/* Check icon if selected */}
                        {currentTheme === option.key && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: option.color }}
                            >
                                <Check size={16} />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Preview section */}
            <div className="mt-6 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('preview_title')}
                </p>
                <div className="space-y-3">
                    {/* Button preview */}
                    <button
                        className="px-6 py-3 rounded-xl text-white font-medium shadow-lg transition-all hover:shadow-xl"
                        style={{
                            background: `linear-gradient(to right, ${themes[currentTheme].primary}, ${themes[currentTheme].primaryDark})`,
                            boxShadow: `0 10px 20px -5px ${themes[currentTheme].primary}40`
                        }}
                    >
                        {t('preview_button')}
                    </button>

                    {/* Badge preview */}
                    <div className="flex gap-2">
            <span
                className="px-3 py-1 rounded-lg text-sm font-medium"
                style={{
                    backgroundColor: `${themes[currentTheme].primary}20`,
                    color: themes[currentTheme].primaryDark
                }}
            >
              {t('preview_badge')}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}