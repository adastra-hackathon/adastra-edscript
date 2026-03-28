import React, { memo, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { EyeIcon } from '../../../components/icons/EyeIcon';
import { EyeOffIcon } from '../../../components/icons/EyeOffIcon';
import { Divider } from '../../../components/ui/Divider';
import { spacing } from '../../../core/theme';
import { loginSchema, type LoginFormData } from '../schemas/login.schema';

interface Props {
  onSubmit: (data: LoginFormData) => void;
  loading: boolean;
  fieldErrors?: Record<string, string>;
  onClearFieldError?: (field: string) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

export const LoginForm = memo(function LoginForm({ onSubmit, loading, fieldErrors, onClearFieldError, onForgotPassword, onRegister }: Props) {
  const { colors } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      keepConnected: false,
    },
  });

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="identifier"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="E-mail ou CPF"
            placeholder="Digite seu e-mail ou CPF"
            value={value}
            onChangeText={(text) => { onChange(text); onClearFieldError?.('identifier'); }}
            onBlur={onBlur}
            error={fieldErrors?.identifier ?? errors.identifier?.message}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={value}
            onChangeText={(text) => { onChange(text); onClearFieldError?.('password'); }}
            onBlur={onBlur}
            error={fieldErrors?.password ?? errors.password?.message}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            rightIcon={
              showPassword
                ? <EyeOffIcon size={20} color={colors.textSecondary} />
                : <EyeIcon size={20} color={colors.textSecondary} />
            }
            onRightIconPress={togglePassword}
          />
        )}
      />

      <Controller
        control={control}
        name="keepConnected"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={!!value}
            onChange={onChange}
            label="Mantenha-me conectado"
          />
        )}
      />

      <Button
        label="ENTRAR"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        variant="secondary"
        size="lg"
      />

      <AppText variant="caption" color={colors.textTertiary} align="center">
        Jogo pode ser viciante. Por favor, jogue com responsabilidade.
      </AppText>

      <View>
        <AppText variant="bodyMd" color={colors.textPrimary} align="center">
          Esqueceu sua senha?
        </AppText>
        <TouchableOpacity
          onPress={onForgotPassword}
          activeOpacity={0.7}
          style={styles.forgotBtn}
        >
          <AppText variant="bodyMd" color={colors.secondary} align="center">
            Clique aqui
          </AppText>
        </TouchableOpacity>
      </View>


    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
  },
  errorBox: {
    padding: spacing[3],
    borderRadius: 8,
  },
  forgotBtn: {
    alignItems: 'center',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
