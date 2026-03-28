import React, { memo, useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { SelectModal } from '../../../components/ui/SelectModal';
import type { SelectOption } from '../../../components/ui/SelectModal';
import { spacing } from '../../../core/theme';
import { gamesApi } from '../../games/api/gamesApi';
import { gameRoomService } from '../services/gameRoomService';
import { useGameRoomStore } from '../store/gameRoomStore';
import { formatCurrency } from '../utils/gameRoomCalculations';
import type { Game } from '../../games/types/games.types';
import type { AppStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const DURATION_OPTIONS = [
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
  { label: '30 min', value: 1800 },
];

const ENTRY_OPTIONS = [5, 10, 20, 50, 100, 200];

export const CreateGameRoomScreen = memo(function CreateGameRoomScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const { isAuthenticated } = useProtectedRoute({ pendingRoute: { stack: 'App', screen: 'GameRoomCreate' } });
  const updateRoom = useGameRoomStore((s) => s.updateRoom);

  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isSimulation, setIsSimulation] = useState(false);

  const [entryAmount, setEntryAmount] = useState(10);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [duration, setDuration] = useState(300);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setGamesLoading(true);
    gamesApi.getGames({ limit: 100 })
      .then((data) => setGames(data.games))
      .catch(() => {})
      .finally(() => setGamesLoading(false));
  }, []);

  const gameOptions = useMemo<SelectOption[]>(
    () => games.map((g) => ({ value: g.id, label: g.name, sublabel: `${g.provider.name} • ${g.type === 'CASINO' ? 'Cassino' : 'Ao Vivo'}` })),
    [games],
  );

  const selectedGame = games.find((g) => g.id === selectedGameId) ?? null;

  const handleCreate = useCallback(async () => {
    if (!selectedGameId) {
      Alert.alert('Campo obrigatório', 'Selecione um jogo.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await gameRoomService.create({ gameId: selectedGameId, entryAmount, maxPlayers, duration, isSimulation });
      updateRoom(data.data);
      navigation.replace('GameRoomLobby', { roomId: data.data.id });
    } catch (e: any) {
      const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível criar a sala.';
      Alert.alert('Erro', msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGameId, entryAmount, maxPlayers, duration, updateRoom, navigation]);

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <AppText style={{ color: colors.textSecondary, fontSize: 20 }}>‹</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color={colors.textPrimary}>Nova Sala</AppText>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Game Select */}
        <View style={styles.section}>
          <AppText style={[styles.label, { color: colors.textSecondary }]}>Jogo</AppText>
          <SelectModal
            options={gameOptions}
            value={selectedGameId}
            onChange={(opt) => setSelectedGameId(opt.value)}
            placeholder="Selecione um jogo..."
            title="Selecionar Jogo"
            searchPlaceholder="Buscar jogo..."
            loading={gamesLoading}
          />
        </View>

        {/* Entry Amount */}
        <View style={styles.section}>
          <AppText style={[styles.label, { color: colors.textSecondary }]}>Valor de Entrada</AppText>
          <View style={styles.optionRow}>
            {ENTRY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setEntryAmount(opt)}
                style={[
                  styles.optionChip,
                  { backgroundColor: entryAmount === opt ? colors.secondary : colors.surface, borderColor: colors.border },
                ]}
                activeOpacity={0.7}
              >
                <AppText style={[styles.optionText, { color: entryAmount === opt ? colors.background : colors.textPrimary }]}>
                  {formatCurrency(opt)}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Max Players */}
        <View style={styles.section}>
          <AppText style={[styles.label, { color: colors.textSecondary }]}>Máximo de Jogadores</AppText>
          <View style={styles.stepper}>
            <TouchableOpacity
              onPress={() => setMaxPlayers((v) => Math.max(2, v - 1))}
              style={[styles.stepBtn, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <AppText style={{ color: colors.textPrimary, fontSize: 18 }}>−</AppText>
            </TouchableOpacity>
            <AppText style={[styles.stepValue, { color: colors.textPrimary }]}>{maxPlayers}</AppText>
            <TouchableOpacity
              onPress={() => setMaxPlayers((v) => Math.min(10, v + 1))}
              style={[styles.stepBtn, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <AppText style={{ color: colors.textPrimary, fontSize: 18 }}>+</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <AppText style={[styles.label, { color: colors.textSecondary }]}>Duração da Sala</AppText>
          <View style={styles.optionRow}>
            {DURATION_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setDuration(opt.value)}
                style={[
                  styles.optionChip,
                  { backgroundColor: duration === opt.value ? colors.secondary : colors.surface, borderColor: colors.border },
                ]}
                activeOpacity={0.7}
              >
                <AppText style={[styles.optionText, { color: duration === opt.value ? colors.background : colors.textPrimary }]}>
                  {opt.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Simulation Toggle */}
        <View style={[styles.toggleRow, { backgroundColor: colors.surface }]}>
          <View style={{ flex: 1 }}>
            <AppText style={[styles.label, { color: colors.textPrimary }]}>Modo Demo</AppText>
            <AppText style={{ color: colors.textTertiary, fontSize: 12, fontFamily: 'Inter-Regular', marginTop: 2 }}>
              Adiciona jogadores simulados, sem validação de saldo
            </AppText>
          </View>
          <Switch
            value={isSimulation}
            onValueChange={setIsSimulation}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor="#fff"
          />
        </View>

        {/* Summary */}
        <View style={[styles.summary, { backgroundColor: colors.surface }]}>
          <Row label="Jogo" value={selectedGame?.name ?? '—'} colors={colors} />
          <Row label="Entrada" value={formatCurrency(entryAmount)} colors={colors} />
          <Row label="Máx. jogadores" value={String(maxPlayers)} colors={colors} />
          <Row label="Prize pool máx." value={formatCurrency(entryAmount * maxPlayers)} colors={colors} highlight />
        </View>

        <Button
          label="Criar Sala"
          onPress={handleCreate}
          loading={isLoading}
          disabled={isLoading || !selectedGameId}
          variant="secondary"
        />
      </ScrollView>
    </SafeAreaView>
  );
});

function Row({ label, value, colors, highlight }: { label: string; value: string; colors: any; highlight?: boolean }) {
  return (
    <View style={rowStyles.row}>
      <AppText style={[rowStyles.label, { color: colors.textSecondary }]}>{label}</AppText>
      <AppText style={[rowStyles.value, { color: highlight ? colors.secondary : colors.textPrimary }]}>{value}</AppText>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2] },
  label: { fontSize: 13, fontFamily: 'Inter-Regular' },
  value: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
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
  backBtn: { padding: spacing[1] },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[5], paddingBottom: spacing[8] },
  section: { gap: spacing[2] },
  label: { fontSize: 13, fontFamily: 'Inter-Medium' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  optionChip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: spacing[3], paddingVertical: spacing[2] },
  optionText: { fontSize: 13, fontFamily: 'Inter-Medium' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing[4] },
  stepBtn: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  stepValue: { fontSize: 20, fontFamily: 'Inter-Bold', minWidth: 32, textAlign: 'center' },
  summary: { borderRadius: 12, padding: spacing[4] },
  toggleRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: spacing[4], gap: spacing[3] },
});
