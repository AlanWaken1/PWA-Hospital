// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ColorThemeProvider } from '@/contexts/ColorThemeContext';
import { OfflineIndicator } from '@/components/shared/OfflineIndicator';
import PWASetup from '@/components/shared/PWASetup';
import "./globals.css";
import "./theme-colors.css";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

// Viewport para PWA
export const viewport: Viewport = {
    themeColor: '#0ea5e9', // Azul por defecto
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    width: 'device-width',
};

// Metadata
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
    openGraph: {
        title: "MediStock - Inventario Hospitalario",
        description: "Sistema PWA para gestión de inventario médico.",
        url: defaultUrl,
        siteName: "MediStock",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "MediStock - Inventario Hospitalario",
        description: "Sistema PWA para gestión de inventario médico.",
    },
};

// Configura la fuente Geist
const geistSans = Geist({
    variable: "--font-geist-sans",
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={geistSans.variable} suppressHydrationWarning>
        <body className="antialiased bg-background text-foreground">
        <ColorThemeProvider> {/* ← NUEVO: Provider de temas de color */}
            <ThemeProvider>
                <AuthProvider>
                    {children}
                    <PWASetup />
                    <OfflineIndicator />
                </AuthProvider>
            </ThemeProvider>
        </ColorThemeProvider>
        </body>
        </html>
    );
}