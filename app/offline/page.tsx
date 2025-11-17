// app/offline/page.tsx
"use client";

import { useEffect, useRef } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import gsap from 'gsap';

export default function OfflinePage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleRetry = () => {
        if (navigator.onLine) {
            window.history.back();
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
            <div ref={containerRef} className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-center border border-gray-200 dark:border-gray-700">
                    {/* Icono */}
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-full flex items-center justify-center">
                        <WifiOff className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                    </div>

                    {/* Título */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Sin Conexión a Internet
                    </h1>

                    {/* Descripción */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        No tienes conexión a internet en este momento. Algunas funciones pueden estar limitadas.
                    </p>

                    {/* Info adicional */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-left">
                        <p className="text-sm text-blue-900 dark:text-blue-100 mb-2 font-medium">
                            💡 Modo Offline Activo
                        </p>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Puedes ver los datos cacheados</li>
                            <li>• Los cambios se guardarán localmente</li>
                            <li>• Se sincronizarán cuando vuelva la conexión</li>
                        </ul>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleRetry}
                            className="bg-gradient-to-r from-theme-primary to-theme-primary-dark text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                        >
                            <RefreshCw size={18} />
                            Intentar de Nuevo
                        </button>

                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Volver Atrás
                        </button>
                    </div>
                </div>

                {/* Estado de conexión */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Estado: <span className="font-medium text-orange-600 dark:text-orange-400">Offline</span>
                    </p>
                </div>
            </div>
        </div>
    );
}