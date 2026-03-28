import React, { memo, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { spacing } from '../../../core/theme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { useAuthStore } from '../../../store/authStore';
import { useDeposit } from '../hooks/useDeposit';
import { BalanceHeader } from '../components/BalanceHeader';
import { PaymentMethodTabs } from '../components/PaymentMethodTabs';
import { AmountInput } from '../components/AmountInput';
import { QuickAmountChips } from '../components/QuickAmountChips';
import { PixDepositCard } from '../components/PixDepositCard';

export const DepositScreen = memo(function DepositScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const { isAuthenticated } = useProtectedRoute({
    pendingRoute: { stack: 'App', screen: 'Deposit' },
  });

  const balance = useAuthStore((s) => s.user?.balance ?? 0);

  const {
    method,
    setMethod,
    amountText,
    setAmountText,
    selectedQuickAmount,
    selectQuickAmount,
    pixKey,
    copied,
    copyPixKey,
    amountError,
    status,
    submit,
    reset,
  } = useDeposit();

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
            Depósito solicitado!
          </AppText>
          <AppText variant="bodyMd" color={colors.textSecondary} style={styles.successDesc}>
            Seu depósito via {method === 'pix' ? 'Pix' : method === 'boleto' ? 'Boleto' : 'Cartão'} foi registrado e será processado em breve.
          </AppText>
          <Button label="Voltar ao início" onPress={handleSuccess} style={styles.successBtn} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <BalanceHeader title="Depósito" balance={balance} onBack={handleBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Method tabs */}
        <View style={styles.section}>
          <AppText variant="labelMd" color={colors.textSecondary} style={styles.sectionLabel}>
            Forma de pagamento
          </AppText>
          <PaymentMethodTabs selected={method} onSelect={setMethod} />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <AmountInput
            label="Valor do depósito"
            value={amountText}
            onChangeText={setAmountText}
            error={amountError}
          />
          <QuickAmountChips
            selectedAmount={selectedQuickAmount}
            onSelect={selectQuickAmount}
          />
        </View>

        {/* Pix details */}
        {method === 'pix' && (
          <View style={styles.section}>
            <PixDepositCard
              pixKey={pixKey}
              onCopyKey={copyPixKey}
              copied={copied}
            />
          </View>
        )}

        {/* Non-pix placeholder */}
        {method !== 'pix' && (
          <View style={[styles.placeholderCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
            <AppText variant="bodyMd" color={colors.textTertiary} style={styles.placeholderText}>
              Integração com {method === 'credit' ? 'Cartão de Crédito' : method === 'debit' ? 'Cartão de Débito' : 'Boleto'} em breve.
            </AppText>
          </View>
        )}

        {/* Limits info */}
        <View style={[styles.infoCard, { backgroundColor: colors.infoBackground }]}>
          <AppText variant="caption" color={colors.info}>
            Depósito mínimo: R$ 10,00 · Crédito em até 5 minutos via Pix
          </AppText>
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          label={status === 'submitting' ? 'Processando...' : 'Depositar'}
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
  sectionLabel: {},
  placeholderCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing[6],
    alignItems: 'center',
  },
  placeholderText: {
    textAlign: 'center',
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
