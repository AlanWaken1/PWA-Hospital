// app/auth/login/page.tsx
"use client"; // Lo hacemos cliente para las animaciones

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Activity } from 'lucide-react';
import LoginForm from '@/components/auth/login-form'; // Este es el que vamos a modificar
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    // Leemos el mensaje de error de la URL (si Supabase redirige con error)
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

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
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 flex items-center justify-center p-4 transition-colors"
        >
            <div className="w-full max-w-md">
                {/* Logo (de tu diseño Login.tsx) */}
                <div ref={logoRef} className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg shadow-emerald-500/30 mb-4">
                        <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Bienvenido a MediStock</h1>
                    <p className="text-gray-600 dark:text-gray-400">Sistema de control de inventario hospitalario</p>
                </div>

                {/* Aquí va el formulario */}
                <LoginForm message={message} />

                {/* Footer (de tu diseño Login.tsx) */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
                    © {new Date().getFullYear()} MediStock. Sistema seguro y confiable para hospitales.
                </p>
            </div>
        </div>
    );
}