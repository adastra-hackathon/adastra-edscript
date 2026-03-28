import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../services/getMe';
import { useAuthStore } from '../../../store/authStore';

/**
 * Hook para buscar e sincronizar dados completos do usuário autenticado.
 * Usa React Query para cache e refetch automático.
 * Sincroniza com o Zustand store ao receber dados frescos.
 */
export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ['user', 'me'],
    queryFn: getMe,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 1,
  });

  useEffect(() => {
    if (query.data) {
      setUser({
        id: query.data.id,
        name: query.data.fullName,
        fullName: query.data.fullName,
        displayName: query.data.displayName,
        email: query.data.email,
        role: query.data.role,
        status: query.data.status,
        isEmailVerified: query.data.isEmailVerified,
        isPhoneVerified: query.data.isPhoneVerified,
        level: query.data.level,
        avatarUrl: query.data.avatarUrl,
        balance: 0, // virá do módulo de carteira
      });
    }
  }, [query.data, setUser]);

  return query;
}
