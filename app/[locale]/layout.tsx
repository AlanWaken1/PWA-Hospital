// app/[locale]/layout.tsx — Server Component: inyecta i18n y envuelve AppShell
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import AppShell from "@/components/app/AppShell";
import { locales } from "@/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // En Next.js 15, params es una Promise
  const { locale } = await params;

  // Carga mensajes en el servidor y provee el contexto a todo el árbol
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppShell>{children}</AppShell>
    </NextIntlClientProvider>
  );
}
