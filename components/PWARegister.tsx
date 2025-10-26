// components/PWARegister.tsx
"use client";

import { useEffect } from 'react';

export function PWARegister() {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            // Registrar después de que cargue la página
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('✅ Service Worker registrado:', registration.scope);

                        // Verificar actualizaciones cada hora
                        setInterval(() => {
                            registration.update();
                        }, 60 * 60 * 1000);
                    })
                    .catch((error) => {
                        console.error('❌ Error registrando Service Worker:', error);
                    });
            });

            // Escuchar cuando haya nueva versión
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🔄 Nueva versión del SW disponible');
                // Opcional: mostrar toast de "Nueva versión disponible"
            });
        }
    }, []);

    return null; // Este componente no renderiza nada
}