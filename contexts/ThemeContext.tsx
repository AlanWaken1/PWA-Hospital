"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    // Añadimos un flag para saber si ya cargó del localStorage
    isThemeLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // 1. Inicializa con un valor por defecto (ej. 'auto'), SIN localStorage aquí
    const [theme, setThemeState] = useState<Theme>('auto');
    // 2. Estado para saber si ya leímos de localStorage
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);

    // 3. USA useEffect para LEER de localStorage SOLO en el cliente
    useEffect(() => {
        const storedTheme = localStorage.getItem('medistock_theme') as Theme | null;
        const initialTheme = storedTheme || 'auto';
        setThemeState(initialTheme);
        setIsThemeLoaded(true); // Marcamos que ya cargamos el tema inicial
        // Aplicamos el tema inicial al HTML aquí también
        applyTheme(initialTheme);
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    // Función para aplicar el tema al <html> (necesaria en ambos useEffects)
    const applyTheme = (themeToApply: Theme) => {
        if (typeof window !== 'undefined') { // Asegura que solo corra en el cliente
            if (themeToApply === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', prefersDark);
            } else {
                document.documentElement.classList.toggle('dark', themeToApply === 'dark');
            }
        }
    };

    // 4. USA useEffect para ESCRIBIR en localStorage y APLICAR cambios
    useEffect(() => {
        // Solo guarda y aplica si ya cargamos el tema inicial
        if (isThemeLoaded) {
            localStorage.setItem('medistock_theme', theme);
            applyTheme(theme);
        }

        // Listener para el modo 'auto' (solo si ya cargó el tema)
        if (theme === 'auto' && isThemeLoaded && typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('auto'); // Re-aplica basado en preferencia
            mediaQuery.addEventListener('change', handleChange);
            // Aplica al montar por si acaso cambió mientras no estaba el listener
            handleChange();
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme, isThemeLoaded]); // Depende de theme y de si ya cargó

    // Función seteadora que actualiza el estado
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };


    return (
        <ThemeContext.Provider value={{ theme, setTheme, isThemeLoaded }}>
            {/* Opcional: Podrías no renderizar children hasta que isThemeLoaded sea true
           para evitar un flash de tema incorrecto, aunque puede causar layout shift.
           {!isThemeLoaded ? null : children} */}
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}