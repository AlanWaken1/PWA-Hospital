// app/offline/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        setIsOnline(navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleRetry = () => {
        if (navigator.onLine) {
            window.location.href = '/';
        } else {
            alert('Aún sin conexión. Inténtalo más tarde.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">

                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <WifiOff className="w-12 h-12 text-gray-400" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Sin Conexión
                </h1>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    No hay conexión a internet. Algunas funciones pueden estar limitadas en modo offline.
                </p>

                {/* Status */}
                {isOnline && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                        <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                            ✓ Conexión restaurada
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleRetry}
                        className="w-full bg-theme-primary hover:bg-theme-primary-dark text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Reintentar
                    </button>

                    <Link
                        href="/"
                        className="w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Ir al Inicio
                    </Link>
                </div>

                {/* Info */}
                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    <p>Mientras estés offline, puedes:</p>
                    <ul className="mt-2 space-y-1">
                        <li>• Ver el inventario cacheado</li>
                        <li>• Revisar reportes guardados</li>
                        <li>• Consultar datos previos</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}