import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useNavigationStore } from '../../store/navigationStore';
import type { PendingRoute, RootStackParamList } from '../../navigation/types';

interface UseProtectedRouteOptions {
  /** Rota para salvar como pendente ao redirecionar para Login */
  pendingRoute?: PendingRoute;
}

/**
 * Hook de proteção de rota.
 *
 * Quando o usuário não está autenticado e a tela entra em foco:
 * 1. Salva a rota atual como pendente (para redirect pós-login)
 * 2. Navega para a tela de Login
 *
 * Não causa re-renderizações extras — usa seletores atômicos do Zustand.
 */
export function useProtectedRoute(options?: UseProtectedRouteOptions) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setPendingRoute = useNavigationStore((s) => s.setPendingRoute);

  useFocusEffect(
    useCallback(() => {
      if (isLoading) return;

      if (!isAuthenticated) {
        if (options?.pendingRoute) {
          setPendingRoute(options.pendingRoute);
        }
        navigation.navigate('Auth', { screen: 'Login' } as any);
      }
    }, [isAuthenticated, isLoading, navigation, options?.pendingRoute, setPendingRoute]),
  );

  return { isAuthenticated, isLoading };
}
