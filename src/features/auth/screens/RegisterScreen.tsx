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
import { RegisterForm } from '../components/RegisterForm';
import { useRegister } from '../hooks/useRegister';
import { spacing } from '../../../core/theme';
import type { RootStackParamList } from '../../../navigation/types';
import type { RegisterFormData } from '../schemas/register.schema';
import { postLoginSignal } from '../../responsible-gaming/postLoginSignal';

export const RegisterScreen = memo(function RegisterScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { pendingRoute, clearPendingRoute } = useAuth();
  const { submit, loading, fieldErrors, clearFieldError } = useRegister();

  const handleSubmit = useCallback(
    async (data: RegisterFormData) => {
      const error = await submit(data);

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao criar conta',
          text2: error.globalError ?? 'Verifique os campos preenchidos.',
          visibilityTime: 4000,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Conta criada com sucesso!',
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

  const handleGoLogin = useCallback(() => {
    navigation.navigate('Auth', { screen: 'Login' } as any);
  }, [navigation]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Auth', { screen: 'Login' } as any);
    }
  }, [navigation]);

  return (
    <AuthLayout>
      <AuthHeader onBack={handleBack} secondaryAction={{ label: 'Já tem uma conta?', button: 'Entrar', onPress: handleGoLogin }} />

      <View style={styles.titleSection}>
        <AppText variant="h1" color={colors.textPrimary}>
          Criar conta
        </AppText>
        <AppText variant="bodyMd" color={colors.textSecondary}>
          Preencha seus dados para se cadastrar.
        </AppText>
      </View>

      <RegisterForm
        onSubmit={handleSubmit}
        loading={loading}
        fieldErrors={fieldErrors}
        onClearFieldError={clearFieldError}
        onLogin={handleGoLogin}
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
