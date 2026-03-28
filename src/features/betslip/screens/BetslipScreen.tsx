import React, { memo, useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../core/theme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import {
  useBetslipStore,
  selectTotalStake,
  selectPotentialPayout,
  selectAccumulatedOdds,
  selectSystemCombinations,
} from '../store/betslipStore';
import { BetslipHeader } from '../components/BetslipHeader';
import { BetslipTabs } from '../components/BetslipTabs';
import { BetSelectionCard } from '../components/BetSelectionCard';
import { MultipleStakeSection } from '../components/MultipleStakeSection';
import { BetslipSummaryCard } from '../components/BetslipSummaryCard';
import { BetslipOptions } from '../components/BetslipOptions';
import { BetslipActions } from '../components/BetslipActions';
import { SystemCombinationsCard } from '../components/SystemCombinationsCard';
import type { BetslipMode } from '../types/betslip.types';

// ─── Mock selections for demo (remove when wired to API) ─────────────────────

const MOCK_SELECTIONS = [
  {
    id: 'sel-1',
    eventId: 'ev-1',
    eventName: 'Fluminense Fem. vs Atlético MG',
    marketName: 'Resultado Final',
    selectionName: 'Fluminense Fem.',
    odd: 2.45,
    stake: 10,
  },
  {
    id: 'sel-2',
    eventId: 'ev-2',
    eventName: 'Real Madrid vs Barcelona',
    marketName: 'Vencedor da Partida',
    selectionName: 'Real Madrid',
    odd: 1.92,
    previousOdd: 1.85,
    stake: 10,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export const BetslipScreen = memo(function BetslipScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const { isAuthenticated } = useProtectedRoute({
    pendingRoute: { stack: 'App', screen: 'Bets' },
  });

  const {
    mode,
    selections: storeSelections,
    multipleStake,
    oddsOptions,
    setMode,
    removeSelection,
    updateSelectionStake,
    setMultipleStake,
    setOddsOptions,
    clearSlip,
  } = useBetslipStore();

  // Use mock data when store is empty (demo phase)
  const selections = storeSelections.length > 0 ? storeSelections : MOCK_SELECTIONS;

  const totalStake = selectTotalStake({ mode, selections, multipleStake, oddsOptions } as any);
  const potentialPayout = selectPotentialPayout({ mode, selections, multipleStake, oddsOptions } as any);
  const totalOdds = selectAccumulatedOdds({ mode, selections, multipleStake, oddsOptions } as any);
  const systemCombinations = selectSystemCombinations({ mode, selections, multipleStake, oddsOptions } as any);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleClear = useCallback(() => {
    Alert.alert('Limpar bilhete', 'Deseja remover todas as seleções?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearSlip },
    ]);
  }, [clearSlip]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    // Simulated submit — wire to API in next iteration
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    Alert.alert('Apostas enviadas!', 'Seu bilhete foi registrado com sucesso.');
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Meu bilhete: ${selections.length} seleções, cotação ${totalOdds.toFixed(2)}, ganho potencial R$ ${potentialPayout.toFixed(2)}`,
      });
    } catch (_) {}
  }, [selections, totalOdds, potentialPayout]);

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <BetslipHeader
        selectionCount={selections.length}
        onBack={handleBack}
        onClear={handleClear}
        canClear={selections.length > 0}
      />

      {/* Tabs */}
      <BetslipTabs active={mode} onSelect={setMode} />

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {selections.length === 0 ? (
          <EmptyState colors={colors} />
        ) : (
          <>
            {/* Selection Cards */}
            {selections.map((sel) => (
              <BetSelectionCard
                key={sel.id}
                selection={sel}
                mode={mode}
                onRemove={removeSelection}
                onStakeChange={updateSelectionStake}
              />
            ))}

            {/* Stake input for multiple/system */}
            {(mode === 'multiple' || mode === 'system') && (
              <MultipleStakeSection stake={multipleStake} onChange={setMultipleStake} />
            )}

            {/* System combinations */}
            {mode === 'system' && (
              <SystemCombinationsCard
                combinations={systemCombinations}
                multipleStake={multipleStake}
              />
            )}

            {/* Summary */}
            <BetslipSummaryCard
              mode={mode}
              selectionCount={selections.length}
              totalOdds={totalOdds}
              totalStake={totalStake}
              potentialPayout={potentialPayout}
            />

            {/* Odds options */}
            <BetslipOptions options={oddsOptions} onChange={setOddsOptions} />
          </>
        )}
      </ScrollView>

      {/* Footer actions */}
      {selections.length > 0 && (
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <BetslipActions
            onSubmit={handleSubmit}
            onShare={handleShare}
            isSubmitting={isSubmitting}
            canSubmit={selections.length > 0 && totalStake > 0}
          />
        </View>
      )}
    </SafeAreaView>
  );
});

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = memo(function EmptyState({
  colors,
}: {
  colors: ReturnType<typeof useAppTheme>['colors'];
}) {
  return (
    <View style={emptyStyles.container}>
      <AppText variant="h2" style={emptyStyles.icon}>
        🎫
      </AppText>
      <AppText variant="h3" color={colors.textPrimary}>
        Bilhete vazio
      </AppText>
      <AppText variant="bodyMd" color={colors.textSecondary} style={emptyStyles.desc}>
        Adicione seleções a partir das partidas esportivas para montar seu bilhete.
      </AppText>
    </View>
  );
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    padding: spacing[4],
    gap: spacing[4],
    paddingBottom: spacing[4],
  },
  footer: {
    padding: spacing[4],
    paddingBottom: spacing[6],
    borderTopWidth: 1,
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing[20],
    gap: spacing[4],
  },
  icon: {
    fontSize: 48,
  },
  desc: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});
