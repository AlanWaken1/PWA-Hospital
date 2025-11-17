// components/shared/PWASetup.tsx
"use client";

import { useEffect } from 'react';

export default function PWASetup() {
    useEffect(() => {
        // Verificar soporte
        if (!('serviceWorker' in navigator)) {
            console.warn('⚠️ Service Workers no soportados en este navegador');
            return;
        }

        // Función para registrar SW
        const registerSW = async () => {
            try {
                console.log('🔄 Iniciando registro de Service Worker...');

                // Desregistrar cualquier SW viejo primero
                const registrations = await navigator.serviceWorker.getRegistrations();
                if (registrations.length > 0) {
                    console.log('🧹 Limpiando Service Workers antiguos...');
                    await Promise.all(registrations.map(reg => reg.unregister()));
                }

                // Registrar el nuevo SW
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none' // No cachear el archivo sw.js
                });

                console.log('✅ Service Worker registrado exitosamente');
                console.log('   Scope:', registration.scope);

                // Verificar actualizaciones
                registration.addEventListener('updatefound', () => {
                    console.log('🔄 Actualización de Service Worker encontrada');
                    const newWorker = registration.installing;

                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            console.log('   Estado del SW:', newWorker.state);

                            if (newWorker.state === 'activated') {
                                console.log('✅ Service Worker activado');
                                // Recargar si hay un SW viejo
                                if (navigator.serviceWorker.controller) {
                                    console.log('🔄 Recargando para aplicar cambios...');
                                    window.location.reload();
                                }
                            }
                        });
                    }
                });

                // Verificar si ya está activo
                if (registration.active) {
                    console.log('✅ Service Worker ya está activo');
                }

            } catch (error) {
                console.error('❌ Error registrando Service Worker:', error);

                // Mostrar detalles del error
                if (error instanceof Error) {
                    console.error('   Mensaje:', error.message);
                    console.error('   Stack:', error.stack);
                }
            }
        };

        // Esperar a que la ventana cargue completamente
        if (document.readyState === 'complete') {
            registerSW();
        } else {
            window.addEventListener('load', registerSW);
            return () => window.removeEventListener('load', registerSW);
        }
    }, []);

    return null;
}