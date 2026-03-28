import React, { memo, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { useMyProfile } from '../hooks/useMyProfile';
import { useNotificationPrefs } from '../hooks/useMyProfile';
import { profileMapper } from '../mappers/profileMapper';
import { profileApi } from '../api/profileApi';
import { useResponsibleGamingLimitsQuery } from '../../responsible-gaming/hooks/useResponsibleGamingLimitsQuery';
import { ResponsibleGamingLimitsSection } from '../../responsible-gaming/components/ResponsibleGamingLimitsSection';
import { ChevronLeftIcon, EyeIcon, EyeOffIcon, WalletIcon } from '../../../components/icons';
import { borderRadius, spacing } from '../../../core/theme';
import type { RootStackParamList } from '../../../navigation/types';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const editProfileSchema = z.object({
  email: z.string().email('E-mail inválido').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual.'),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  });

type EditProfileValues = z.infer<typeof editProfileSchema>;
type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = memo(function SectionTitle({ label }: { label: string }) {
  const { colors } = useAppTheme();
  return (
    <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>
      {label}
    </AppText>
  );
});

const Divider = memo(function Divider() {
  const { colors } = useAppTheme();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const AccountScreen = memo(function AccountScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isAuthenticated } = useProtectedRoute({ pendingRoute: { stack: 'App', screen: 'Account' } });

  const { query: profileQuery, updateProfile, changePassword } = useMyProfile();
  const { query: notifQuery, update: updateNotif } = useNotificationPrefs();
  const rgQuery = useResponsibleGamingLimitsQuery();

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  const profile = profileQuery.data;
  const notifs = notifQuery.data;

  // Edit profile form
  const { control: profileControl, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } =
    useForm<EditProfileValues>({
      resolver: zodResolver(editProfileSchema),
      values: profile ? profileMapper.toEditFormValues(profile) : undefined,
    });

  // Change password form
  const { control: pwControl, handleSubmit: handlePwSubmit, reset: resetPw, formState: { errors: pwErrors } } =
    useForm<ChangePasswordValues>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });

  const onSaveProfile = handleProfileSubmit(async (values) => {
    await updateProfile.mutateAsync(values);
  });

  const onChangePassword = handlePwSubmit(async (values) => {
    await changePassword.mutateAsync(values);
    resetPw();
  });

  const GENDER_OPTIONS = ['Masculino', 'Feminino', 'Outro', 'Prefiro não informar'];

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Voltar">
          <ChevronLeftIcon size={20} color={colors.textPrimary} />
          <AppText variant="labelMd" color={colors.textPrimary}>Voltar</AppText>
        </TouchableOpacity>
        <AppText variant="h3" color={colors.textPrimary}>Minha Conta</AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {profileQuery.isPending ? (
          <ActivityIndicator color={colors.secondary} style={styles.loader} />
        ) : profile ? (
          <>
            {/* ── Avatar + info ─────────────────────────────────── */}
            <View style={[styles.hero, { backgroundColor: colors.backgroundSecondary }]}>
              {profile.avatarUrl ? (
                <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarFallback, { borderColor: colors.secondary }]}>
                  <AppText variant="h2" color={colors.secondary}>
                    {profileMapper.toMenuViewModel(profile, []).initials}
                  </AppText>
                </View>
              )}
              <AppText variant="h3" color={colors.textPrimary} style={styles.heroName}>
                {profile.fullName}
              </AppText>
              <AppText variant="bodyMd" color={colors.textSecondary}>
                {profile.email}
              </AppText>
              <View style={[styles.levelBadge, { borderColor: colors.warning }]}>
                <AppText variant="caption" color={colors.warning}>
                  🔗 {profileMapper.toMenuViewModel(profile, []).levelLabel}
                </AppText>
              </View>
              <AppText variant="h3" color={colors.secondary} style={styles.heroBalance}>
                💰 {profileMapper.toMenuViewModel(profile, []).balanceFormatted}
              </AppText>

              {/* Quick actions */}
              <View style={styles.heroActions}>
                <Button
                  label="↑ Saque"
                  onPress={() => navigation.navigate('App', { screen: 'Withdraw' })}
                  variant="outline"
                  size="md"
                  fullWidth={false}
                  style={styles.heroBtn}
                />
                <Button
                  label="↓ Depósito"
                  onPress={() => navigation.navigate('App', { screen: 'Deposit' })}
                  variant="secondary"
                  size="md"
                  fullWidth={false}
                  style={styles.heroBtn}
                />
              </View>
            </View>

            {/* ── Editar dados ──────────────────────────────────── */}
            <View style={styles.section}>
              <SectionTitle label="Editar dados" />

              {/* Locked: CPF */}
              <View>
                <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>
                  CPF 🔒
                </AppText>
                <Input
                  value={profile.cpf}
                  editable={false}
                  rightIcon={<AppText variant="caption">🔒</AppText>}
                  style={{ color: colors.textTertiary }}
                />
              </View>

              {/* Locked: Display name */}
              {profile.displayName !== undefined && (
                <View>
                  <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>
                    Nome de usuário 🔒
                  </AppText>
                  <Input
                    value={profile.displayName ?? ''}
                    editable={false}
                    rightIcon={<AppText variant="caption">🔒</AppText>}
                    style={{ color: colors.textTertiary }}
                  />
                </View>
              )}

              {/* Editable: Email */}
              <View>
                <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>E-mail</AppText>
                <Controller control={profileControl} name="email" render={({ field }) => (
                  <Input
                    placeholder="E-mail"
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={profileErrors.email?.message}
                  />
                )} />
              </View>

              {/* Editable: Phone */}
              <View>
                <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>Telefone</AppText>
                <Controller control={profileControl} name="phone" render={({ field }) => (
                  <Input
                    placeholder="+55 (11) 99999-9999"
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    keyboardType="phone-pad"
                    error={profileErrors.phone?.message}
                  />
                )} />
              </View>

              {/* Editable: Address */}
              <View>
                <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>Endereço</AppText>
                <Controller control={profileControl} name="address" render={({ field }) => (
                  <Input
                    placeholder="Rua Exemplo, 123 – São Paulo, SP"
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    error={profileErrors.address?.message}
                  />
                )} />
              </View>

              {/* Editable: Gender (dropdown) */}
              <View>
                <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>Gênero</AppText>
                <Controller control={profileControl} name="gender" render={({ field }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => setGenderOpen(!genderOpen)}
                      style={[styles.picker, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
                      activeOpacity={0.8}
                    >
                      <AppText variant="bodyMd" color={field.value ? colors.textPrimary : colors.inputPlaceholder} style={{ flex: 1 }}>
                        {field.value || 'Selecione'}
                      </AppText>
                      <AppText variant="bodyMd" color={colors.textSecondary}>▾</AppText>
                    </TouchableOpacity>
                    {genderOpen && (
                      <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {GENDER_OPTIONS.map((opt) => (
                          <TouchableOpacity
                            key={opt}
                            onPress={() => { field.onChange(opt); setGenderOpen(false); }}
                            style={[styles.dropdownItem, { borderBottomColor: colors.divider }]}
                            activeOpacity={0.7}
                          >
                            <AppText variant="bodyMd" color={opt === field.value ? colors.secondary : colors.textPrimary}>
                              {opt}
                            </AppText>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </>
                )} />
              </View>

              <Button
                label="Salvar dados"
                onPress={onSaveProfile}
                variant="secondary"
                loading={updateProfile.isPending}
              />
            </View>

            <Divider />

            {/* ── Mudar senha ───────────────────────────────────── */}
            <View style={styles.section}>
              <SectionTitle label="Mudar senha" />

              <View>
                <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>Senha atual</AppText>
                <Controller control={pwControl} name="currentPassword" render={({ field }) => (
                  <Input
                    placeholder="••••••••"
                    secureTextEntry={!showCurrentPw}
                    value={field.value}
                    onChangeText={field.onChange}
                    rightIcon={showCurrentPw ? <EyeOffIcon size={18} color={colors.textSecondary} /> : <EyeIcon size={18} color={colors.textSecondary} />}
                    onRightIconPress={() => setShowCurrentPw((v) => !v)}
                    error={pwErrors.currentPassword?.message}
                  />
                )} />
              </View>

              <View>
                <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>Nova senha</AppText>
                <Controller control={pwControl} name="newPassword" render={({ field }) => (
                  <Input
                    placeholder="••••••••"
                    secureTextEntry={!showNewPw}
                    value={field.value}
                    onChangeText={field.onChange}
                    rightIcon={showNewPw ? <EyeOffIcon size={18} color={colors.textSecondary} /> : <EyeIcon size={18} color={colors.textSecondary} />}
                    onRightIconPress={() => setShowNewPw((v) => !v)}
                    error={pwErrors.newPassword?.message}
                  />
                )} />
              </View>

              <View>
                <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>Confirmar nova senha</AppText>
                <Controller control={pwControl} name="confirmPassword" render={({ field }) => (
                  <Input
                    placeholder="••••••••"
                    secureTextEntry={!showConfirmPw}
                    value={field.value}
                    onChangeText={field.onChange}
                    rightIcon={showConfirmPw ? <EyeOffIcon size={18} color={colors.textSecondary} /> : <EyeIcon size={18} color={colors.textSecondary} />}
                    onRightIconPress={() => setShowConfirmPw((v) => !v)}
                    error={pwErrors.confirmPassword?.message}
                  />
                )} />
              </View>

              <Button
                label="Alterar senha"
                onPress={onChangePassword}
                variant="outline"
                loading={changePassword.isPending}
              />
            </View>

            <Divider />

            {/* ── Limites + Exclusão ────────────────────────────── */}
            {rgQuery.data ? (
              <View style={styles.section}>
                <ResponsibleGamingLimitsSection
                  state={rgQuery.data}
                  onWithdrawPress={() => navigation.navigate('App', { screen: 'Withdraw' })}
                />
              </View>
            ) : rgQuery.isPending ? (
              <ActivityIndicator color={colors.secondary} style={styles.loader} />
            ) : null}

            <Divider />

            {/* ── Notificações e Definições ─────────────────────── */}
            <View style={styles.section}>
              <SectionTitle label="Notificações e Definições" />

              <View style={[styles.notifRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <AppText variant="bodyMd" color={colors.textPrimary} style={styles.notifLabel}>
                  Eu gostaria de receber notificações por e-mail relacionadas às minhas solicitações de depósito / retirada
                </AppText>
                <Switch
                  value={notifs?.emailOnDeposit ?? false}
                  onValueChange={(v) => updateNotif.mutate({ emailOnDeposit: v })}
                  trackColor={{ true: colors.secondary, false: colors.border }}
                  thumbColor={colors.textInverse}
                />
              </View>

              <View>
                <AppText variant="labelMd" color={colors.textSecondary} style={styles.fieldLabel}>
                  Intervalo de verificação em minutos
                </AppText>
                <TouchableOpacity
                  style={[styles.picker, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
                  activeOpacity={0.8}
                >
                  <AppText variant="bodyMd" color={notifs?.checkIntervalMinutes ? colors.textPrimary : colors.inputPlaceholder} style={{ flex: 1 }}>
                    {notifs?.checkIntervalMinutes ? `${notifs.checkIntervalMinutes} min` : 'Selecione um intervalo'}
                  </AppText>
                  <AppText variant="bodyMd" color={colors.textSecondary}>▾</AppText>
                </TouchableOpacity>
              </View>

              <Button
                label="Guardar"
                onPress={() => updateNotif.mutate({ checkIntervalMinutes: notifs?.checkIntervalMinutes ?? null })}
                variant="primary"
                loading={updateNotif.isPending}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    minWidth: 60,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing[12] },
  loader: { marginTop: spacing[10] },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },
  avatar: { width: 80, height: 80, borderRadius: borderRadius.full },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: { marginTop: spacing[1] },
  levelBadge: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[0.5],
  },
  heroBalance: { marginTop: spacing[1] },
  heroActions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[2],
    width: '100%',
  },
  heroBtn: { flex: 1 },
  section: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
    gap: spacing[4],
  },
  sectionTitle: { marginBottom: spacing[2] },
  divider: { height: 8 },
  fieldLabel: { marginBottom: spacing[1.5] },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    height: 52,
    paddingHorizontal: spacing[4],
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginTop: spacing[1],
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[3],
  },
  notifLabel: { flex: 1, lineHeight: 20 },
});
