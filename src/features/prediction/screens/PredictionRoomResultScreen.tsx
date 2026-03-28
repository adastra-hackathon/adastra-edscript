import React, { memo, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { useAuth } from '../../../core/hooks/useAuth';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { spacing } from '../../../core/theme';
import { usePredictionRoom } from '../hooks/usePredictionRoom';
import { usePredictionStore } from '../store/predictionStore';
import { PredictionPlayerList } from '../components/PredictionPlayerList';
import { PredictionEventItem } from '../components/PredictionEventItem';
import { predictionService } from '../services/predictionService';
import { formatCurrency } from '../../game-room/utils/gameRoomCalculations';
import type { AppStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Props = NativeStackScreenProps<AppStackParamList, 'PredictionRoomResult'>;

export const PredictionRoomResultScreen = memo(function PredictionRoomResultScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { roomId } = route.params;

  const { user } = useAuth();
  const { room, isLoading, refetch } = usePredictionRoom(roomId);
  const updateRoom = usePredictionStore((s) => s.updateRoom);

  // Host selects correct options before finishing
  const [correctOptions, setCorrectOptions] = useState<Record<string, string>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const isHost = room?.hostId === user?.id;
  const isFinished = room?.status === 'FINISHED';
  const isWinner = room?.winnerId === user?.id;
  const myPlayer = room?.players.find((p) => p.userId === user?.id);

  const handleSetCorrectOption = useCallback((eventId: string, optionId: string) => {
    setCorrectOptions((prev) => ({ ...prev, [eventId]: optionId }));
  }, []);

  const handleFinish = useCallback(async () => {
    if (!room) return;
    const selectedCount = Object.keys(correctOptions).length;
    if (selectedCount < room.events.length) {
      Alert.alert('Atenção', `Selecione a opção correta para todos os ${room.events.length} eventos.`);
      return;
    }
    setIsFinishing(true);
    try {
      const { data } = await predictionService.finish(room.id, {
        correctOptions: Object.entries(correctOptions).map(([eventId, optionId]) => ({ eventId, optionId })),
      });
      updateRoom(data.data);
      refetch();
    } catch (e: any) {
      const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível encerrar a sala.';
      Alert.alert('Erro', msg);
    } finally {
      setIsFinishing(false);
    }
  }, [room, correctOptions, updateRoom, refetch]);

  const handleBackToList = () => {
    navigation.reset({ index: 0, routes: [{ name: 'PredictionRoomList' }] });
  };

  if (isLoading && !room) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color="#A78BFA" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <AppText variant="h2" color={colors.textPrimary}>
          {isFinished ? 'Resultado' : 'Revelar Resultados'}
        </AppText>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Winner banner */}
        {isFinished && isWinner && (
          <View style={[styles.winnerBanner, { backgroundColor: '#A78BFA22', borderColor: '#A78BFA' }]}>
            <AppText style={styles.winnerEmoji}>🏆</AppText>
            <AppText style={[styles.winnerTitle, { color: '#A78BFA' }]}>Você venceu!</AppText>
            {room && (
              <AppText style={[styles.winnerPrize, { color: colors.textPrimary }]}>
                +{formatCurrency(room.prizePool * 0.95)}
              </AppText>
            )}
          </View>
        )}

        {/* My result */}
        {isFinished && myPlayer && (
          <View style={[styles.myResult, { backgroundColor: colors.surface }]}>
            <AppText style={[styles.myResultLabel, { color: colors.textSecondary }]}>Sua posição</AppText>
            <AppText style={[styles.myResultPosition, { color: colors.textPrimary }]}>
              #{myPlayer.position ?? '—'}
            </AppText>
            <AppText style={[styles.myResultScore, { color: isWinner ? '#A78BFA' : colors.textSecondary }]}>
              {myPlayer.score}/{room?.events.length ?? 0} acertos
            </AppText>
          </View>
        )}

        {/* Prize pool */}
        {room && (
          <View style={[styles.prizeCard, { backgroundColor: colors.surface }]}>
            <AppText style={[styles.prizeLabel, { color: colors.textSecondary }]}>Prêmio Total</AppText>
            <AppText style={[styles.prizeValue, { color: '#A78BFA' }]}>
              {formatCurrency(room.prizePool)}
            </AppText>
          </View>
        )}

        {/* Leaderboard */}
        {room && (
          <>
            <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Classificação Final</AppText>
            <PredictionPlayerList
              players={room.players}
              winnerId={room.winnerId}
              totalEvents={room.events.length}
              showResults={isFinished}
            />
          </>
        )}

        {/* Event results */}
        {isFinished && room && room.events.length > 0 && (
          <>
            <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Resultados por Evento</AppText>
            {room.events.map((event) => {
              const myPred = myPlayer?.predictions.find((p) => p.eventId === event.id);
              return (
                <PredictionEventItem
                  key={event.id}
                  event={event}
                  selectedOptionId={myPred?.optionId}
                  readonly
                  showResult
                />
              );
            })}
          </>
        )}

        {/* Host: select correct options to finish */}
        {!isFinished && isHost && room && (
          <>
            <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Selecione as respostas corretas ({Object.keys(correctOptions).length}/{room.events.length})
            </AppText>
            <AppText style={{ color: colors.textTertiary, fontSize: 12, marginBottom: spacing[3] }}>
              Selecione a opção correta para cada evento. Os pontos serão calculados automaticamente.
            </AppText>
            {room.events.map((event) => (
              <PredictionEventItem
                key={event.id}
                event={event}
                selectedOptionId={correctOptions[event.id]}
                onSelect={(optionId) => handleSetCorrectOption(event.id, optionId)}
              />
            ))}
            <Button
              label={isFinishing ? 'Calculando...' : 'Confirmar e Distribuir Prêmios'}
              onPress={handleFinish}
              loading={isFinishing}
              disabled={isFinishing}
              variant="secondary"
              style={{ marginTop: spacing[2] }}
            />
          </>
        )}

        <Button label="Ver todas as salas" onPress={handleBackToList} variant="outline" />
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomWidth: 1, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[8] },
  winnerBanner: { borderRadius: 12, padding: spacing[5], alignItems: 'center', borderWidth: 1 },
  winnerEmoji: { fontSize: 48, marginBottom: spacing[2] },
  winnerTitle: { fontSize: 22, fontFamily: 'Inter-Bold', marginBottom: spacing[1] },
  winnerPrize: { fontSize: 28, fontFamily: 'Inter-Bold' },
  myResult: { borderRadius: 12, padding: spacing[4], alignItems: 'center' },
  myResultLabel: { fontSize: 12, fontFamily: 'Inter-Regular', marginBottom: spacing[1] },
  myResultPosition: { fontSize: 36, fontFamily: 'Inter-Bold', marginBottom: spacing[1] },
  myResultScore: { fontSize: 16, fontFamily: 'Inter-SemiBold' },
  prizeCard: { borderRadius: 12, padding: spacing[4], alignItems: 'center' },
  prizeLabel: { fontSize: 12, fontFamily: 'Inter-Regular', marginBottom: spacing[1] },
  prizeValue: { fontSize: 24, fontFamily: 'Inter-Bold' },
  sectionTitle: { fontSize: 12, fontFamily: 'Inter-SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
});
