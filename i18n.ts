// i18n.ts - Configuración de internacionalización
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Idiomas soportados
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

// Idioma por defecto
export const defaultLocale: Locale = 'es';

// Configuración de next-intl
export default getRequestConfig(async ({ requestLocale }) => {
  // En Next.js 15, requestLocale puede ser una Promise
  let locale = await requestLocale;

  // Si no hay locale, usar el por defecto
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'America/Mexico_City',
    now: new Date(),
  };
});
