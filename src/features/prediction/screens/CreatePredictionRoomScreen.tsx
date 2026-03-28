import React, { memo, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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
import { spacing } from '../../../core/theme';
import { predictionService } from '../services/predictionService';
import { usePredictionStore } from '../store/predictionStore';
import type { AppStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

interface EventDraft {
  title: string;
  options: string[];
}

export const CreatePredictionRoomScreen = memo(function CreatePredictionRoomScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const { isAuthenticated } = useProtectedRoute({ pendingRoute: { stack: 'App', screen: 'PredictionRoomCreate' } });
  const updateRoom = usePredictionStore((s) => s.updateRoom);

  const [title, setTitle] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('10');
  const [isSimulation, setIsSimulation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [events, setEvents] = useState<EventDraft[]>([
    { title: '', options: ['', ''] },
  ]);

  const addEvent = useCallback(() => {
    setEvents((prev) => [...prev, { title: '', options: ['', ''] }]);
  }, []);

  const removeEvent = useCallback((idx: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const updateEventTitle = useCallback((idx: number, value: string) => {
    setEvents((prev) => prev.map((e, i) => i === idx ? { ...e, title: value } : e));
  }, []);

  const addOption = useCallback((eventIdx: number) => {
    setEvents((prev) =>
      prev.map((e, i) => i === eventIdx ? { ...e, options: [...e.options, ''] } : e),
    );
  }, []);

  const updateOption = useCallback((eventIdx: number, optIdx: number, value: string) => {
    setEvents((prev) =>
      prev.map((e, i) =>
        i === eventIdx ? { ...e, options: e.options.map((o, j) => j === optIdx ? value : o) } : e,
      ),
    );
  }, []);

  const removeOption = useCallback((eventIdx: number, optIdx: number) => {
    setEvents((prev) =>
      prev.map((e, i) =>
        i === eventIdx ? { ...e, options: e.options.filter((_, j) => j !== optIdx) } : e,
      ),
    );
  }, []);

  const handleCreate = useCallback(async () => {
    if (!title.trim()) return Alert.alert('Erro', 'Informe o título da sala.');
    const amount = parseFloat(entryAmount);
    if (isNaN(amount) || amount <= 0) return Alert.alert('Erro', 'Informe um valor de entrada válido.');
    for (const event of events) {
      if (!event.title.trim()) return Alert.alert('Erro', 'Preencha o título de todos os eventos.');
      const validOptions = event.options.filter((o) => o.trim());
      if (validOptions.length < 2) return Alert.alert('Erro', 'Cada evento deve ter pelo menos 2 opções.');
    }

    setIsLoading(true);
    try {
      const { data } = await predictionService.create({
        title: title.trim(),
        entryAmount: amount,
        maxPlayers: parseInt(maxPlayers) || 10,
        isSimulation,
        events: events.map((e, idx) => ({
          title: e.title.trim(),
          sortOrder: idx,
          options: e.options
            .filter((o) => o.trim())
            .map((o, j) => ({ label: o.trim(), sortOrder: j })),
        })),
      });
      updateRoom(data.data);
      navigation.replace('PredictionRoomLobby', { roomId: data.data.id });
    } catch (e: any) {
      const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível criar a sala.';
      Alert.alert('Erro', msg);
    } finally {
      setIsLoading(false);
    }
  }, [title, entryAmount, maxPlayers, isSimulation, events, updateRoom, navigation]);

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <AppText style={{ color: colors.textSecondary, fontSize: 20 }}>‹</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color={colors.textPrimary}>Nova Sala de Apostas</AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic info */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <AppText style={[styles.fieldLabel, { color: colors.textSecondary }]}>Título da Sala</AppText>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Champions League Final"
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.background }]}
          />

          <AppText style={[styles.fieldLabel, { color: colors.textSecondary }]}>Valor de Entrada (R$)</AppText>
          <TextInput
            value={entryAmount}
            onChangeText={setEntryAmount}
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.background }]}
          />

          <AppText style={[styles.fieldLabel, { color: colors.textSecondary }]}>Máximo de Jogadores</AppText>
          <TextInput
            value={maxPlayers}
            onChangeText={setMaxPlayers}
            keyboardType="numeric"
            placeholder="10"
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.background }]}
          />

          <View style={styles.switchRow}>
            <View>
              <AppText style={[styles.fieldLabel, { color: colors.textSecondary, marginBottom: 2 }]}>Modo Demo</AppText>
              <AppText style={{ color: colors.textTertiary, fontSize: 11 }}>Sem desconto de saldo real</AppText>
            </View>
            <Switch
              value={isSimulation}
              onValueChange={setIsSimulation}
              trackColor={{ false: colors.border, true: '#A78BFA' }}
              thumbColor={isSimulation ? '#fff' : colors.textTertiary}
            />
          </View>
        </View>

        {/* Events */}
        <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Eventos</AppText>

        {events.map((event, eventIdx) => (
          <View key={eventIdx} style={[styles.eventCard, { backgroundColor: colors.surface }]}>
            <View style={styles.eventHeader}>
              <AppText style={[styles.eventNum, { color: '#A78BFA' }]}>Evento {eventIdx + 1}</AppText>
              {events.length > 1 && (
                <TouchableOpacity onPress={() => removeEvent(eventIdx)} activeOpacity={0.7}>
                  <AppText style={{ color: colors.error, fontSize: 12, fontFamily: 'Inter-Medium' }}>Remover</AppText>
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              value={event.title}
              onChangeText={(v) => updateEventTitle(eventIdx, v)}
              placeholder="Pergunta do evento"
              placeholderTextColor={colors.textTertiary}
              style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.background }]}
            />

            <AppText style={[styles.optionsLabel, { color: colors.textSecondary }]}>Opções</AppText>
            {event.options.map((opt, optIdx) => (
              <View key={optIdx} style={styles.optionRow}>
                <TextInput
                  value={opt}
                  onChangeText={(v) => updateOption(eventIdx, optIdx, v)}
                  placeholder={`Opção ${optIdx + 1}`}
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.optionInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.background }]}
                />
                {event.options.length > 2 && (
                  <TouchableOpacity onPress={() => removeOption(eventIdx, optIdx)} style={styles.removeOptBtn} activeOpacity={0.7}>
                    <AppText style={{ color: colors.error, fontSize: 18 }}>×</AppText>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {event.options.length < 5 && (
              <TouchableOpacity onPress={() => addOption(eventIdx)} style={styles.addOptBtn} activeOpacity={0.7}>
                <AppText style={{ color: '#A78BFA', fontSize: 13, fontFamily: 'Inter-Medium' }}>+ Adicionar opção</AppText>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={addEvent} style={[styles.addEventBtn, { borderColor: '#A78BFA44' }]} activeOpacity={0.7}>
          <AppText style={{ color: '#A78BFA', fontSize: 14, fontFamily: 'Inter-SemiBold' }}>+ Adicionar Evento</AppText>
        </TouchableOpacity>

        <Button
          label={isLoading ? 'Criando...' : 'Criar Sala'}
          onPress={handleCreate}
          loading={isLoading}
          disabled={isLoading}
          variant="secondary"
          style={{ marginTop: spacing[2] }}
        />
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomWidth: 1,
  },
  backBtn: { width: 32 },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[8] },
  section: { borderRadius: 12, padding: spacing[4], gap: spacing[3] },
  sectionTitle: { fontSize: 12, fontFamily: 'Inter-SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldLabel: { fontSize: 12, fontFamily: 'Inter-Medium', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: spacing[3], paddingVertical: spacing[3], fontSize: 14, fontFamily: 'Inter-Regular' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventCard: { borderRadius: 12, padding: spacing[4] },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] },
  eventNum: { fontSize: 13, fontFamily: 'Inter-Bold' },
  optionsLabel: { fontSize: 12, fontFamily: 'Inter-Medium', marginBottom: spacing[2], marginTop: spacing[1] },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  optionInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: spacing[3], paddingVertical: spacing[2], fontSize: 13, fontFamily: 'Inter-Regular' },
  removeOptBtn: { padding: 4 },
  addOptBtn: { paddingVertical: spacing[2], marginTop: 4 },
  addEventBtn: { borderWidth: 1, borderRadius: 12, borderStyle: 'dashed', paddingVertical: spacing[4], alignItems: 'center' },
});
