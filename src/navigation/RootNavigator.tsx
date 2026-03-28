import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { StartupScreen } from '../screens/startup/StartupScreen';
import { PublicNavigator } from './PublicNavigator';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator — orquestra os 3 stacks principais:
 *
 * Startup → boot da app (token recovery, session validation, navegação)
 * Public  → tabs acessíveis a todos (Home, Casino, Sports...)
 * Auth    → Login / Register / ForgotPassword
 * App     → rotas protegidas (Bets, Wallet, Profile...)
 */
export const RootNavigator = memo(function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Startup — primeiro a montar, navega via reset após boot */}
      <Stack.Screen name="Startup" component={StartupScreen} />

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
