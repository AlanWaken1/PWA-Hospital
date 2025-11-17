// contexts/AuthContext.tsx - VERSIÓN OFFLINE-AWARE
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { isOnline } from '@/lib/offline/sync'; // ← IMPORTAR

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // ✅ PASO 1: Cargar sesión desde localStorage PRIMERO (funciona offline)
        const loadStoredSession = () => {
            try {
                const storedSession = localStorage.getItem('supabase.auth.session');
                if (storedSession) {
                    const parsedSession = JSON.parse(storedSession);
                    console.log('📦 Sesión cargada desde localStorage (offline-safe)');
                    setSession(parsedSession);
                    setUser(parsedSession.user);
                    return true;
                }
            } catch (error) {
                console.error('Error cargando sesión desde localStorage:', error);
            }
            return false;
        };

        // Cargar sesión desde localStorage
        const hasStoredSession = loadStoredSession();

        // ✅ PASO 2: Si hay internet, verificar con Supabase
        const initializeAuth = async () => {
            try {
                // Solo verificar con Supabase si hay internet
                if (!isOnline()) {
                    console.log('📴 Offline: Usando sesión de localStorage');
                    setLoading(false);
                    return;
                }

                console.log('🌐 Online: Verificando sesión con Supabase');

                // Obtener sesión de Supabase
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();

                if (error) {
                    // Si hay error pero tenemos sesión local, mantenerla
                    if (hasStoredSession) {
                        console.log('⚠️ Error en Supabase, pero manteniendo sesión local');
                    } else {
                        throw error;
                    }
                } else if (currentSession) {
                    console.log('✅ Sesión verificada con Supabase');
                    setSession(currentSession);
                    setUser(currentSession.user);

                    // Guardar en localStorage para offline
                    localStorage.setItem('supabase.auth.session', JSON.stringify(currentSession));
                } else {
                    // No hay sesión en Supabase ni en localStorage
                    console.log('❌ No hay sesión');
                    setSession(null);
                    setUser(null);
                    localStorage.removeItem('supabase.auth.session');
                }
            } catch (error) {
                console.error('Error inicializando auth:', error);

                // Si hay error pero tenemos sesión local, mantenerla
                if (!hasStoredSession) {
                    setSession(null);
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // ✅ PASO 3: Escuchar cambios de auth (solo funciona online)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, currentSession: Session | null) => {
                console.log('🔄 Auth state changed:', { event, email: currentSession?.user?.email });

                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    setSession(currentSession);
                    setUser(currentSession?.user ?? null);

                    // Guardar en localStorage
                    if (currentSession) {
                        localStorage.setItem('supabase.auth.session', JSON.stringify(currentSession));
                    }
                } else if (event === 'SIGNED_OUT') {
                    setSession(null);
                    setUser(null);
                    localStorage.removeItem('supabase.auth.session');
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            // Limpiar localStorage primero
            localStorage.removeItem('supabase.auth.session');
            setSession(null);
            setUser(null);

            // Solo intentar cerrar sesión en Supabase si hay internet
            if (isOnline()) {
                await supabase.auth.signOut();
                console.log('✅ Sesión cerrada (online)');
            } else {
                console.log('📴 Sesión cerrada localmente (offline)');
            }
        } catch (error) {
            console.error('Error cerrando sesión:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}