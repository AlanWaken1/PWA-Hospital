// app/(app)/layout.tsx
"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HospitalSidebar } from '@/components/shared/HospitalSidebar';
import Header from '@/components/shared/Header';
import { PWAMetaTags } from '@/components/PWAMetaTags';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user: contextUser, loading: contextLoading } = useAuth();
    const [supabaseUser, setSupabaseUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // ✅ TODOS LOS HOOKS AL INICIO (antes de cualquier return)

    // Verificar Supabase auth
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                setSupabaseUser(user);
            } catch (error) {
                console.error('Error checking Supabase auth:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Usuario combinado de todas las fuentes
    const user = contextUser || supabaseUser || (() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    })();

    // Protección de rutas
    useEffect(() => {
        if (!loading && !contextLoading && !user) {
            console.log('❌ No user found, redirecting to login');
            router.push('/auth/login');
        }
    }, [loading, contextLoading, user, router]);

    // Cierra sidebar en móvil al cambiar de página
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Debug
    useEffect(() => {
        if (user) {
            console.log('✅ User authenticated:', {
                email: user.email || user.user_metadata?.email,
                source: contextUser ? 'AuthContext' : supabaseUser ? 'Supabase' : 'localStorage'
            });
        }
    }, [user, contextUser, supabaseUser]);

    // ✅ AHORA SÍ, los early returns DESPUÉS de todos los hooks

    const segments = pathname.split('/').filter(Boolean);
    const currentPage = segments[segments.length - 1] || 'dashboard';

    // Loading state - USANDO COLORES DEL TEMA
    if (loading || contextLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
                <div className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-theme-primary to-theme-primary-dark flex items-center justify-center shadow-lg shadow-theme-primary/30">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Cargando MediStock...
                    </p>
                </div>
            </div>
        );
    }

    // Si no hay usuario, no renderiza
    if (!user) {
        return null;
    }

    // Render normal
    return (
        <>
            <PWAMetaTags />

            <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">

                {/* Overlay para móvil */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Cerrar menú"
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50 w-64
                        transform bg-white dark:bg-gray-900
                        transition-transform duration-300 ease-in-out
                        lg:static lg:translate-x-0
                        border-r border-gray-200 dark:border-gray-800
                        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                    `}
                >
                    <HospitalSidebar
                        currentPage={currentPage}
                        onPageChange={(page) => router.push(`/${page}`)}
                        LinkComponent={Link}
                    />
                </aside>

                {/* Contenedor principal */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    <Header
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    <main className="flex-1 overflow-y-auto">
                        <div className="h-full p-4 sm:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}