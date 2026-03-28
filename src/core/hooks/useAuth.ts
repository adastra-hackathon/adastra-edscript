import { useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigationStore } from '../../store/navigationStore';

/**
 * Hook central de autenticação.
 * Expõe estado do usuário e ações de auth sem acoplamento direto ao store.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const setLoading = useAuthStore((s) => s.setLoading);

  const pendingRoute = useNavigationStore((s) => s.pendingRoute);
  const clearPendingRoute = useNavigationStore((s) => s.clearPendingRoute);

  const handleLogout = useCallback(() => {
    clearPendingRoute();
    logout();
  }, [logout, clearPendingRoute]);

  return {
    user,
    isAuthenticated,
    isLoading,
    pendingRoute,
    login,
    logout: handleLogout,
    setLoading,
    clearPendingRoute,
  };
}
