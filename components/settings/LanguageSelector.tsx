// components/settings/LanguageSelector.tsx
"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Check, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { locales, type Locale } from '@/i18n';

export function LanguageSelector() {
    const t = useTranslations('settings.language');
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();

    const languageOptions: { key: Locale; name: string; nativeName: string; flag: string; gradient: string }[] = [
        {
            key: 'es',
            name: t('spanish'),
            nativeName: 'Español',
            flag: '🇪🇸',
            gradient: 'from-red-500 via-yellow-500 to-red-500'
        },
        {
            key: 'en',
            name: t('english'),
            nativeName: 'English',
            flag: '🇺🇸',
            gradient: 'from-blue-600 via-white to-red-600'
        }
    ];

    const handleLanguageChange = (newLocale: Locale) => {
        if (newLocale === locale) return;

        // Guardar preferencia en cookie
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

        // Cambiar la ruta reemplazando el locale actual
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPathname);
        router.refresh();
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-theme-primary" />
                    {t('title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {languageOptions.map((option) => (
                    <motion.button
                        key={option.key}
                        onClick={() => handleLanguageChange(option.key)}
                        className={`
              relative p-6 rounded-2xl border-2 transition-all
              ${locale === option.key
                            ? 'border-theme-primary shadow-lg bg-theme-primary/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
            `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Flag preview */}
                        <div className="w-full h-20 rounded-xl mb-4 bg-gradient-to-r overflow-hidden flex items-center justify-center text-6xl shadow-lg">
                            {option.flag}
                        </div>

                        {/* Language name */}
                        <div className="text-center">
                            <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                {option.nativeName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {option.key === 'es' ? t('spanish_desc') : t('english_desc')}
                            </p>
                        </div>

                        {/* Check icon if selected */}
                        {locale === option.key && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white bg-theme-primary"
                            >
                                <Check size={16} />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Info section */}
            <div className="mt-6 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-start gap-3">
                    <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                            {t('current_language')} {locale === 'es' ? 'Español' : 'English'}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {t('restart_info')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
