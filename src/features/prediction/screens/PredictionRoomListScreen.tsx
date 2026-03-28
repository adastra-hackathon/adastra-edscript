import React, { memo, useCallback, useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { useAuth } from '../../../core/hooks/useAuth';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../core/theme';
import { usePredictionRooms } from '../hooks/usePredictionRooms';
import { useJoinPredictionRoom } from '../hooks/useJoinPredictionRoom';
import { PredictionRoomCard } from '../components/PredictionRoomCard';
import type { PredictionRoomStatus, PredictionRoom } from '../types/prediction.types';
import type { AppStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const STATUS_TABS: { key: PredictionRoomStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Todas' },
  { key: 'WAITING', label: 'Aguardando' },
  { key: 'IN_PROGRESS', label: 'Em andamento' },
  { key: 'FINISHED', label: 'Finalizadas' },
];

export const PredictionRoomListScreen = memo(function PredictionRoomListScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const { isAuthenticated } = useProtectedRoute({ pendingRoute: { stack: 'App', screen: 'PredictionRoomList' } });

  const [activeTab, setActiveTab] = useState<PredictionRoomStatus | 'ALL'>('ALL');
  const [resultFilter, setResultFilter] = useState<'ALL' | 'WON' | 'LOST'>('ALL');
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const { user } = useAuth();
  const { rooms, isLoading, error, refetch } = usePredictionRooms(activeTab === 'ALL' ? undefined : activeTab);
  const { join, isLoading: isJoining, error: joinError } = useJoinPredictionRoom();

  const isFirstMount = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstMount.current) { isFirstMount.current = false; return; }
      refetch();
    }, [refetch]),
  );

  const filteredRooms = activeTab === 'FINISHED' && resultFilter !== 'ALL'
    ? rooms.filter((r) =>
        resultFilter === 'WON'
          ? r.winnerId === user?.id
          : r.winnerId !== user?.id && r.players.some((p) => p.userId === user?.id),
      )
    : rooms;

  const handleJoinById = useCallback(() => {
    const trimmed = joinRoomId.trim();
    if (!trimmed) return;
    setJoinModalVisible(false);
    setJoinRoomId('');
    navigation.navigate('PredictionRoomLobby', { roomId: trimmed });
  }, [joinRoomId, navigation]);

  const handleRoomPress = useCallback(
    (room: PredictionRoom) => navigation.navigate('PredictionRoomLobby', { roomId: room.id }),
    [navigation],
  );

  const handleJoin = useCallback(
    (room: PredictionRoom) => join(room.id),
    [join],
  );

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerActions}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <AppText style={{ color: colors.textSecondary, fontSize: 20 }}>‹</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color={colors.textPrimary}>Apostas</AppText>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setJoinModalVisible(true)}
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}
            activeOpacity={0.8}
          >
            <AppText style={[styles.actionBtnText, { color: colors.textSecondary }]}>Entrar por ID</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('PredictionRoomCreate')}
            style={[styles.actionBtn, { backgroundColor: '#A78BFA' }]}
            activeOpacity={0.8}
          >
            <AppText style={[styles.actionBtnText, { color: '#fff' }]}>+ Nova</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => { setActiveTab(tab.key); setResultFilter('ALL'); }}
            style={[styles.tab, activeTab === tab.key && { borderBottomColor: '#A78BFA', borderBottomWidth: 2 }]}
            activeOpacity={0.7}
          >
            <AppText style={[styles.tabText, { color: activeTab === tab.key ? '#A78BFA' : colors.textSecondary }]}>
              {tab.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Result sub-filter for Finalizadas */}
      {activeTab === 'FINISHED' && (
        <View style={[styles.subFilter, { borderBottomColor: colors.border }]}>
          {(['ALL', 'WON', 'LOST'] as const).map((f) => {
            const label = f === 'ALL' ? 'Todas' : f === 'WON' ? '🏆 Venceu' : '❌ Perdeu';
            const isActive = resultFilter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setResultFilter(f)}
                style={[styles.subFilterBtn, isActive && {
                  backgroundColor: f === 'WON' ? '#38E67D22' : f === 'LOST' ? '#FF6B6B22' : '#A78BFA22',
                  borderColor: f === 'WON' ? '#38E67D' : f === 'LOST' ? '#FF6B6B' : '#A78BFA',
                }]}
                activeOpacity={0.7}
              >
                <AppText style={[styles.subFilterText, {
                  color: isActive ? (f === 'WON' ? '#38E67D' : f === 'LOST' ? '#FF6B6B' : '#A78BFA') : colors.textSecondary,
                }]}>
                  {label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Error */}
      {(error || joinError) && (
        <View style={[styles.errorBanner, { backgroundColor: colors.errorBackground }]}>
          <AppText style={{ color: colors.error, fontSize: 13 }}>{error ?? joinError}</AppText>
        </View>
      )}

      {/* List */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#A78BFA" />
        </View>
      ) : (
        <FlatList
          data={filteredRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PredictionRoomCard
              room={item}
              onPress={() => handleRoomPress(item)}
              isParticipant={item.players.some((p) => p.userId === user?.id)}
              userId={user?.id}
              onJoin={
                item.status === 'WAITING' && !item.players.some((p) => p.userId === user?.id)
                  ? () => handleJoin(item)
                  : undefined
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.center}>
              <AppText style={{ color: colors.textTertiary, fontSize: 13, textAlign: 'center' }}>
                Nenhuma sala de apostas encontrada.
              </AppText>
            </View>
          }
        />
      )}

      {/* Join by ID modal */}
      <Modal visible={joinModalVisible} transparent animationType="fade" onRequestClose={() => setJoinModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <AppText variant="h3" color={colors.textPrimary} style={{ marginBottom: 6 }}>Entrar em uma sala</AppText>
            <AppText style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Cole o ID da sala para entrar diretamente.
            </AppText>
            <TextInput
              value={joinRoomId}
              onChangeText={setJoinRoomId}
              placeholder="Ex: a1b2c3d4-..."
              placeholderTextColor={colors.textTertiary}
              style={[styles.modalInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => { setJoinModalVisible(false); setJoinRoomId(''); }} style={[styles.modalBtn, { borderWidth: 1, borderColor: colors.border }]} activeOpacity={0.7}>
                <AppText style={{ color: colors.textSecondary, fontSize: 14, fontFamily: 'Inter-Medium' }}>Cancelar</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleJoinById} style={[styles.modalBtn, { backgroundColor: '#A78BFA' }]} activeOpacity={0.8}>
                <AppText style={{ color: '#fff', fontSize: 14, fontFamily: 'Inter-SemiBold' }}>Entrar</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {isJoining && (
        <View style={styles.overlay}>
          <ActivityIndicator color="#A78BFA" size="large" />
        </View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomWidth: 1,
  },
  backBtn: { padding: spacing[1] },
  headerActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { borderRadius: 8, paddingHorizontal: spacing[3], paddingVertical: spacing[1] },
  actionBtnText: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: spacing[2] },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing[3] },
  tabText: { fontSize: 12, fontFamily: 'Inter-Medium' },
  subFilter: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderBottomWidth: 1 },
  subFilterBtn: { paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
  subFilterText: { fontSize: 12, fontFamily: 'Inter-Medium' },
  list: { padding: spacing[4], paddingBottom: spacing[8] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[8] },
  errorBanner: { marginHorizontal: spacing[4], marginTop: spacing[2], padding: spacing[3], borderRadius: 8 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: spacing[6] },
  modalBox: { width: '100%', borderRadius: 16, padding: spacing[5] },
  modalSubtitle: { fontSize: 13, fontFamily: 'Inter-Regular', marginBottom: spacing[4] },
  modalInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: spacing[4], paddingVertical: spacing[3], fontSize: 14, fontFamily: 'Inter-Regular', marginBottom: spacing[4] },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalBtn: { flex: 1, borderRadius: 10, paddingVertical: spacing[3], alignItems: 'center' },
});
