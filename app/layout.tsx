// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google"; // <-- CORREGIDO: Importa Geist así
import { ThemeProvider } from "@/contexts/ThemeContext"; // <-- CORREGIDO: Usa tu ThemeProvider (Ajusta ruta!)
import { AuthProvider } from "@/contexts/AuthContext";   // <-- Usa tu AuthProvider simulado (Ajusta ruta!)
import PWASetup from '@/components/shared/PWASetup';    // <-- Ahora sí existe
import { PWAMetaTags } from '@/components/PWAMetaTags';

import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

// Viewport para PWA (sin cambios)
export const viewport: Viewport = {
    themeColor: '#059669',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    width: 'device-width',
};

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "MediStock - Inventario Hospitalario",
    description: "Sistema PWA para gestión de inventario médico.",
    manifest: '/api/manifest',
    icons: {
        icon: '/favicon.ico',
        apple: '/icons/icon-192x192.png',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'MediStock',
    },
};

// CORREGIDO: Configura la fuente Geist como en el template
const geistSans = Geist({
    variable: "--font-geist-sans", // Lo usamos como variable CSS
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // CORREGIDO: Aplica la clase de la fuente variable
        <html lang="es" className={geistSans.variable} suppressHydrationWarning>
        <body className="antialiased bg-background text-foreground">
        {/* CORREGIDO: Usa TU ThemeProvider */}
        <ThemeProvider>
            <AuthProvider>
                {children}
                <PWASetup />
                <PWAMetaTags />
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}