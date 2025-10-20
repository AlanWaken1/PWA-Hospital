// app/(app)/layout.tsx (o app/protected/layout.tsx)
"use client"; // Esencial porque usa estado y hooks del navegador

import { useState, ReactNode } from 'react';
import { usePathname, useRouter, redirect } from 'next/navigation'; // Importa redirect
import Link from 'next/link'; // Importa Link
import { HospitalSidebar } from '@/components/shared/HospitalSidebar'; // Ajusta la ruta a tu componente
import Header from '@/components/shared/Header';           // Ajusta la ruta a tu componente


// TEMPORAL HASTA INTEGRAR SUPABASE AUTH REAL
// Simula el hook useAuth si aún no tienes Supabase conectado
// ELIMINA ESTO cuando uses Supabase Auth real y descomenta la línea de arriba
const useAuth = () => {
    // Simula un usuario logueado para que el layout se muestre
    const user = { nombre_completo: 'Usuario Demo', email: 'demo@hospital.com' };
    const loading = false;
    const signOut = () => console.log("Simulando signOut");
    return { user, loading, signOut };
};
// --- FIN TEMPORAL ---


export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, loading } = useAuth(); // Usamos el hook (temporal o real)

    // --- Protección de Ruta (Básico - Supabase Middleware hará esto mejor) ---
    // Si aún no ha cargado el estado de auth, muestra un loader o nada
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                Cargando... {/* O un componente Loader */}
            </div>
        );
    }
    // Si no hay usuario y no está cargando, redirige al login
    // ¡OJO! El middleware de Supabase hará esto de forma más robusta
    /*
    useEffect(() => {
      if (!loading && !user) {
        redirect('/auth/login'); // O la ruta que uses
      }
    }, [loading, user]);

    // Si redirige, no renderiza el resto
    if (!user) {
      return null;
    }
    */
    // --- Fin Protección de Ruta ---


    // Obtiene la página actual de la URL (ej: 'dashboard', 'inventario')
    // Usamos .split('/').filter(Boolean).pop() para manejar rutas anidadas si las hubiera
    const currentPage = pathname.split('/').filter(Boolean).pop() || 'dashboard';

    const handlePageChange = (page: string) => {
        // Usamos Link de Next.js para la navegación en el sidebar
        // por lo que esta función ya no es estrictamente necesaria para el click,
        // pero la mantenemos por si la usas en otro lado
        router.push(`/${page}`); // Navega a la nueva página
        setSidebarOpen(false); // Cierra el sidebar en móvil al cambiar de página
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">

            {/* Overlay para móvil */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Controla su visibilidad con clases y estado) */}
            <div
                // Usamos clases de Tailwind para mostrar/ocultar y transicionar
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-gray-200 dark:border-gray-800 ${
                    sidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
                }`}
            >
                {/* Pasamos 'Link' como prop para usar Next/Link dentro del Sidebar */}
                <HospitalSidebar
                    currentPage={currentPage}
                    onPageChange={handlePageChange} // Mantenemos por si acaso, pero Link hará el trabajo
                    // Pasamos el componente Link para que HospitalSidebar lo use internamente
                    // Esto es una forma de hacerlo, otra es modificar HospitalSidebar para usar Link directamente
                    LinkComponent={Link}
                />
            </div>

            {/* Contenido Principal */}
            <main className="flex-1 overflow-y-auto flex flex-col">

                {/* Header (Pasa el estado y la función para el botón móvil) */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* El Contenido de la Página específica (dashboard, inventario, etc.) */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children} {/* <-- Aquí se renderiza cada page.tsx */}
                </div>
            </main>
        </div>
    );
}