import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
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
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { useAuth } from '../../../core/hooks/useAuth';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { spacing } from '../../../core/theme';
import { usePredictionRoom } from '../hooks/usePredictionRoom';
import { useSubmitPredictions } from '../hooks/useSubmitPredictions';
import { usePredictionStore } from '../store/predictionStore';
import { PredictionEventItem } from '../components/PredictionEventItem';
import { PredictionPlayerList } from '../components/PredictionPlayerList';
import { predictionService } from '../services/predictionService';
import { formatCurrency } from '../../game-room/utils/gameRoomCalculations';
import { PREDICTION_STATUS_LABELS, PREDICTION_STATUS_COLORS } from '../types/prediction.types';
import type { AppStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Props = NativeStackScreenProps<AppStackParamList, 'PredictionRoomLobby'>;

const POLL_INTERVAL_MS = 5000;

export const PredictionRoomLobbyScreen = memo(function PredictionRoomLobbyScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { roomId } = route.params;

  const { isAuthenticated } = useProtectedRoute({ pendingRoute: { stack: 'App', screen: 'PredictionRoomLobby' } });
  const { user } = useAuth();
  const { room, isLoading, refetch } = usePredictionRoom(roomId);
  const updateRoom = usePredictionStore((s) => s.updateRoom);
  const draftPredictions = usePredictionStore((s) => s.draftPredictions);
  const setDraftPrediction = usePredictionStore((s) => s.setDraftPrediction);
  const { submit, isLoading: isSubmitting, error: submitError } = useSubmitPredictions();

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (room?.status === 'WAITING' || room?.status === 'IN_PROGRESS') {
      pollRef.current = setInterval(refetch, POLL_INTERVAL_MS);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [room?.status, refetch]);

  const handleStart = useCallback(async () => {
    if (!room) return;
    try {
      const { data } = await predictionService.start(room.id);
      updateRoom(data.data);
    } catch (e: any) {
      const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível iniciar a sala.';
      Alert.alert('Erro', msg);
    }
  }, [room, updateRoom]);

  const handleFinish = useCallback(async () => {
    if (!room) return;
    // Collect correct options from user input (host sets them)
    navigation.navigate('PredictionRoomResult', { roomId: room.id });
  }, [room, navigation]);

  const handleSubmitPredictions = useCallback(async () => {
    if (!room) return;
    const predictions = Object.entries(draftPredictions).map(([eventId, optionId]) => ({ eventId, optionId }));
    if (predictions.length === 0) {
      Alert.alert('Atenção', 'Faça pelo menos um palpite antes de confirmar.');
      return;
    }
    const result = await submit(room.id, predictions);
    if (result) {
      Alert.alert('Palpites enviados!', `${result.predictions.length}/${room.events.length} palpites confirmados.`);
      refetch();
    }
  }, [room, draftPredictions, submit, refetch]);

  if (!isAuthenticated) return null;

  const isHost = room?.hostId === user?.id;
  const myPlayer = room?.players.find((p) => p.userId === user?.id);
  const canStart = isHost && room?.status === 'WAITING' && (room?.players.length ?? 0) >= 2;
  const canSubmit = room?.status === 'IN_PROGRESS' && myPlayer && myPlayer.status !== 'READY';
  const totalEvents = room?.events.length ?? 0;
  const draftCount = Object.keys(draftPredictions).length;
  const statusColor = room ? PREDICTION_STATUS_COLORS[room.status] : '#FBBF24';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <AppText style={{ color: colors.textSecondary, fontSize: 20 }}>‹</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color={colors.textPrimary}>Apostas</AppText>
        {room && (
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
            <AppText style={[styles.statusText, { color: statusColor }]}>
              {PREDICTION_STATUS_LABELS[room.status]}
            </AppText>
          </View>
        )}
      </View>

      {isLoading && !room ? (
        <View style={styles.center}>
          <ActivityIndicator color="#A78BFA" />
        </View>
      ) : room ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Room info */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <AppText style={[styles.roomTitle, { color: colors.textPrimary }]}>{room.title}</AppText>
            <InfoRow label="Entrada" value={formatCurrency(room.entryAmount)} colors={colors} />
            <InfoRow label="Prêmio" value={formatCurrency(room.prizePool)} colors={colors} accent="#A78BFA" />
            <InfoRow label="Jogadores" value={`${room.players.length}/${room.maxPlayers}`} colors={colors} />
            <InfoRow label="Eventos" value={`${room.events.length} palpites`} colors={colors} />
            {room.predictionsDeadline && (
              <InfoRow
                label="Prazo"
                value={new Date(room.predictionsDeadline).toLocaleString('pt-BR')}
                colors={colors}
              />
            )}
          </View>

          {/* Players */}
          <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Participantes ({room.players.length}/{room.maxPlayers})
          </AppText>
          <PredictionPlayerList players={room.players} totalEvents={totalEvents} />

          {/* Events */}
          {room.status === 'IN_PROGRESS' && myPlayer && (
            <>
              <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Palpites ({draftCount}/{totalEvents} selecionados)
              </AppText>
              {room.events.map((event) => (
                <PredictionEventItem
                  key={event.id}
                  event={event}
                  selectedOptionId={
                    draftPredictions[event.id] ??
                    myPlayer.predictions.find((p) => p.eventId === event.id)?.optionId
                  }
                  onSelect={(optionId) => setDraftPrediction(event.id, optionId)}
                  readonly={myPlayer.status === 'READY'}
                />
              ))}
              {submitError && (
                <View style={[styles.errorBanner, { backgroundColor: colors.errorBackground }]}>
                  <AppText style={{ color: colors.error, fontSize: 13 }}>{submitError}</AppText>
                </View>
              )}
            </>
          )}

          {/* Waiting — show events as preview */}
          {room.status === 'WAITING' && room.events.length > 0 && (
            <>
              <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Eventos da sala
              </AppText>
              {room.events.map((event) => (
                <PredictionEventItem key={event.id} event={event} readonly />
              ))}
            </>
          )}

          {/* Host actions */}
          {isHost && room.status === 'WAITING' && (
            <View style={styles.hostSection}>
              {!canStart && (
                <AppText style={{ color: colors.textTertiary, fontSize: 12, textAlign: 'center', marginBottom: spacing[3] }}>
                  Aguardando mais jogadores (mínimo 2)
                </AppText>
              )}
              <Button
                label="Iniciar Sala"
                onPress={handleStart}
                variant="secondary"
                disabled={!canStart}
              />
            </View>
          )}

          {/* Submit predictions */}
          {canSubmit && (
            <Button
              label={isSubmitting ? 'Enviando...' : `Confirmar Palpites (${draftCount}/${totalEvents})`}
              onPress={handleSubmitPredictions}
              loading={isSubmitting}
              disabled={isSubmitting || draftCount === 0}
              style={{ marginTop: spacing[2] }}
            />
          )}

          {/* My status when READY */}
          {myPlayer?.status === 'READY' && room.status === 'IN_PROGRESS' && (
            <View style={styles.waitingMsg}>
              <AppText style={{ color: '#38E67D', fontSize: 13, textAlign: 'center', fontFamily: 'Inter-SemiBold' }}>
                ✓ Palpites confirmados! Aguardando o host encerrar a sala.
              </AppText>
            </View>
          )}

          {/* Non-host waiting message */}
          {!isHost && room.status === 'WAITING' && (
            <View style={styles.waitingMsg}>
              <ActivityIndicator color="#A78BFA" size="small" style={{ marginBottom: spacing[2] }} />
              <AppText style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center' }}>
                Aguardando o host iniciar...
              </AppText>
            </View>
          )}

          {/* Host finish button */}
          {isHost && room.status === 'IN_PROGRESS' && (
            <View style={styles.hostSection}>
              <AppText style={{ color: colors.textTertiary, fontSize: 12, textAlign: 'center', marginBottom: spacing[3] }}>
                Quando os eventos encerrarem, revele os resultados.
              </AppText>
              <Button
                label="Encerrar e Revelar Resultados"
                onPress={handleFinish}
                variant="secondary"
              />
            </View>
          )}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
});

function InfoRow({ label, value, colors, accent }: { label: string; value: string; colors: any; accent?: string }) {
  return (
    <View style={infoStyles.row}>
      <AppText style={[infoStyles.label, { color: colors.textSecondary }]}>{label}</AppText>
      <AppText style={[infoStyles.value, { color: accent ?? colors.textPrimary }]}>{value}</AppText>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2] },
  label: { fontSize: 13, fontFamily: 'Inter-Regular' },
  value: { fontSize: 13, fontFamily: 'Inter-Medium' },
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomWidth: 1,
  },
  backBtn: { padding: spacing[1] },
  statusBadge: { paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 20 },
  statusText: { fontSize: 12, fontFamily: 'Inter-SemiBold' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[8] },
  infoCard: { borderRadius: 12, padding: spacing[4] },
  roomTitle: { fontSize: 16, fontFamily: 'Inter-Bold', marginBottom: spacing[3] },
  sectionTitle: { fontSize: 12, fontFamily: 'Inter-SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  hostSection: { marginTop: spacing[2] },
  waitingMsg: { alignItems: 'center', paddingVertical: spacing[4] },
  errorBanner: { padding: spacing[3], borderRadius: 8 },
});
