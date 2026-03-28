import React, { memo, useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { spacing, borderRadius } from '../../../core/theme';
import { AppText } from '../../../components/ui/AppText';
import { useGameDetailQuery } from '../../game/hooks/useGameDetailQuery';
import { useSlotSimulation } from '../hooks/useSlotSimulation';
import { useRouletteSimulation } from '../hooks/useRouletteSimulation';
import { getRouletteColor } from '../constants/rouletteColors';
import type { SlotGameConfig, SlotSpinResult } from '../types/slotSimulation.types';
import type { RouletteBet } from '../types/rouletteSimulation.types';
import type { PublicStackParamList } from '../../../navigation/types';

// ─── Slot Simulation View ──────────────────────────────────────────────────

interface SlotSimulationViewProps {
  config: SlotGameConfig;
  gameName: string;
  onBack: () => void;
}

const SYMBOL_COLORS: Record<string, string> = {
  WILD: '#f1c40f',
  SCATTER: '#9b59b6',
  A: '#e74c3c',
  K: '#e67e22',
  Q: '#3498db',
  J: '#27ae60',
  '10': '#95a5a6',
};

const SlotSimulationView = memo(function SlotSimulationView({
  config,
  gameName,
  onBack,
}: SlotSimulationViewProps) {
  const { colors } = useAppTheme();
  const {
    balance,
    betAmount,
    isSpinning,
    lastResult,
    history,
    canSpin,
    doSpin,
    increaseBet,
    decreaseBet,
    resetBalance,
  } = useSlotSimulation(config);

  const [showHistory, setShowHistory] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const renderHistoryItem = useCallback(({ item, index }: { item: SlotSpinResult; index: number }) => (
    <View
      key={item.roundId}
      style={[styles.historyRow, { backgroundColor: colors.surface, borderRadius: borderRadius.md }]}
    >
      <AppText variant="caption" color={colors.textTertiary}>#{history.length - index}</AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </AppText>
      <AppText variant="caption" color={colors.textSecondary}>{formatCurrency(item.betAmount)}</AppText>
      <AppText
        variant="caption"
        color={item.result === 'win' ? colors.secondary : '#e74c3c'}
        style={styles.historyPayout}
      >
        {item.result === 'win' ? `+${formatCurrency(item.payout)}` : '-'}
      </AppText>
    </View>
  ), [colors, history.length]);

  const currentGrid = lastResult?.grid ?? Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => '?'));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.simHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.simHeaderBtn}>
          <AppText variant="h3" color={colors.textPrimary}>{'←'}</AppText>
        </TouchableOpacity>
        <AppText variant="h3" color={colors.textPrimary} style={styles.simHeaderTitle} numberOfLines={1}>
          {gameName}
        </AppText>
        <View style={[styles.balanceChip, { backgroundColor: colors.surface, borderRadius: borderRadius.full }]}>
          <AppText variant="caption" color={colors.secondary} style={styles.balanceChipText}>
            {formatCurrency(balance)}
          </AppText>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Win display */}
        <View style={styles.winDisplay}>
          {lastResult && lastResult.result === 'win' ? (
            <View style={styles.winBanner}>
              <AppText variant="h2" color="#f1c40f" style={styles.winText}>
                VITÓRIA {formatCurrency(lastResult.payout)}
              </AppText>
              {lastResult.multiplier > 0 && (
                <View style={[styles.multiplierChip, { backgroundColor: '#f39c12', borderRadius: borderRadius.full }]}>
                  <AppText variant="caption" color="#000" style={styles.multiplierText}>
                    x{lastResult.multiplier}
                  </AppText>
                </View>
              )}
            </View>
          ) : null}
        </View>

        {/* Slot grid */}
        <View style={[styles.slotContainer, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
          {[0, 1, 2].map(row => (
            <View key={row} style={styles.slotRow}>
              {[0, 1, 2].map(col => {
                const symbol = isSpinning ? '?' : (currentGrid[row]?.[col] ?? '?');
                const symbolColor = SYMBOL_COLORS[symbol] ?? colors.textSecondary;
                return (
                  <View
                    key={col}
                    style={[
                      styles.slotCell,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        borderRadius: borderRadius.md,
                        opacity: isSpinning ? 0.4 + (Math.random() * 0.6) : 1,
                      },
                    ]}
                  >
                    <AppText variant="h2" color={symbolColor} style={styles.slotSymbol}>
                      {symbol}
                    </AppText>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Insufficient balance warning */}
        {balance < betAmount && (
          <View style={[styles.warningBanner, { backgroundColor: '#e74c3c20', borderRadius: borderRadius.md }]}>
            <AppText variant="bodySm" color="#e74c3c">Saldo insuficiente</AppText>
            <TouchableOpacity onPress={resetBalance}>
              <AppText variant="bodySm" color={colors.secondary}>Reiniciar saldo</AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* Controls */}
        <View style={[styles.controlsContainer, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
          {/* Bet row */}
          <View style={styles.controlRow}>
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.controlLabel}>Aposta</AppText>
            <View style={styles.betControls}>
              <TouchableOpacity
                onPress={decreaseBet}
                style={[styles.betBtn, { backgroundColor: colors.background, borderRadius: borderRadius.md }]}
                disabled={isSpinning}
              >
                <AppText variant="h3" color={colors.textPrimary}>−</AppText>
              </TouchableOpacity>
              <View style={[styles.betValueBox, { backgroundColor: colors.background, borderRadius: borderRadius.md }]}>
                <AppText variant="bodyMd" color={colors.textPrimary} style={styles.betValue}>
                  {formatCurrency(betAmount)}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={increaseBet}
                style={[styles.betBtn, { backgroundColor: colors.background, borderRadius: borderRadius.md }]}
                disabled={isSpinning}
              >
                <AppText variant="h3" color={colors.textPrimary}>+</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lines row */}
          <View style={styles.controlRow}>
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.controlLabel}>Linhas</AppText>
            <AppText variant="bodyMd" color={colors.textPrimary}>243</AppText>
          </View>
        </View>

        {/* Action buttons row */}
        <View style={styles.actionRow}>
          {/* Auto toggle */}
          <TouchableOpacity
            onPress={() => setAutoPlay(prev => !prev)}
            style={[
              styles.sideBtn,
              {
                backgroundColor: autoPlay ? colors.secondary : colors.surface,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <AppText variant="caption" color={autoPlay ? '#000' : colors.textSecondary}>Auto</AppText>
          </TouchableOpacity>

          {/* Spin button */}
          <TouchableOpacity
            onPress={doSpin}
            disabled={!canSpin}
            style={[
              styles.spinButton,
              {
                backgroundColor: canSpin ? colors.secondary : colors.border,
                borderRadius: borderRadius.full,
              },
            ]}
            activeOpacity={0.85}
          >
            {isSpinning ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <AppText variant="h3" color="#000" style={styles.spinText}>GIRAR</AppText>
            )}
          </TouchableOpacity>

          {/* History toggle */}
          <TouchableOpacity
            onPress={() => setShowHistory(prev => !prev)}
            style={[
              styles.sideBtn,
              {
                backgroundColor: showHistory ? colors.secondary : colors.surface,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <AppText variant="caption" color={showHistory ? '#000' : colors.textSecondary}>Hist.</AppText>
          </TouchableOpacity>
        </View>

        {/* History panel */}
        {showHistory && history.length > 0 && (
          <View style={[styles.historyPanel, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.historyTitle}>Histórico</AppText>
            <View style={styles.historyHeaderRow}>
              <AppText variant="caption" color={colors.textTertiary} style={styles.historyColRound}>#</AppText>
              <AppText variant="caption" color={colors.textTertiary} style={styles.historyColTime}>Hora</AppText>
              <AppText variant="caption" color={colors.textTertiary} style={styles.historyColBet}>Aposta</AppText>
              <AppText variant="caption" color={colors.textTertiary} style={styles.historyColPayout}>Ganho</AppText>
            </View>
            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={item => item.roundId}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});

// ─── Roulette Simulation View ──────────────────────────────────────────────

interface RouletteSimulationViewProps {
  gameName: string;
  onBack: () => void;
}

const CHIP_VALUES = [1, 5, 25, 100, 500];

const NUMBER_LAYOUT = [
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
];

const RouletteSimulationView = memo(function RouletteSimulationView({
  gameName,
  onBack,
}: RouletteSimulationViewProps) {
  const { colors } = useAppTheme();
  const {
    balance,
    currentBets,
    totalBetAmount,
    phase,
    countdown,
    lastResult,
    history,
    canBet,
    addBet,
    clearBets,
  } = useRouletteSimulation(1000);

  const [selectedChip, setSelectedChip] = useState(5);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getBetAmount = useCallback((type: RouletteBet['type'], value: RouletteBet['value']): number => {
    return currentBets.find(b => b.type === type && b.value === value)?.amount ?? 0;
  }, [currentBets]);

  const handleNumberBet = useCallback((num: number) => {
    if (!canBet) return;
    addBet({ type: 'number', value: num, amount: selectedChip });
  }, [canBet, addBet, selectedChip]);

  const handleGroupBet = useCallback((type: RouletteBet['type'], value: string) => {
    if (!canBet) return;
    addBet({ type, value, amount: selectedChip });
  }, [canBet, addBet, selectedChip]);

  const getNumberBgColor = (n: number): string => {
    const color = getRouletteColor(n);
    if (color === 'green') return '#27ae60';
    if (color === 'red') return '#e74c3c';
    return '#1a1a2e';
  };

  const isClosing = phase === 'closing' || phase === 'spinning';
  const isResult = phase === 'result';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.simHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.simHeaderBtn}>
          <AppText variant="h3" color={colors.textPrimary}>{'←'}</AppText>
        </TouchableOpacity>
        <View style={styles.roulHeaderCenter}>
          <AppText variant="h3" color={colors.textPrimary} numberOfLines={1}>{gameName}</AppText>
          <View style={[styles.liveBadge, { backgroundColor: '#e74c3c', borderRadius: borderRadius.sm }]}>
            <AppText variant="caption" color="#fff" style={styles.liveBadgeText}>AO VIVO</AppText>
          </View>
        </View>
        <View style={[styles.balanceChip, { backgroundColor: colors.surface, borderRadius: borderRadius.full }]}>
          <AppText variant="caption" color={colors.secondary} style={styles.balanceChipText}>
            {formatCurrency(balance)}
          </AppText>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Wheel area */}
        <View style={styles.wheelArea}>
          <View style={[
            styles.wheelCircle,
            {
              backgroundColor: isResult && lastResult
                ? getNumberBgColor(lastResult.winningNumber)
                : colors.surface,
              borderColor: colors.secondary,
              borderRadius: borderRadius.full,
            },
          ]}>
            {isResult && lastResult ? (
              <AppText variant="h1" color="#fff" style={styles.wheelNumber}>
                {lastResult.winningNumber}
              </AppText>
            ) : isClosing ? (
              <ActivityIndicator color={colors.secondary} size="large" />
            ) : (
              <AppText variant="h1" color={colors.textTertiary} style={styles.wheelNumber}>
                {countdown}
              </AppText>
            )}
          </View>

          {/* Phase indicator */}
          {isClosing && (
            <View style={[styles.closingBanner, { backgroundColor: '#e74c3c20', borderRadius: borderRadius.md }]}>
              <AppText variant="bodySm" color="#e74c3c">Apostas encerradas</AppText>
            </View>
          )}

          {/* Countdown label */}
          {!isClosing && !isResult && (
            <AppText variant="bodySm" color={colors.textSecondary}>
              Próxima rodada em {countdown}s
            </AppText>
          )}
          {isResult && lastResult && (
            <AppText variant="bodyMd" color={lastResult.netResult >= 0 ? colors.secondary : '#e74c3c'}>
              {lastResult.netResult >= 0
                ? `Ganhou ${formatCurrency(lastResult.totalPayout)}`
                : 'Sem ganhos'}
            </AppText>
          )}
        </View>

        {/* Last numbers */}
        {history.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
            {history.map((num, i) => (
              <View
                key={i}
                style={[
                  styles.historyCircle,
                  { backgroundColor: getNumberBgColor(num), borderRadius: borderRadius.full },
                ]}
              >
                <AppText variant="caption" color="#fff" style={styles.historyCircleText}>{num}</AppText>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Chip selector */}
        <View style={styles.chipRow}>
          {CHIP_VALUES.map(chip => (
            <TouchableOpacity
              key={chip}
              onPress={() => setSelectedChip(chip)}
              style={[
                styles.chipBtn,
                {
                  backgroundColor: selectedChip === chip ? colors.secondary : colors.surface,
                  borderRadius: borderRadius.full,
                  borderColor: colors.secondary,
                  borderWidth: 1,
                },
              ]}
            >
              <AppText variant="caption" color={selectedChip === chip ? '#000' : colors.secondary}>
                {chip}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Number grid */}
        <View style={[styles.rouletteGrid, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
          {/* Zero */}
          <TouchableOpacity
            onPress={() => handleNumberBet(0)}
            style={[styles.zeroCell, { backgroundColor: '#27ae60', borderRadius: borderRadius.sm }]}
          >
            <AppText variant="bodySm" color="#fff" style={styles.numberText}>0</AppText>
            {getBetAmount('number', 0) > 0 && (
              <View style={[styles.chipIndicator, { backgroundColor: colors.secondary, borderRadius: borderRadius.full }]}>
                <AppText variant="caption" color="#000" style={styles.chipIndicatorText}>
                  {getBetAmount('number', 0)}
                </AppText>
              </View>
            )}
          </TouchableOpacity>

          {/* Number rows */}
          <View style={styles.numberGrid}>
            {NUMBER_LAYOUT.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.numberRow}>
                {row.map(num => {
                  const betAmt = getBetAmount('number', num);
                  return (
                    <TouchableOpacity
                      key={num}
                      onPress={() => handleNumberBet(num)}
                      style={[
                        styles.numberCell,
                        {
                          backgroundColor: getNumberBgColor(num),
                          borderRadius: borderRadius.sm,
                          opacity: canBet ? 1 : 0.6,
                        },
                      ]}
                    >
                      <AppText variant="caption" color="#fff" style={styles.numberText}>{num}</AppText>
                      {betAmt > 0 && (
                        <View style={[styles.chipIndicator, { backgroundColor: colors.secondary, borderRadius: borderRadius.full }]}>
                          <AppText variant="caption" color="#000" style={styles.chipIndicatorText}>{betAmt}</AppText>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Group bets */}
        <View style={styles.groupBets}>
          {[
            { label: '1-12',  type: 'dozen' as const, value: '1-12'  },
            { label: '13-24', type: 'dozen' as const, value: '13-24' },
            { label: '25-36', type: 'dozen' as const, value: '25-36' },
          ].map(btn => {
            const betAmt = getBetAmount(btn.type, btn.value);
            return (
              <TouchableOpacity
                key={btn.value}
                onPress={() => handleGroupBet(btn.type, btn.value)}
                style={[
                  styles.groupBtn,
                  {
                    backgroundColor: betAmt > 0 ? colors.secondary : colors.surface,
                    borderRadius: borderRadius.md,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <AppText variant="bodySm" color={betAmt > 0 ? '#000' : colors.textSecondary}>{btn.label}</AppText>
                {betAmt > 0 && (
                  <AppText variant="caption" color="#000">({betAmt})</AppText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.groupBets}>
          {[
            { label: 'Par',    type: 'parity' as const, value: 'even' },
            { label: 'Ímpar',  type: 'parity' as const, value: 'odd'  },
            { label: 'Verm.',  type: 'color'  as const, value: 'red'  },
            { label: 'Preto',  type: 'color'  as const, value: 'black'},
          ].map(btn => {
            const betAmt = getBetAmount(btn.type, btn.value);
            const bgDefault = btn.value === 'red' ? '#e74c3c30' : btn.value === 'black' ? '#1a1a2e' : colors.surface;
            return (
              <TouchableOpacity
                key={btn.value}
                onPress={() => handleGroupBet(btn.type, btn.value)}
                style={[
                  styles.groupBtn,
                  {
                    backgroundColor: betAmt > 0 ? colors.secondary : bgDefault,
                    borderRadius: borderRadius.md,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <AppText variant="bodySm" color={betAmt > 0 ? '#000' : colors.textSecondary}>{btn.label}</AppText>
                {betAmt > 0 && (
                  <AppText variant="caption" color="#000">({betAmt})</AppText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom confirm row */}
        <View style={styles.confirmRow}>
          <TouchableOpacity
            onPress={clearBets}
            style={[styles.clearBtn, { borderColor: colors.border, borderRadius: borderRadius.md }]}
            disabled={!canBet}
          >
            <AppText variant="bodySm" color={colors.textSecondary}>Limpar</AppText>
          </TouchableOpacity>

          <View style={[styles.totalBetChip, { backgroundColor: colors.surface, borderRadius: borderRadius.md }]}>
            <AppText variant="caption" color={colors.textSecondary}>Aposta Total</AppText>
            <AppText variant="bodyMd" color={colors.textPrimary} style={styles.totalBetValue}>
              {formatCurrency(totalBetAmount)}
            </AppText>
          </View>

          <TouchableOpacity
            style={[
              styles.confirmBtn,
              {
                backgroundColor: canBet && totalBetAmount > 0 ? colors.secondary : colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
            disabled={!canBet || totalBetAmount === 0}
          >
            <AppText variant="bodyMd" color={canBet && totalBetAmount > 0 ? '#000' : colors.textTertiary} style={styles.confirmText}>
              Confirmar
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

// ─── Main Screen ───────────────────────────────────────────────────────────

export const GameSimulationScreen = memo(function GameSimulationScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const route = useRoute<RouteProp<PublicStackParamList, 'GameSimulation'>>();
  const { slug, gameId } = route.params;

  const { data: game, isLoading } = useGameDetailQuery(slug);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  if (isLoading || !game) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.secondary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (game.type === 'LIVE_CASINO') {
    return <RouletteSimulationView gameName={game.name} onBack={handleBack} />;
  }

  // Build slot config from game detail
  const volatilityRaw = game.volatility?.toLowerCase() ?? 'medium';
  const volatility: 'low' | 'medium' | 'high' =
    volatilityRaw === 'low' || volatilityRaw === 'high' ? volatilityRaw : 'medium';

  const slotConfig: SlotGameConfig = {
    gameId,
    gameSlug: slug,
    gameName: game.name,
    rtp: game.rtp ?? 96,
    volatility,
    minBet: game.minBet ?? 0.2,
    maxBet: game.maxBet ?? 100,
    defaultBet: game.minBet ?? 0.2,
    demoBalance: 1000,
  };

  return <SlotSimulationView config={slotConfig} gameName={game.name} onBack={handleBack} />;
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[8] },

  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  simHeaderBtn: { padding: spacing[2] },
  simHeaderTitle: { flex: 1, textAlign: 'center', fontWeight: '700' },
  balanceChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  balanceChipText: { fontWeight: '700' },

  // Slot
  winDisplay: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  winBanner: { alignItems: 'center', gap: spacing[2] },
  winText: { fontWeight: '800', textAlign: 'center' },
  multiplierChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  multiplierText: { fontWeight: '700' },

  slotContainer: {
    padding: spacing[4],
    gap: spacing[3],
  },
  slotRow: {
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
  },
  slotCell: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  slotSymbol: { fontWeight: '800', fontSize: 22 },

  warningBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[3],
  },

  controlsContainer: {
    padding: spacing[4],
    gap: spacing[3],
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: { fontWeight: '600' },
  betControls: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  betBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  betValueBox: {
    paddingHorizontal: spacing[4],
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  betValue: { fontWeight: '700' },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
  },
  sideBtn: {
    width: 60,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButton: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  spinText: { fontWeight: '800' },

  historyPanel: {
    padding: spacing[4],
    gap: spacing[3],
  },
  historyTitle: { fontWeight: '700' },
  historyHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[2],
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  historyColRound: { width: 30 },
  historyColTime: { flex: 1 },
  historyColBet: { flex: 1 },
  historyColPayout: { flex: 1, textAlign: 'right' },
  historyPayout: { textAlign: 'right', fontWeight: '700' },

  // Roulette
  roulHeaderCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  liveBadge: { paddingHorizontal: spacing[2], paddingVertical: 2 },
  liveBadgeText: { fontWeight: '700', fontSize: 9, letterSpacing: 0.5 },

  wheelArea: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
  },
  wheelCircle: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  wheelNumber: { fontWeight: '800', fontSize: 36 },
  closingBanner: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },

  historyScroll: { flexGrow: 0 },
  historyCircle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  historyCircleText: { fontWeight: '700', fontSize: 11 },

  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
  },
  chipBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rouletteGrid: {
    padding: spacing[3],
    flexDirection: 'row',
    gap: spacing[2],
  },
  zeroCell: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  numberGrid: { flex: 1, gap: spacing[1] },
  numberRow: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  numberCell: {
    flex: 1,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  numberText: { fontSize: 10, fontWeight: '700' },
  chipIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIndicatorText: { fontSize: 8, fontWeight: '700' },

  groupBets: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  groupBtn: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
    gap: 2,
  },

  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  clearBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderWidth: 1,
  },
  totalBetChip: {
    flex: 1,
    padding: spacing[3],
    alignItems: 'center',
  },
  totalBetValue: { fontWeight: '700' },
  confirmBtn: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  confirmText: { fontWeight: '700' },
});
