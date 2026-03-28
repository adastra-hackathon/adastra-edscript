import React, { memo, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { EyeIcon } from '../../../components/icons/EyeIcon';
import { EyeOffIcon } from '../../../components/icons/EyeOffIcon';
import { spacing, borderRadius } from '../../../core/theme';
import { registerSchema, type RegisterFormData } from '../schemas/register.schema';

interface Props {
  onSubmit: (data: RegisterFormData) => void;
  loading: boolean;
  fieldErrors?: Record<string, string>;
  onClearFieldError?: (field: string) => void;
  onLogin: () => void;
}

function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function maskCpf(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export const RegisterForm = memo(function RegisterForm({ onSubmit, loading, fieldErrors, onClearFieldError }: Props) {
  const { colors } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const cpfRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const birthDateRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      email: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false,
      acceptBonus: false,
    },
  });

  const togglePassword = useCallback(() => setShowPassword((p) => !p), []);
  const toggleConfirm = useCallback(() => setShowConfirm((p) => !p), []);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome completo"
            placeholder="Seu nome completo"
            value={value}
            onChangeText={(text) => { onChange(text); onClearFieldError?.('fullName'); }}
            onBlur={onBlur}
            error={fieldErrors?.fullName ?? errors.fullName?.message}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => cpfRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="cpf"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={cpfRef}
            label="CPF"
            placeholder="000.000.000-00"
            value={value}
            onChangeText={(text) => { onChange(maskCpf(text)); onClearFieldError?.('cpf'); }}
            onBlur={onBlur}
            error={fieldErrors?.cpf ?? errors.cpf?.message}
            keyboardType="numeric"
            maxLength={14}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={emailRef}
            label="E-Mail"
            placeholder="seu@email.com"
            value={value}
            onChangeText={(text) => { onChange(text); onClearFieldError?.('email'); }}
            onBlur={onBlur}
            error={fieldErrors?.email ?? errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => birthDateRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="birthDate"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={birthDateRef}
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            value={value}
            onChangeText={(text) => onChange(maskDate(text))}
            onBlur={onBlur}
            error={errors.birthDate?.message}
            keyboardType="numeric"
            returnKeyType="next"
            maxLength={10}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={passwordRef}
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry={!showPassword}
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
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
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={confirmRef}
            label="Confirmar senha"
            placeholder="Repita sua senha"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
            secureTextEntry={!showConfirm}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            rightIcon={
              showConfirm
                ? <EyeOffIcon size={20} color={colors.textSecondary} />
                : <EyeIcon size={20} color={colors.textSecondary} />
            }
            onRightIconPress={toggleConfirm}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <AppText variant="labelMd" color={colors.textSecondary} style={styles.phoneLabel}>
              Celular
            </AppText>
            <View style={[
              styles.phoneRow,
              {
                borderColor: (fieldErrors?.phone ?? errors.phone) ? colors.error : colors.inputBorder,
                backgroundColor: colors.inputBackground,
              },
            ]}>
              <View style={[styles.phonePrefixBox, { borderRightColor: colors.border }]}>
                <AppText variant="bodySm" color={colors.textPrimary}>🇧🇷 +55</AppText>
              </View>
              <TextInput
                ref={phoneRef}
                style={[styles.phoneInput, { color: colors.inputText }]}
                placeholder="(00) 00000-0000"
                placeholderTextColor={colors.inputPlaceholder}
                value={value}
                onChangeText={(text) => { onChange(maskPhone(text)); onClearFieldError?.('phone'); }}
                onBlur={onBlur}
                keyboardType="phone-pad"
                maxLength={15}
                returnKeyType="done"
              />
            </View>
            {(fieldErrors?.phone ?? errors.phone?.message) && (
              <AppText variant="caption" color={colors.error} style={styles.phoneError}>
                {fieldErrors?.phone ?? errors.phone?.message}
              </AppText>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="acceptTerms"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={!!value}
            onChange={onChange}
            error={errors.acceptTerms?.message}
            label={
              <AppText variant="bodySm" color={colors.textSecondary}>
                Aceito os{' '}
                <AppText variant="bodySm" color={colors.secondary}>
                  Termos e Condições
                </AppText>
                {' '}e a{' '}
                <AppText variant="bodySm" color={colors.secondary}>
                  Política de Privacidade
                </AppText>
              </AppText>
            }
          />
        )}
      />

      <Controller
        control={control}
        name="acceptBonus"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={!!value}
            onChange={onChange}
            label="Quero receber ofertas e promoções exclusivas"
          />
        )}
      />

      <Button
        label="CADASTRAR"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        variant="secondary"
        size="lg"
      />

      <AppText variant="caption" color={colors.textTertiary} align="center">
        Jogo pode ser viciante. Por favor, jogue com responsabilidade.
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
  },
  phoneLabel: {
    marginBottom: spacing[1.5],
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    height: 52,
    overflow: 'hidden',
  },
  phonePrefixBox: {
    paddingHorizontal: spacing[3],
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing[3],
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    includeFontPadding: false,
  },
  phoneError: {
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
  errorBox: {
    padding: spacing[3],
    borderRadius: 8,
  },
});
