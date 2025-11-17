// hooks/useOfflineSync.ts
"use client";

import { useState, useEffect } from 'react';
import { setupOfflineListeners, cacheAllData, syncPendingActions, isOnline } from '@/lib/offline/sync';

export function useOfflineSync() {
    const [online, setOnline] = useState(true);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        // Estado inicial
        setOnline(navigator.onLine);

        // Configurar listeners
        setupOfflineListeners();

        // Handlers para actualizar estado
        const handleOnline = async () => {
            setOnline(true);
            setSyncing(true);
            try {
                await syncPendingActions();
                await cacheAllData();
            } catch (error) {
                console.error('Error sincronizando:', error);
            } finally {
                setSyncing(false);
            }
        };

        const handleOffline = () => {
            setOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cachear datos iniciales si hay conexión
        if (navigator.onLine) {
            cacheAllData();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return {
        isOnline: online,
        isSyncing: syncing,
    };
}