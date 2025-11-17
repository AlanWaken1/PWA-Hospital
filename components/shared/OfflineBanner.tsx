// components/shared/OfflineBanner.tsx
"use client";

import { WifiOff } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

interface OfflineBannerProps {
    /** Funciones que sí funcionan offline */
    availableFeatures?: string[];
    /** Funciones que requieren internet */
    unavailableFeatures?: string[];
    /** Mostrar solo si está offline */
    showOnlyOffline?: boolean;
    /** Clase CSS adicional */
    className?: string;
}

export function OfflineBanner({
                                  availableFeatures = [],
                                  unavailableFeatures = [],
                                  showOnlyOffline = true,
                                  className = ''
                              }: OfflineBannerProps) {
    const { isOnline } = useOfflineSync();

    // No mostrar nada si está online y showOnlyOffline es true
    if (isOnline && showOnlyOffline) return null;

    return (
        <div className={`
      bg-orange-50 dark:bg-orange-900/20 
      border-l-4 border-orange-500 
      p-4 rounded-lg 
      ${className}
    `}>
            <div className="flex items-start gap-3">
                <WifiOff
                    className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                    size={20}
                />
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1">
                        Modo Offline Activo
                    </h3>

                    {(availableFeatures.length > 0 || unavailableFeatures.length > 0) && (
                        <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                            {availableFeatures.map((feature, idx) => (
                                <li key={`available-${idx}`}>✅ {feature}</li>
                            ))}
                            {unavailableFeatures.map((feature, idx) => (
                                <li key={`unavailable-${idx}`}>⚠️ {feature}</li>
                            ))}
                        </ul>
                    )}

                    {availableFeatures.length === 0 && unavailableFeatures.length === 0 && (
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                            Algunas funciones están limitadas sin conexión a internet
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}