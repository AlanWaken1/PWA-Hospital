// components/shared/PWASetup.tsx
"use client"; // Necesario para useEffect y navigator

import { useEffect } from 'react';

export default function PWASetup() {
    useEffect(() => {
        // Registra el Service Worker solo en producción y si el navegador lo soporta
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            window.addEventListener('load', () => { // Espera a que la página cargue
                navigator.serviceWorker
                    .register('/service-worker.js') // Busca el archivo en /public
                    .then((registration) => {
                        console.log('Service Worker registrado con scope:', registration.scope);
                    })
                    .catch((error) => {
                        console.error('Error registrando Service Worker:', error);
                    });
            });
        }
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    return null; // Este componente no renderiza nada visible
}