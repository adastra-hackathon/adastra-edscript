import { useEffect, useRef } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { tokenStorage } from '../core/storage';
import { authService } from '../features/auth/services/authService';
import { useAuthStore } from '../store/authStore';

/**
 * Orquestra o boot da aplicação:
 * 1. Recupera tokens persistidos
 * 2. Valida sessão via /auth/me (se token existir)
 * 3. Atualiza authStore
 * 4. Navega (reset) para Public ou App — sem voltar à StartupScreen
 */
export function useStartup() {
  const navigation = useNavigation();
  const login = useAuthStore((s) => s.login);
  const setLoading = useAuthStore((s) => s.setLoading);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function boot() {
      try {
        const [token, refresh] = await Promise.all([
          tokenStorage.getAccessToken(),
          tokenStorage.getRefreshToken(),
        ]);

        if (token) {
          try {
            const user = await authService.me();
            await login(user, token, refresh ?? '');
          } catch {
            await tokenStorage.clearTokens();
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      } finally {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Public' }] }),
        );
      }
    }

    boot();
  }, [login, setLoading, navigation]);
}
