import React, { memo, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { tokenStorage } from '../core/storage';
import { authService } from '../features/auth/services/authService';
import { PublicNavigator } from './PublicNavigator';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator — orquestra os 3 stacks principais:
 *
 * Public  → tabs acessíveis a todos (Home, Casino, Sports...)
 * Auth    → Login / Register / ForgotPassword
 * App     → rotas protegidas (Bets, Wallet, Profile...)
 *
 * O stack "App" só é acessível após autenticação.
 * O guard real é feito em useProtectedRoute (cada tela protegida)
 * + aqui no RootNavigator para segurança de camada dupla.
 */
export const RootNavigator = memo(function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setLoading = useAuthStore((s) => s.setLoading);
  const login = useAuthStore((s) => s.login);

  // Verifica token persistido no boot da app
  useEffect(() => {
    async function checkToken() {
      const token = await tokenStorage.getAccessToken();
      const refresh = await tokenStorage.getRefreshToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const user = await authService.me();
        await login(user, token, refresh ?? '');
      } catch (e) {
        console.log('me() falhou, limpando tokens. Erro:', e);
        await tokenStorage.clearTokens();
        setLoading(false);
      }
    }
    checkToken();
  }, [setLoading, login]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Public sempre presente — base da navegação */}
      <Stack.Screen name="Public" component={PublicNavigator} />

      {/* Auth — só presente quando não autenticado */}
      {!isAuthenticated && (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ presentation: 'fullScreenModal' }}
        />
      )}

      {/* App — rotas protegidas, só acessíveis se autenticado */}
      {isAuthenticated && (
        <Stack.Screen name="App" component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
});
