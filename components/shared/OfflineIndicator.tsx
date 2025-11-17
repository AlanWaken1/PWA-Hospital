// components/shared/OfflineIndicator.tsx - VERSIÓN FINAL
// Solo aparece cuando: offline, sincronizando, o hay acciones pendientes
"use client";

import { useOfflineSync } from '@/hooks/useOfflineSync';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function OfflineIndicator() {
    // @ts-ignore
    const { isOnline, pendingActions, isSyncing } = useOfflineSync();
    const [isExpanded, setIsExpanded] = useState(false);

    // ✅ LÓGICA CRÍTICA: Solo mostrar cuando sea REALMENTE necesario
    // 1. Offline → Mostrar
    // 2. Sincronizando → Mostrar
    // 3. Hay acciones pendientes (incluso si está online) → Mostrar
    // 4. Online + sin acciones + no sincronizando → OCULTAR
    const shouldShow = !isOnline || isSyncing || pendingActions > 0;

    // Si no debe mostrarse, no renderizar nada
    if (!shouldShow) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
            {/* Indicador Principal - Siempre visible cuando shouldShow = true */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
          cursor-pointer transform transition-all duration-300 hover:scale-105
          rounded-full shadow-2xl px-4 py-3 flex items-center gap-3
          ${isSyncing
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white animate-pulse'
                    : !isOnline
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                }
        `}
            >
                {isSyncing ? (
                    <>
                        <RefreshCw size={20} className="animate-spin" />
                        <span className="font-medium hidden sm:inline">Sincronizando...</span>
                        <span className="font-medium sm:hidden">Sync...</span>
                    </>
                ) : !isOnline ? (
                    <>
                        <WifiOff size={20} className="animate-pulse" />
                        <span className="font-medium hidden sm:inline">Modo Offline</span>
                        <span className="font-medium sm:hidden">Offline</span>
                        {pendingActions > 0 && (
                            <span className="bg-white/30 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {pendingActions}
              </span>
                        )}
                    </>
                ) : (
                    // Online pero con acciones pendientes (raro, pero puede pasar)
                    <>
                        <RefreshCw size={20} />
                        <span className="font-medium hidden sm:inline">Pendientes</span>
                        <span className="font-medium sm:hidden">Pend</span>
                        {pendingActions > 0 && (
                            <span className="bg-white/30 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {pendingActions}
              </span>
                        )}
                    </>
                )}
            </div>

            {/* Panel Expandido - Solo se muestra al hacer click */}
            {isExpanded && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] max-w-[320px] animate-in slide-in-from-bottom-2">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {!isOnline ? (
                                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                            ) : isSyncing ? (
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                            ) : (
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                            )}
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                {!isOnline ? 'Modo Offline' : isSyncing ? 'Sincronizando' : 'En Línea'}
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-2 text-sm">
                        {!isOnline && (
                            <>
                                <div className="flex items-start gap-2 text-orange-700 dark:text-orange-400">
                                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                    <p className="text-xs">
                                        Sin conexión a internet. Puedes seguir trabajando y los cambios se sincronizarán automáticamente.
                                    </p>
                                </div>
                                {pendingActions > 0 && (
                                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 border border-orange-200 dark:border-orange-800">
                                        <p className="text-xs font-medium text-orange-900 dark:text-orange-100">
                                            {pendingActions} {pendingActions === 1 ? 'acción pendiente' : 'acciones pendientes'}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {isSyncing && (
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <RefreshCw size={14} className="animate-spin" />
                                <p className="text-xs">
                                    Sincronizando {pendingActions} {pendingActions === 1 ? 'cambio' : 'cambios'}...
                                </p>
                            </div>
                        )}

                        {isOnline && !isSyncing && pendingActions > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                                <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100">
                                    {pendingActions} {pendingActions === 1 ? 'acción' : 'acciones'} esperando sincronización
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}