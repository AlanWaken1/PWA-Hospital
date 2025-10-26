// components/PWAMetaTags.tsx
"use client";

import { useEffect } from 'react';

export function PWAMetaTags() {
    useEffect(() => {
        const ensureMetaTag = (
            selector: string,
            createElement: () => HTMLElement
        ) => {
            if (!document.querySelector(selector)) {
                const element = createElement();
                document.head.appendChild(element);
                return true;
            }
            return false;
        };

        // ✅ CAMBIAR AQUÍ: usar /api/manifest
        const manifestAdded = ensureMetaTag('link[rel="manifest"]', () => {
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = '/api/manifest';  // ← CAMBIO CLAVE
            return link;
        });

        ensureMetaTag('meta[name="theme-color"]', () => {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = '#059669';
            return meta;
        });

        ensureMetaTag('meta[name="apple-mobile-web-app-capable"]', () => {
            const meta = document.createElement('meta');
            meta.name = 'apple-mobile-web-app-capable';
            meta.content = 'yes';
            return meta;
        });

        ensureMetaTag('meta[name="apple-mobile-web-app-status-bar-style"]', () => {
            const meta = document.createElement('meta');
            meta.name = 'apple-mobile-web-app-status-bar-style';
            meta.content = 'default';
            return meta;
        });

        ensureMetaTag('meta[name="apple-mobile-web-app-title"]', () => {
            const meta = document.createElement('meta');
            meta.name = 'apple-mobile-web-app-title';
            meta.content = 'MediStock';
            return meta;
        });

        ensureMetaTag('link[rel="apple-touch-icon"]', () => {
            const link = document.createElement('link');
            link.rel = 'apple-touch-icon';
            link.href = '/icons/icon-192x192.png';
            return link;
        });

        if (manifestAdded) {
            console.log('✅ PWA: Manifest via API route');
        }
    }, []);

    return null;
}