import { useState, useEffect, useCallback } from 'react';
import { storage } from '../../../core/storage';
import { useAuthStore } from '../../../store/authStore';

const STORAGE_KEY_LAST_SHOWN = 'responsible_gaming_last_shown';
const RECURRENCE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

interface UseResponsibleGamingReturn {
  shouldShow: boolean;
  confirmRead: () => void;
  forceShow: () => void;
}

/**
 * Regras:
 * - App abre com usuário NÃO autenticado → exibe imediatamente
 * - App abre com usuário autenticado (sessão persistida) → exibe a cada 7 dias
 * - Logout → NÃO exibe
 * - Login/cadastro → sinalizado via postLoginSignal, tratado pelo Gate
 */
export function useResponsibleGaming(): UseResponsibleGamingReturn {
  const [shouldShow, setShouldShow] = useState(false);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Detecta logout (true → false) para esconder modal
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, prev) => {
      if (prev.isAuthenticated && !state.isAuthenticated) {
        setShouldShow(false);
      }
    });
    return unsubscribe;
  }, []);

  // App abre: verifica estado inicial após loading terminar
  useEffect(() => {
    if (isLoading) return;

    async function check() {
      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) {
        setShouldShow(true);
        return;
      }

      // Sessão persistida: checar intervalo de 7 dias
      const lastShownRaw = await storage.getString(STORAGE_KEY_LAST_SHOWN);
      if (!lastShownRaw) {
        setShouldShow(true);
        return;
      }
      const elapsed = Date.now() - new Date(lastShownRaw).getTime();
      if (elapsed >= RECURRENCE_INTERVAL_MS) {
        setShouldShow(true);
      }
    }

    check();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const confirmRead = useCallback(() => {
    setShouldShow(false);
    storage.set(STORAGE_KEY_LAST_SHOWN, new Date().toISOString());
  }, []);

  const forceShow = useCallback(() => {
    setShouldShow(true);
  }, []);

  return { shouldShow, confirmRead, forceShow };
}
