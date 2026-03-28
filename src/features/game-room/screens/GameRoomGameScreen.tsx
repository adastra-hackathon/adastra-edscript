import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { useAuth } from '../../../core/hooks/useAuth';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { spacing } from '../../../core/theme';
import { useGameRoom } from '../hooks/useGameRoom';
import { useGameRoomStore } from '../store/gameRoomStore';
import { gameRoomService } from '../services/gameRoomService';
import { formatCurrency, calcProfit } from '../utils/gameRoomCalculations';
import type { AppStackParamList } from '../../../navigation/types';
import type { FinishGameRoomPayload } from '../types/game-room.types';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Props = NativeStackScreenProps<AppStackParamList, 'GameRoomGame'>;

// Simulated round outcomes
const MULTIPLIERS = [0, 0.5, 0.8, 1.5, 2.0, 3.0, 5.0];

function pickMultiplier(): number {
  const weights = [0.3, 0.15, 0.15, 0.2, 0.1, 0.07, 0.03];
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) return MULTIPLIERS[i];
  }
  return MULTIPLIERS[0];
}

export const GameRoomGameScreen = memo(function GameRoomGameScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { roomId } = route.params;

  const { isAuthenticated } = useProtectedRoute({ pendingRoute: { stack: 'App', screen: 'GameRoomGame' } });
  const { user } = useAuth();
  const { room } = useGameRoom(roomId);

  const simulationBalance = useGameRoomStore((s) => s.simulationBalance);
  const simulationRounds = useGameRoomStore((s) => s.simulationRounds);
  const recordRound = useGameRoomStore((s) => s.recordRound);
  const updateRoom = useGameRoomStore((s) => s.updateRoom);

  const [betAmount, setBetAmount] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastMultiplier, setLastMultiplier] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const isHost = room?.hostId === user?.id;

  const handleSpin = useCallback(async () => {
    if (isSpinning || betAmount > simulationBalance) return;
    setIsSpinning(true);
    setLastMultiplier(null);

    // Simulate spin delay
    await new Promise((r) => setTimeout(r, 800));

    const multiplier = pickMultiplier();
    const winAmount = Number((betAmount * multiplier).toFixed(2));
    const newBalance = Number((simulationBalance - betAmount + winAmount).toFixed(2));
    const outcome = winAmount >= betAmount ? 'win' : 'loss';

    setLastMultiplier(multiplier);
    recordRound({ bet: betAmount, outcome, multiplier, balanceAfter: newBalance });
    setIsSpinning(false);
  }, [isSpinning, betAmount, simulationBalance, recordRound]);

  const handleFinish = useCallback(async () => {
    if (!room || !user) return;

    Alert.alert(
      'Finalizar sala',
      'Deseja encerrar a sessão e enviar os resultados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: async () => {
            setIsFinishing(true);
            try {
              // Build results from store + other players (we only have our own simulation)
              const myPlayer = room.players.find((p) => p.userId === user.id);
              const initialBalance = myPlayer?.initialBalance ?? simulationBalance;

              const results = room.players.map((p) => {
                if (p.userId === user.id) {
                  return {
                    userId: p.userId,
                    finalBalance: simulationBalance,
                    position: 1, // will be overridden by server
                  };
                }
                // Simulate other players with random final balance
                const simFinal = Number((p.initialBalance * (0.5 + Math.random())).toFixed(2));
                return { userId: p.userId, finalBalance: simFinal, position: 1 };
              });

              // Sort by finalBalance descending to assign positions
              const sorted = [...results].sort((a, b) => b.finalBalance - a.finalBalance);
              sorted.forEach((r, i) => { r.position = i + 1; });

              const winnerId = sorted[0].userId;
              const lastPlaceUserId = sorted[sorted.length - 1].userId;

              const payload: FinishGameRoomPayload = { results, winnerId, lastPlaceUserId };
              const { data } = await gameRoomService.finish(room.id, payload);
              updateRoom(data.data);
              navigation.replace('GameRoomResult', { roomId });
            } catch (e: any) {
              const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível finalizar a sala.';
              Alert.alert('Erro', msg);
            } finally {
              setIsFinishing(false);
            }
          },
        },
      ],
    );
  }, [room, user, simulationBalance, updateRoom, navigation, roomId]);

  if (!isAuthenticated) return null;

  const myPlayer = room?.players.find((p) => p.userId === user?.id);
  const initialBalance = myPlayer?.initialBalance ?? 0;
  const profit = Number((simulationBalance - initialBalance).toFixed(2));
  const profitColor = profit >= 0 ? colors.secondary : colors.error;

  const BET_OPTIONS = [1, 2, 5, 10];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <AppText variant="h2" color={colors.textPrimary}>Sala em Jogo</AppText>
        <View style={[styles.balanceBadge, { backgroundColor: colors.surface }]}>
          <AppText style={[styles.balanceText, { color: colors.secondary }]}>
            {formatCurrency(simulationBalance)}
          </AppText>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profit indicator */}
        <View style={[styles.profitCard, { backgroundColor: colors.surface }]}>
          <AppText style={[styles.profitLabel, { color: colors.textSecondary }]}>
            Lucro / Prejuízo da sessão
          </AppText>
          <AppText style={[styles.profitValue, { color: profitColor }]}>
            {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
          </AppText>
          <AppText style={[styles.roundsText, { color: colors.textTertiary }]}>
            {simulationRounds.length} {simulationRounds.length === 1 ? 'rodada' : 'rodadas'}
          </AppText>
        </View>

        {/* Last spin result */}
        {lastMultiplier !== null && (
          <View style={[
            styles.resultCard,
            { backgroundColor: lastMultiplier >= 1 ? colors.secondary + '22' : colors.errorBackground },
          ]}>
            <AppText style={[styles.multiplierText, { color: lastMultiplier >= 1 ? colors.secondary : colors.error }]}>
              {lastMultiplier}x
            </AppText>
            <AppText style={{ color: colors.textSecondary, fontSize: 12 }}>
              {lastMultiplier === 0 ? 'Sem retorno' : lastMultiplier >= 1 ? 'Lucro!' : 'Prejuízo'}
            </AppText>
          </View>
        )}

        {/* Bet controls */}
        <View style={[styles.betCard, { backgroundColor: colors.surface }]}>
          <AppText style={[styles.sectionLabel, { color: colors.textSecondary }]}>Valor da aposta</AppText>
          <View style={styles.betOptions}>
            {BET_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setBetAmount(opt)}
                style={[
                  styles.betChip,
                  { backgroundColor: betAmount === opt ? colors.secondary : colors.background, borderColor: colors.border },
                ]}
                activeOpacity={0.7}
              >
                <AppText style={[styles.betChipText, { color: betAmount === opt ? colors.background : colors.textPrimary }]}>
                  {formatCurrency(opt)}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            label={isSpinning ? 'Girando...' : 'Girar'}
            onPress={handleSpin}
            loading={isSpinning}
            disabled={isSpinning || betAmount > simulationBalance}
            variant="primary"
            style={{ marginTop: spacing[3] }}
          />
        </View>

        {/* Recent rounds */}
        {simulationRounds.length > 0 && (
          <View style={[styles.historyCard, { backgroundColor: colors.surface }]}>
            <AppText style={[styles.sectionLabel, { color: colors.textSecondary }]}>Últimas rodadas</AppText>
            {[...simulationRounds].reverse().slice(0, 5).map((round, i) => (
              <View key={i} style={styles.historyRow}>
                <AppText style={{ color: colors.textSecondary, fontSize: 12 }}>
                  Aposta: {formatCurrency(round.bet)} • {round.multiplier}x
                </AppText>
                <AppText style={{
                  color: round.outcome === 'win' ? colors.secondary : colors.error,
                  fontSize: 12,
                  fontFamily: 'Inter-SemiBold',
                }}>
                  {round.outcome === 'win' ? '+' : ''}{formatCurrency(round.bet * round.multiplier - round.bet)}
                </AppText>
              </View>
            ))}
          </View>
        )}

        {/* Host finish button */}
        {isHost && (
          <Button
            label={isFinishing ? 'Finalizando...' : 'Finalizar Sala'}
            onPress={handleFinish}
            loading={isFinishing}
            disabled={isFinishing}
            variant="danger"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  balanceBadge: { borderRadius: 8, paddingHorizontal: spacing[3], paddingVertical: spacing[1] },
  balanceText: { fontSize: 15, fontFamily: 'Inter-Bold' },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[8] },
  profitCard: { borderRadius: 12, padding: spacing[4], alignItems: 'center' },
  profitLabel: { fontSize: 12, fontFamily: 'Inter-Regular', marginBottom: spacing[1] },
  profitValue: { fontSize: 28, fontFamily: 'Inter-Bold' },
  roundsText: { fontSize: 11, marginTop: spacing[1] },
  resultCard: { borderRadius: 12, padding: spacing[4], alignItems: 'center' },
  multiplierText: { fontSize: 36, fontFamily: 'Inter-Bold' },
  betCard: { borderRadius: 12, padding: spacing[4] },
  sectionLabel: { fontSize: 12, fontFamily: 'Inter-Medium', marginBottom: spacing[2] },
  betOptions: { flexDirection: 'row', gap: spacing[2] },
  betChip: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: spacing[2], alignItems: 'center' },
  betChipText: { fontSize: 13, fontFamily: 'Inter-Medium' },
  historyCard: { borderRadius: 12, padding: spacing[4] },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing[1] },
});
