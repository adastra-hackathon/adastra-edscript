import React, { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { useAuth } from '../../../core/hooks/useAuth';
import { AppText } from '../../../components/ui/AppText';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { AuthHeader } from '../../../components/auth/AuthHeader';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';
import { spacing } from '../../../core/theme';
import type { RootStackParamList } from '../../../navigation/types';
import type { LoginFormData } from '../schemas/login.schema';
import { postLoginSignal } from '../../responsible-gaming/postLoginSignal';

export const LoginScreen = memo(function LoginScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { pendingRoute, clearPendingRoute } = useAuth();
  const { submit, loading, fieldErrors, clearFieldError } = useLogin();

  const handleSubmit = useCallback(
    async (data: LoginFormData) => {
      const error = await submit(data);

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao entrar',
          text2: error.globalError ?? 'Verifique os campos preenchidos.',
          visibilityTime: 4000,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Login realizado!',
        text2: 'Redirecionando...',
        visibilityTime: 3000,
      });

      postLoginSignal.set();

      setTimeout(() => {
        if (pendingRoute) {
          clearPendingRoute();
          navigation.navigate(pendingRoute.stack, {
            screen: pendingRoute.screen,
            params: pendingRoute.params,
          } as any);
        } else {
          navigation.navigate('Public', { screen: 'Home' } as any);
        }
      }, 1000);
    },
    [submit, pendingRoute, clearPendingRoute, navigation],
  );

  const handleForgotPassword = useCallback(() => {
    navigation.navigate('Auth', { screen: 'ForgotPassword' } as any);
  }, [navigation]);

  const handleGoRegister = useCallback(() => {
    navigation.navigate('Auth', { screen: 'Register' } as any);
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.navigate('Public', { screen: 'Home' } as any);
  }, [navigation]);

  return (
    <AuthLayout>
      <AuthHeader onBack={handleBack} secondaryAction={{ label: '  Não tem uma conta?', button: 'Cadastre-se', onPress: handleGoRegister }} />

      <View style={styles.titleSection}>
        <AppText variant="h1" color={colors.textPrimary}>
          Entrar
        </AppText>
        <AppText variant="bodyMd" color={colors.textSecondary}>
          Bem-vindo de volta! Acesse sua conta.
        </AppText>
      </View>

      <LoginForm
        onSubmit={handleSubmit}
        loading={loading}
        fieldErrors={fieldErrors}
        onClearFieldError={clearFieldError}
        onForgotPassword={handleForgotPassword}
        onRegister={handleGoRegister}
      />
    </AuthLayout>
  );
});

const styles = StyleSheet.create({
  titleSection: {
    gap: spacing[1.5],
    marginBottom: spacing[6],
  },
});
