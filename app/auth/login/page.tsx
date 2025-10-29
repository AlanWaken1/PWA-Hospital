// app/auth/login/page.tsx
"use client"; // Client Component para animaciones y navegación

import { useRef, useEffect, Suspense } from "react";
import gsap from "gsap";
import { Activity } from "lucide-react";
import LoginForm from "@/components/auth/login-form";
import { useSearchParams } from "next/navigation";

// ---- Subcomponente con Suspense ----
function LoginContent() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message");
    return <LoginForm message={message} />;
}

// ---- Página principal ----
export default function Page() {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animación del logo
            gsap.fromTo(
                logoRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
            );
            // Animación del contenedor
            gsap.fromTo(
                containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5 }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-br from-theme-primary/10 via-white to-theme-primary/10
                 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20
                 flex items-center justify-center p-4 transition-colors"
        >
            <div className="w-full max-w-md">
                {/* Logo */}
                <div ref={logoRef} className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br
                          from-theme-primary to-theme-primary-dark rounded-2xl shadow-lg
                          shadow-theme-primary/30 mb-4">
                        <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Bienvenido a MediStock
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Sistema de control de inventario hospitalario
                    </p>
                </div>

                {/* Aquí va el formulario dentro de Suspense */}
                <Suspense fallback={<div className="text-center text-gray-500">Cargando...</div>}>
                    <LoginContent />
                </Suspense>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
                    © {new Date().getFullYear()} MediStock. Sistema seguro y confiable para hospitales.
                </p>
            </div>
        </div>
    );
}
