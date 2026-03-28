import React, { memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { useAuth } from '../../../core/hooks/useAuth';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { spacing } from '../../../core/theme';
import { useGameRoomStore } from '../store/gameRoomStore';
import { PlayerList } from '../components/PlayerList';
import { VoucherCard } from '../components/VoucherCard';
import { PrizePoolCard } from '../components/PrizePoolCard';
import { formatCurrency, calcWinnerPrize } from '../utils/gameRoomCalculations';
import type { AppStackParamList } from '../../../navigation/types';
import type { GameRoomVoucher } from '../types/game-room.types';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Props = NativeStackScreenProps<AppStackParamList, 'GameRoomResult'>;

export const GameRoomResultScreen = memo(function GameRoomResultScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { roomId } = route.params;

  const { user } = useAuth();
  const room = useGameRoomStore((s) => s.selectedRoom?.id === roomId ? s.selectedRoom : s.rooms.find((r) => r.id === roomId) ?? null);
  const simulationRounds = useGameRoomStore((s) => s.simulationRounds);
  const resetSimulation = useGameRoomStore((s) => s.resetSimulation);

  const isWinner = room?.winnerId === user?.id;
  const myPlayer = room?.players.find((p) => p.userId === user?.id);

  // Voucher is only shown to the last place player — we simulate it here since
  // the API returns it in the user profile, not in the room response.
  // We show a placeholder voucher for the player in last position.
  const lastPlacePlayer = room?.players
    .filter((p) => p.position !== null)
    .sort((a, b) => (b.position ?? 0) - (a.position ?? 0))[0];
  const isLastPlace = lastPlacePlayer?.userId === user?.id;

  const mockVoucher: GameRoomVoucher | null = isLastPlace && room
    ? {
        id: 'local-voucher',
        userId: user!.id,
        roomId: room.id,
        amount: room.entryAmount,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        usedAt: null,
      }
    : null;

  const handleBackToList = () => {
    resetSimulation();
    navigation.reset({ index: 0, routes: [{ name: 'GameRoomMode' }] });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <AppText variant="h2" color={colors.textPrimary}>Resultado</AppText>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Winner banner */}
        {isWinner && (
          <View style={[styles.winnerBanner, { backgroundColor: colors.secondary + '22', borderColor: colors.secondary }]}>
            <AppText style={[styles.winnerEmoji]}>🏆</AppText>
            <AppText style={[styles.winnerTitle, { color: colors.secondary }]}>Você venceu!</AppText>
            {room && (
              <AppText style={[styles.winnerPrize, { color: colors.textPrimary }]}>
                +{formatCurrency(calcWinnerPrize(room.prizePool))}
              </AppText>
            )}
          </View>
        )}

        {/* My result */}
        {myPlayer && room && (
          <View style={[styles.myResult, { backgroundColor: colors.surface }]}>
            <AppText style={[styles.myResultLabel, { color: colors.textSecondary }]}>Sua posição</AppText>
            <AppText style={[styles.myResultPosition, { color: colors.textPrimary }]}>
              #{myPlayer.position ?? '—'}
            </AppText>
            {myPlayer.profit !== null && (
              <AppText style={[
                styles.myResultProfit,
                { color: myPlayer.profit >= 0 ? colors.secondary : colors.error },
              ]}>
                {myPlayer.profit >= 0 ? '+' : ''}{formatCurrency(myPlayer.profit)}
              </AppText>
            )}
            <AppText style={[styles.myResultRounds, { color: colors.textTertiary }]}>
              {simulationRounds.length} rodadas jogadas
            </AppText>
          </View>
        )}

        {/* Prize pool */}
        {room && <PrizePoolCard prizePool={room.prizePool} />}

        {/* Leaderboard */}
        {room && (
          <>
            <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Classificação Final</AppText>
            <PlayerList
              players={room.players}
              winnerId={room.winnerId}
              showResults
            />
          </>
        )}

        {/* Consolation voucher */}
        {mockVoucher && (
          <>
            <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Seu Voucher</AppText>
            <VoucherCard voucher={mockVoucher} />
          </>
        )}

        <Button
          label="Ver todas as salas"
          onPress={handleBackToList}
          variant="outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[8] },
  winnerBanner: {
    borderRadius: 12,
    padding: spacing[5],
    alignItems: 'center',
    borderWidth: 1,
  },
  winnerEmoji: { fontSize: 48, marginBottom: spacing[2] },
  winnerTitle: { fontSize: 22, fontFamily: 'Inter-Bold', marginBottom: spacing[1] },
  winnerPrize: { fontSize: 28, fontFamily: 'Inter-Bold' },
  myResult: {
    borderRadius: 12,
    padding: spacing[4],
    alignItems: 'center',
  },
  myResultLabel: { fontSize: 12, fontFamily: 'Inter-Regular', marginBottom: spacing[1] },
  myResultPosition: { fontSize: 36, fontFamily: 'Inter-Bold', marginBottom: spacing[1] },
  myResultProfit: { fontSize: 20, fontFamily: 'Inter-SemiBold', marginBottom: spacing[1] },
  myResultRounds: { fontSize: 11 },
  sectionTitle: { fontSize: 12, fontFamily: 'Inter-SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
});
