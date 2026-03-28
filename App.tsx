import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import { queryClient } from './src/core/api';
import { RootNavigator } from './src/navigation';
import { useAppFonts } from './src/core/hooks/useAppFonts';
import { useAppTheme } from './src/core/hooks/useAppTheme';

function AppContent() {
  const { colors, isDark } = useAppTheme();

  // React Navigation exige um shape específico com fonts + colors mapeados
  const navTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.error,
    },
    fonts: {
      regular: { fontFamily: 'Inter-Regular', fontWeight: '400' as const },
      medium:  { fontFamily: 'Inter-Medium',  fontWeight: '500' as const },
      bold:    { fontFamily: 'Inter-Bold',    fontWeight: '700' as const },
      heavy:   { fontFamily: 'Inter-Bold',    fontWeight: '700' as const },
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
      <Toast />
    </NavigationContainer>
  );
}

export default function App() {
  const { fontsLoaded, error } = useAppFonts();

  useEffect(() => {
    // Se fontes falharem, garante que o splash nativo seja escondido
    // mesmo sem a StartupScreen montar (edge case)
    if (error) {
      SplashScreen.hideAsync();
    }
  }, [error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
