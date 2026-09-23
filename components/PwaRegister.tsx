'use client';

import { useEffect } from 'react';

/**
 * Componente de limpeza para desativar qualquer resquício de PWA / Service Worker antigo.
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log('ServiceWorker PWA desregistrado com sucesso');
            }
          });
        }
      }).catch(() => {
        // Ignore
      });

      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        }).catch(() => {
          // Ignore
        });
      }
    }
  }, []);

  return null;
}
