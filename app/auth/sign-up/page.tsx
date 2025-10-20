// app/auth/sign-up/page.tsx
"use client"; // Necesario para animaciones

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Activity } from 'lucide-react';
import { SignUpForm } from '@/components/auth/sign-up-form'; // Importa el form que modificaremos

export default function Page() {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animación del logo
            gsap.fromTo(
                logoRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
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
        // Contenedor principal con tu estilo de fondo
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 flex items-center justify-center p-4 transition-colors"
        >
            {/* Ajusta max-w según tu diseño (era max-w-2xl en tu original) */}
            <div className="w-full max-w-lg"> {/* Cambiado a lg para más espacio */}

                {/* Logo y Título (de tu diseño Register.tsx) */}
                <div ref={logoRef} className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg shadow-emerald-500/30 mb-4">
                        <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Únete a MediStock
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Crea tu cuenta para acceder al sistema
                    </p>
                </div>

                {/* Renderiza TU SignUpForm adaptado */}
                <SignUpForm />

                {/* Footer (de tu diseño Register.tsx) */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
                    © {new Date().getFullYear()} MediStock. Sistema seguro y confiable para hospitales.
                </p>
            </div>
        </div>
    );
}