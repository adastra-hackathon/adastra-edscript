import React, { memo, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { spacing } from '../../../core/theme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { useAuthStore } from '../../../store/authStore';
import { useWithdraw } from '../hooks/useWithdraw';
import { BalanceHeader } from '../components/BalanceHeader';
import { AmountInput } from '../components/AmountInput';
import { QuickAmountChips } from '../components/QuickAmountChips';
import { PixWithdrawForm } from '../components/PixWithdrawForm';
import { WITHDRAW_MIN, WITHDRAW_MAX } from '../types/wallet.types';

export const WithdrawScreen = memo(function WithdrawScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const { isAuthenticated } = useProtectedRoute({
    pendingRoute: { stack: 'App', screen: 'Withdraw' },
  });

  const balance = useAuthStore((s) => s.user?.balance ?? 0);

  const {
    pixKeyType,
    setPixKeyType,
    pixKey,
    setPixKey,
    amountText,
    setAmountText,
    selectedQuickAmount,
    selectQuickAmount,
    pixKeyError,
    amountError,
    status,
    submit,
    reset,
  } = useWithdraw();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleSuccess = useCallback(() => {
    reset();
    navigation.goBack();
  }, [reset, navigation]);

  if (!isAuthenticated) return null;

  if (status === 'success') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.successBackground }]}>
            <AppText variant="h2">✓</AppText>
          </View>
          <AppText variant="h2" color={colors.textPrimary} style={styles.successTitle}>
            Saque solicitado!
          </AppText>
          <AppText variant="bodyMd" color={colors.textSecondary} style={styles.successDesc}>
            Seu saque via Pix foi registrado. O valor será transferido em até 1 dia útil.
          </AppText>
          <Button label="Voltar ao início" onPress={handleSuccess} style={styles.successBtn} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <BalanceHeader title="Saque" balance={balance} onBack={handleBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Pix method card */}
        <View style={[styles.methodCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          <View style={[styles.pixBadge, { backgroundColor: colors.primaryLight }]}>
            <AppText variant="labelSm" color={colors.primary}>
              Pix
            </AppText>
          </View>
          <View style={styles.methodInfo}>
            <AppText variant="labelMd" color={colors.textPrimary}>
              Transferência via Pix
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Processado em até 1 dia útil
            </AppText>
          </View>
        </View>

        {/* Pix key form */}
        <PixWithdrawForm
          pixKeyType={pixKeyType}
          onSelectKeyType={setPixKeyType}
          pixKey={pixKey}
          onPixKeyChange={setPixKey}
          pixKeyError={pixKeyError}
        />

        {/* Amount */}
        <View style={styles.section}>
          <AmountInput
            label="Valor do saque"
            value={amountText}
            onChangeText={setAmountText}
            error={amountError}
          />
          <QuickAmountChips
            selectedAmount={selectedQuickAmount}
            onSelect={selectQuickAmount}
          />
        </View>

        {/* Limits info */}
        <View style={[styles.infoCard, { backgroundColor: colors.infoBackground }]}>
          <AppText variant="caption" color={colors.info}>
            Limite mínimo: R$ {WITHDRAW_MIN},00 · Limite máximo: R$ {WITHDRAW_MAX.toLocaleString('pt-BR')},00 por operação
          </AppText>
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          label={status === 'submitting' ? 'Processando...' : 'Solicitar Saque'}
          onPress={submit}
          loading={status === 'submitting'}
          disabled={status === 'submitting'}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    padding: spacing[5],
    gap: spacing[6],
    paddingBottom: spacing[4],
  },
  section: {
    gap: spacing[3],
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing[4],
  },
  pixBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
  },
  methodInfo: {
    flex: 1,
    gap: spacing[0.5],
  },
  infoCard: {
    borderRadius: 8,
    padding: spacing[3],
  },
  footer: {
    padding: spacing[5],
    paddingBottom: spacing[6],
    borderTopWidth: 1,
  },
  // Success state
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    gap: spacing[5],
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    textAlign: 'center',
  },
  successDesc: {
    textAlign: 'center',
    lineHeight: 22,
  },
  successBtn: {
    marginTop: spacing[4],
  },
});
