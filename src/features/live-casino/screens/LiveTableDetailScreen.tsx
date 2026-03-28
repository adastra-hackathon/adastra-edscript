import React, { memo, useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { spacing, borderRadius } from '../../../core/theme';
import { AppText } from '../../../components/ui/AppText';
import { useGameDetailQuery } from '../../game/hooks/useGameDetailQuery';
import { useAuthStore } from '../../../store/authStore';
import { apiClient } from '../../../core/api';
import { getRouletteColor } from '../../game-simulation/constants/rouletteColors';
import type { PublicStackParamList } from '../../../navigation/types';

const MOCK_LAST_NUMBERS = [7, 23, 0, 15, 32, 19, 4, 26, 11, 36];

const HOW_TO_PLAY_STEPS = [
  'Escolha o valor das fichas que deseja apostar.',
  'Clique nos números ou áreas de aposta no tabuleiro.',
  'Confirme suas apostas antes do cronômetro chegar a zero.',
  'O dealer girará a roleta e o resultado será exibido.',
  'Ganhos são creditados automaticamente no seu saldo.',
];

function getNumberBgColor(n: number): string {
  const c = getRouletteColor(n);
  if (c === 'green') return '#27ae60';
  if (c === 'red') return '#e74c3c';
  return '#1a1a2e';
}

export const LiveTableDetailScreen = memo(function LiveTableDetailScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const route = useRoute<RouteProp<PublicStackParamList, 'LiveTableDetail'>>();
  const { slug, gameId } = route.params;

  const { data: game } = useGameDetailQuery(slug);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteToggle = useCallback(() => {
    if (!isAuthenticated) {
      setIsFavorited(prev => !prev);
      return;
    }
    if (isFavorited) {
      apiClient.delete(`/me/favorites/${gameId}`).catch(() => null);
    } else {
      apiClient.post('/me/favorites', { gameId }).catch(() => null);
    }
    setIsFavorited(prev => !prev);
  }, [isAuthenticated, isFavorited, gameId]);

  const handleEnterTable = useCallback(() => {
    navigation.navigate('GameSimulation', { slug, gameId, mode: 'real' });
  }, [navigation, slug, gameId]);

  const minBet = game?.minBet != null
    ? game.minBet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 1,00';
  const maxBet = game?.maxBet != null
    ? game.maxBet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 5.000,00';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <AppText variant="h3" color={colors.textPrimary}>{'←'}</AppText>
        </TouchableOpacity>
        <AppText variant="h3" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
          {game?.name ?? 'Mesa Ao Vivo'}
        </AppText>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <AppText variant="bodyMd" color={colors.textSecondary}>{'⎘'}</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavoriteToggle} style={styles.headerBtn}>
            <AppText variant="bodyMd" color={isFavorited ? '#e74c3c' : colors.textSecondary}>
              {isFavorited ? '♥' : '♡'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Game image with live badge */}
        <View style={styles.imageContainer}>
          {game?.imageUrl ? (
            <Image source={{ uri: game.imageUrl }} style={styles.gameImage} resizeMode="cover" />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]} />
          )}
          <View style={styles.imageOverlay}>
            <View style={[styles.liveBadge, { backgroundColor: '#e74c3c', borderRadius: borderRadius.sm }]}>
              <AppText variant="caption" color="#fff" style={styles.liveBadgeText}>AO VIVO</AppText>
            </View>
            {game?.playersCount != null && (
              <View style={styles.playersRow}>
                <View style={[styles.greenDot, { backgroundColor: colors.secondary }]} />
                <AppText variant="caption" color="#fff">{game.playersCount} jogadores</AppText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Dealer info */}
          <View style={[styles.dealerRow, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
            <View style={[styles.dealerAvatar, { backgroundColor: colors.secondary, borderRadius: borderRadius.full }]}>
              <AppText variant="bodyMd" color="#000" style={styles.dealerAvatarText}>
                {(game?.dealerName ?? 'D')[0].toUpperCase()}
              </AppText>
            </View>
            <View style={styles.dealerInfo}>
              <AppText variant="bodyMd" color={colors.textPrimary} style={styles.dealerName}>
                {game?.dealerName ?? 'Dealer'}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>Dealer Profissional</AppText>
            </View>
            <View style={styles.dealerRight}>
              <AppText variant="caption" color="#f39c12">★ 4.8</AppText>
              <AppText variant="caption" color={colors.textTertiary}>8h online</AppText>
            </View>
          </View>

          {/* Stats row */}
          <View style={[styles.statsRow, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
            <View style={styles.statItem}>
              <AppText variant="caption" color={colors.textSecondary}>Mín</AppText>
              <AppText variant="bodySm" color={colors.secondary} style={styles.statValue}>{minBet}</AppText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <AppText variant="caption" color={colors.textSecondary}>Máx</AppText>
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.statValue}>{maxBet}</AppText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <AppText variant="caption" color={colors.textSecondary}>Jogadores</AppText>
              <AppText variant="bodySm" color={colors.secondary} style={styles.statValue}>
                {game?.playersCount ?? 0}
              </AppText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <AppText variant="caption" color={colors.textSecondary}>Rodada #</AppText>
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.statValue}>1.482</AppText>
            </View>
          </View>

          {/* Últimos Números */}
          <View style={styles.section}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Últimos Números</AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.numbersRow}>
              {MOCK_LAST_NUMBERS.map((num, i) => (
                <View
                  key={i}
                  style={[
                    styles.numberCircle,
                    { backgroundColor: getNumberBgColor(num), borderRadius: borderRadius.full },
                  ]}
                >
                  <AppText variant="caption" color="#fff" style={styles.numberCircleText}>{num}</AppText>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Limites de Mesa */}
          <View style={styles.section}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Limites de Mesa</AppText>
            <View style={[styles.limitsTable, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
              {[
                { label: 'Número Único', min: minBet, max: maxBet },
                { label: 'Dúzias/Colunas', min: minBet, max: maxBet },
                { label: 'Par/Ímpar', min: minBet, max: maxBet },
              ].map((row, i) => (
                <View
                  key={i}
                  style={[
                    styles.limitsRow,
                    i > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                  ]}
                >
                  <AppText variant="bodySm" color={colors.textSecondary} style={styles.limitsLabel}>
                    {row.label}
                  </AppText>
                  <AppText variant="bodySm" color={colors.textPrimary}>
                    {row.min} – {row.max}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          {/* Como Jogar */}
          <View style={styles.section}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Como Jogar</AppText>
            {HOW_TO_PLAY_STEPS.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: colors.secondary, borderRadius: borderRadius.full }]}>
                  <AppText variant="caption" color="#000" style={styles.stepNumberText}>{i + 1}</AppText>
                </View>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.stepText}>{step}</AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Bottom buttons */}
      <View style={[styles.bottomButtons, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.watchBtn, { borderColor: colors.secondary, borderRadius: borderRadius.lg }]}
          activeOpacity={0.8}
        >
          <AppText variant="bodyMd" color={colors.secondary} style={styles.buttonText}>Assistir</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleEnterTable}
          style={[styles.enterBtn, { backgroundColor: '#e74c3c', borderRadius: borderRadius.lg }]}
          activeOpacity={0.8}
        >
          <AppText variant="bodyMd" color="#fff" style={styles.buttonText}>Entrar na Mesa</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  headerBtn: { padding: spacing[2] },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: '700' },
  headerActions: { flexDirection: 'row' },
  scroll: { flex: 1 },
  imageContainer: { width: '100%', height: 180, position: 'relative' },
  gameImage: { width: '100%', height: '100%' },
  imagePlaceholder: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  liveBadge: { paddingHorizontal: spacing[2], paddingVertical: 2 },
  liveBadgeText: { fontWeight: '700', fontSize: 9, letterSpacing: 0.5 },
  playersRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  greenDot: { width: 6, height: 6, borderRadius: 3 },
  content: { padding: spacing[4], gap: spacing[4] },
  dealerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  dealerAvatar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealerAvatarText: { fontWeight: '700', fontSize: 18 },
  dealerInfo: { flex: 1, gap: 2 },
  dealerName: { fontWeight: '600' },
  dealerRight: { alignItems: 'flex-end', gap: 2 },
  statsRow: {
    flexDirection: 'row',
    padding: spacing[4],
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontWeight: '700' },
  statDivider: { width: 1, height: '100%' },
  section: { gap: spacing[3] },
  sectionTitle: { fontWeight: '700' },
  numbersRow: { gap: spacing[2] },
  numberCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberCircleText: { fontWeight: '700', fontSize: 12 },
  limitsTable: { overflow: 'hidden' },
  limitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[3],
  },
  limitsLabel: { flex: 1 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  stepNumber: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumberText: { fontWeight: '700', fontSize: 11 },
  stepText: { flex: 1, lineHeight: 20 },
  bottomPad: { height: spacing[4] },
  bottomButtons: {
    flexDirection: 'row',
    padding: spacing[4],
    gap: spacing[3],
    borderTopWidth: 1,
  },
  watchBtn: {
    flex: 1,
    borderWidth: 1.5,
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  enterBtn: {
    flex: 1,
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  buttonText: { fontWeight: '700' },
});
