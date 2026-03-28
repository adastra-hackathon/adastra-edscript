import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../core/theme';
import type { AppStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const MODES = [
  {
    key: 'DUEL' as const,
    icon: '🎮',
    title: 'Duelo',
    description: 'Compita com outros jogadores em jogos de cassino. Quem tiver o maior saldo ao fim da rodada vence o prêmio.',
    highlights: ['Jogos de cassino', 'Saldo em tempo real', 'Modo demonstração'],
    accentColor: '#38E67D',
  },
  {
    key: 'PREDICTION' as const,
    icon: '🎯',
    title: 'Apostas',
    description: 'Faça palpites sobre eventos reais e compita com outros usuários. Quem acertar mais palpites leva o prêmio.',
    highlights: ['Palpites competitivos', 'Eventos criados pelo host', 'Ranking por acertos'],
    accentColor: '#A78BFA',
  },
];

export const GameRoomModeScreen = memo(function GameRoomModeScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const { isAuthenticated } = useProtectedRoute({ pendingRoute: { stack: 'App', screen: 'GameRoomMode' } });

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <AppText style={{ color: colors.textSecondary, fontSize: 20 }}>‹</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color={colors.textPrimary}>Salas Competitivas</AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={[styles.subtitle, { color: colors.textSecondary }]}>
          Escolha o modo de jogo
        </AppText>

        {MODES.map((mode) => (
          <TouchableOpacity
            key={mode.key}
            onPress={() =>
              navigation.navigate(mode.key === 'DUEL' ? 'GameRoomList' : 'PredictionRoomList')
            }
            style={[styles.card, { backgroundColor: colors.surface, borderColor: mode.accentColor + '33' }]}
            activeOpacity={0.85}
          >
            {/* Card header */}
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: mode.accentColor + '22' }]}>
                <AppText style={styles.icon}>{mode.icon}</AppText>
              </View>
              <View style={styles.cardTitleRow}>
                <AppText style={[styles.cardTitle, { color: colors.textPrimary }]}>{mode.title}</AppText>
                <View style={[styles.arrowBadge, { backgroundColor: mode.accentColor + '22' }]}>
                  <AppText style={[styles.arrowText, { color: mode.accentColor }]}>›</AppText>
                </View>
              </View>
            </View>

            {/* Description */}
            <AppText style={[styles.cardDesc, { color: colors.textSecondary }]}>
              {mode.description}
            </AppText>

            {/* Highlights */}
            <View style={styles.highlights}>
              {mode.highlights.map((h) => (
                <View key={h} style={[styles.highlight, { backgroundColor: mode.accentColor + '15' }]}>
                  <AppText style={[styles.highlightText, { color: mode.accentColor }]}>• {h}</AppText>
                </View>
              ))}
            </View>

            {/* CTA strip */}
            <View style={[styles.ctaStrip, { backgroundColor: mode.accentColor + '22', borderTopColor: mode.accentColor + '33' }]}>
              <AppText style={[styles.ctaText, { color: mode.accentColor }]}>
                Ver salas de {mode.title}
              </AppText>
              <AppText style={[styles.ctaArrow, { color: mode.accentColor }]}>→</AppText>
            </View>
          </TouchableOpacity>
        ))}
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
  backBtn: { width: 32 },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[8] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', marginBottom: spacing[2] },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    paddingBottom: spacing[2],
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 26 },
  cardTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 22, fontFamily: 'Inter-Bold' },
  arrowBadge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  arrowText: { fontSize: 22, fontFamily: 'Inter-Bold', marginTop: -2 },
  cardDesc: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  highlight: { paddingHorizontal: spacing[2], paddingVertical: 4, borderRadius: 8 },
  highlightText: { fontSize: 12, fontFamily: 'Inter-Medium' },
  ctaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
  },
  ctaText: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
  ctaArrow: { fontSize: 18, fontFamily: 'Inter-Bold' },
});
