// contexts/ColorThemeContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorTheme = 'blue' | 'green' | 'purple';

interface ColorThemeContextType {
    theme: ColorTheme;
    setTheme: (theme: ColorTheme) => void;
    colors: {
        primary: string;
        primaryDark: string;
        primaryLight: string;
        primaryRgb: string;
    };
}

const themes = {
    blue: {
        primary: '#0ea5e9',      // Sky blue brillante (tipo Next.js)
        primaryDark: '#0284c7',
        primaryLight: '#38bdf8',
        primaryRgb: '14, 165, 233',
        name: 'Azul Médico'
    },
    green: {
        primary: '#059669',      // Emerald (actual)
        primaryDark: '#047857',
        primaryLight: '#10b981',
        primaryRgb: '5, 150, 105',
        name: 'Verde Hospital'
    },
    purple: {
        primary: '#8b5cf6',      // Violet premium
        primaryDark: '#7c3aed',
        primaryLight: '#a78bfa',
        primaryRgb: '139, 92, 246',
        name: 'Morado Premium'
    }
};

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export function ColorThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ColorTheme>('blue'); // Azul por defecto
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Cargar tema guardado
        const savedTheme = localStorage.getItem('medistock-color-theme') as ColorTheme;
        if (savedTheme && themes[savedTheme]) {
            setThemeState(savedTheme);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const colors = themes[theme];
        const root = document.documentElement;

        // Actualizar CSS variables
        root.style.setProperty('--theme-primary', colors.primary);
        root.style.setProperty('--theme-primary-dark', colors.primaryDark);
        root.style.setProperty('--theme-primary-light', colors.primaryLight);
        root.style.setProperty('--theme-primary-rgb', colors.primaryRgb);

        // Actualizar data attribute para Tailwind
        root.setAttribute('data-color-theme', theme);

        // Actualizar meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', colors.primary);
        }

        // Guardar en localStorage
        localStorage.setItem('medistock-color-theme', theme);

        // Log para debug
        console.log(`🎨 Tema cambiado a: ${colors.name}`);
    }, [theme, mounted]);

    const setTheme = (newTheme: ColorTheme) => {
        setThemeState(newTheme);
    };

    const value = {
        theme,
        setTheme,
        colors: themes[theme]
    };

    return (
        <ColorThemeContext.Provider value={value}>
            {children}
        </ColorThemeContext.Provider>
    );
}

export function useColorTheme() {
    const context = useContext(ColorThemeContext);
    if (context === undefined) {
        throw new Error('useColorTheme must be used within a ColorThemeProvider');
    }
    return context;
}

export { themes };