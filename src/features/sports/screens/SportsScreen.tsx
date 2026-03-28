import React, { memo, useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { spacing, borderRadius } from '../../../core/theme';
import { AppText } from '../../../components/ui/AppText';
import { BottomTabBar } from '../../../components/navigation/BottomTabBar';
import { BOTTOM_TABS } from '../../../navigation/bottomTabsConfig';
import { useSportsMatchesQuery } from '../hooks/useSportsMatchesQuery';
import type { SportTab, SportsMatch } from '../types/sports.types';
import type { PublicStackParamList } from '../../../navigation/types';

type SportsTabLabel = 'Futebol' | 'Basquete' | 'Tênis' | 'Ao Vivo';

const SPORT_TABS: { label: SportsTabLabel; value: SportTab | 'live' }[] = [
  { label: 'Futebol', value: 'futebol' },
  { label: 'Basquete', value: 'basquete' },
  { label: 'Tênis', value: 'tenis' },
  { label: 'Ao Vivo', value: 'live' },
];

const MOCK_LEAGUES = [
  { name: 'Champions', abbr: 'UCL' },
  { name: 'Premier', abbr: 'PL' },
  { name: 'La Liga', abbr: 'LL' },
  { name: 'Série A', abbr: 'SA' },
  { name: 'Libertadores', abbr: 'LIB' },
];

const MOCK_MATCHES: SportsMatch[] = [
  {
    id: '1',
    sport: 'futebol',
    league: 'Champions League',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    homeLogoUrl: null,
    awayLogoUrl: null,
    startTime: '2026-03-27T21:00:00Z',
    isLive: false,
    oddsHome: 2.10,
    oddsDraw: 3.40,
    oddsAway: 3.20,
    homeScore: null,
    awayScore: null,
    minute: null,
  },
  {
    id: '2',
    sport: 'futebol',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Liverpool',
    homeLogoUrl: null,
    awayLogoUrl: null,
    startTime: '2026-03-27T19:30:00Z',
    isLive: true,
    oddsHome: 2.80,
    oddsDraw: 3.10,
    oddsAway: 2.50,
    homeScore: 1,
    awayScore: 1,
    minute: 67,
  },
  {
    id: '3',
    sport: 'futebol',
    league: 'La Liga',
    homeTeam: 'Barcelona',
    awayTeam: 'Atlético Madrid',
    homeLogoUrl: null,
    awayLogoUrl: null,
    startTime: '2026-03-27T22:00:00Z',
    isLive: false,
    oddsHome: 1.75,
    oddsDraw: 3.60,
    oddsAway: 4.50,
    homeScore: null,
    awayScore: null,
    minute: null,
  },
  {
    id: '4',
    sport: 'basquete',
    league: 'NBA',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    homeLogoUrl: null,
    awayLogoUrl: null,
    startTime: '2026-03-27T23:00:00Z',
    isLive: false,
    oddsHome: 1.90,
    oddsDraw: 0,
    oddsAway: 1.90,
    homeScore: null,
    awayScore: null,
    minute: null,
  },
  {
    id: '5',
    sport: 'tenis',
    league: 'Roland Garros',
    homeTeam: 'Djokovic',
    awayTeam: 'Alcaraz',
    homeLogoUrl: null,
    awayLogoUrl: null,
    startTime: '2026-03-28T14:00:00Z',
    isLive: false,
    oddsHome: 1.60,
    oddsDraw: 0,
    oddsAway: 2.30,
    homeScore: null,
    awayScore: null,
    minute: null,
  },
];

interface MatchCardProps {
  match: SportsMatch;
}

const MatchCard = memo(function MatchCard({ match }: MatchCardProps) {
  const { colors } = useAppTheme();
  const startTime = new Date(match.startTime).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.matchCard, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
      <View style={styles.matchHeader}>
        <AppText variant="caption" color={colors.textTertiary}>{match.league}</AppText>
        {match.isLive ? (
          <View style={[styles.liveChip, { backgroundColor: '#e74c3c20', borderRadius: borderRadius.sm }]}>
            <AppText variant="caption" color="#e74c3c" style={styles.liveText}>
              {match.minute != null ? `${match.minute}'` : 'AO VIVO'}
            </AppText>
          </View>
        ) : (
          <AppText variant="caption" color={colors.textTertiary}>{startTime}</AppText>
        )}
      </View>
      <View style={styles.teamsRow}>
        <View style={styles.teamInfo}>
          <View style={[styles.teamLogoPlaceholder, { backgroundColor: colors.background, borderRadius: borderRadius.sm }]} />
          <AppText variant="bodySm" color={colors.textPrimary} numberOfLines={1} style={styles.teamName}>
            {match.homeTeam}
          </AppText>
        </View>
        {match.isLive && match.homeScore != null && match.awayScore != null ? (
          <View style={styles.scoreBox}>
            <AppText variant="h3" color={colors.secondary} style={styles.scoreText}>
              {match.homeScore} – {match.awayScore}
            </AppText>
          </View>
        ) : (
          <AppText variant="bodySm" color={colors.textTertiary} style={styles.vsText}>vs</AppText>
        )}
        <View style={[styles.teamInfo, styles.teamInfoRight]}>
          <View style={[styles.teamLogoPlaceholder, { backgroundColor: colors.background, borderRadius: borderRadius.sm }]} />
          <AppText variant="bodySm" color={colors.textPrimary} numberOfLines={1} style={styles.teamName}>
            {match.awayTeam}
          </AppText>
        </View>
      </View>
      <View style={styles.oddsRow}>
        <TouchableOpacity
          style={[styles.oddBtn, { backgroundColor: colors.background, borderRadius: borderRadius.md }]}
          activeOpacity={0.8}
        >
          <AppText variant="caption" color={colors.textSecondary}>1</AppText>
          <AppText variant="bodySm" color={colors.textPrimary} style={styles.oddValue}>{match.oddsHome.toFixed(2)}</AppText>
        </TouchableOpacity>
        {match.oddsDraw > 0 && (
          <TouchableOpacity
            style={[styles.oddBtn, { backgroundColor: colors.background, borderRadius: borderRadius.md }]}
            activeOpacity={0.8}
          >
            <AppText variant="caption" color={colors.textSecondary}>X</AppText>
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.oddValue}>{match.oddsDraw.toFixed(2)}</AppText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.oddBtn, { backgroundColor: colors.background, borderRadius: borderRadius.md }]}
          activeOpacity={0.8}
        >
          <AppText variant="caption" color={colors.textSecondary}>2</AppText>
          <AppText variant="bodySm" color={colors.textPrimary} style={styles.oddValue}>{match.oddsAway.toFixed(2)}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export const SportsScreen = memo(function SportsScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const [activeTab, setActiveTab] = useState<SportTab | 'live'>('futebol');

  const isLive = activeTab === 'live';
  const sport: SportTab | undefined = isLive ? undefined : activeTab as SportTab;

  const { data: fetchedMatches } = useSportsMatchesQuery({ sport, isLive });
  const matches: SportsMatch[] = (fetchedMatches as any)?.matches ?? MOCK_MATCHES;

  const filteredMatches = isLive
    ? matches.filter(m => m.isLive)
    : matches.filter(m => m.sport === activeTab);

  const popularMatches = filteredMatches.filter(m => !m.isLive).slice(0, 2);
  const liveMatches = filteredMatches.filter(m => m.isLive);
  const upcomingMatches = filteredMatches.filter(m => !m.isLive);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <AppText variant="h3" color={colors.textPrimary}>{'←'}</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color={colors.textPrimary} style={styles.headerTitle}>ESPORTES</AppText>
        <TouchableOpacity style={styles.headerBtn}>
          <AppText variant="bodyMd" color={colors.textSecondary}>🔍</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Sport tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {SPORT_TABS.map(tab => {
            const isActive = activeTab === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                onPress={() => setActiveTab(tab.value)}
                style={[
                  styles.sportTab,
                  {
                    backgroundColor: isActive ? colors.secondary : colors.surface,
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                {tab.value === 'live' && (
                  <View style={[styles.redDot, { backgroundColor: '#e74c3c' }]} />
                )}
                <AppText
                  variant="bodySm"
                  color={isActive ? '#000' : colors.textSecondary}
                  style={styles.tabText}
                >
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Partidas Populares */}
        {popularMatches.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.accentBar, { backgroundColor: colors.secondary }]} />
            <View style={styles.sectionHeader}>
              <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>
                PARTIDAS POPULARES
              </AppText>
              <TouchableOpacity>
                <AppText variant="caption" color={colors.secondary}>Ver todos</AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.twoColGrid}>
              {popularMatches.map(match => (
                <View key={match.id} style={styles.halfCard}>
                  <MatchCard match={match} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Ao Vivo */}
        {liveMatches.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.accentBar, { backgroundColor: '#e74c3c' }]} />
            <View style={styles.sectionHeader}>
              <View style={styles.liveHeaderLeft}>
                <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>AO VIVO</AppText>
                <View style={[styles.liveCountChip, { backgroundColor: '#e74c3c20', borderRadius: borderRadius.full }]}>
                  <AppText variant="caption" color="#e74c3c">• {liveMatches.length} jogos</AppText>
                </View>
              </View>
              <TouchableOpacity>
                <AppText variant="caption" color={colors.secondary}>Ver todos</AppText>
              </TouchableOpacity>
            </View>
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
        )}

        {/* Próximos Jogos */}
        {upcomingMatches.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.accentBar, { backgroundColor: colors.secondary }]} />
            <View style={styles.sectionHeader}>
              <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>
                PRÓXIMOS JOGOS
              </AppText>
              <TouchableOpacity>
                <AppText variant="caption" color={colors.secondary}>Ver todos</AppText>
              </TouchableOpacity>
            </View>
            {upcomingMatches.slice(0, 5).map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
        )}

        {/* Ligas Populares */}
        <View style={styles.section}>
          <View style={[styles.accentBar, { backgroundColor: colors.secondary }]} />
          <AppText variant="h3" color={colors.textPrimary} style={[styles.sectionTitle, { marginBottom: spacing[3] }]}>
            LIGAS POPULARES
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.leaguesRow}>
            {MOCK_LEAGUES.map(league => (
              <TouchableOpacity
                key={league.name}
                style={[styles.leagueCard, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}
                activeOpacity={0.8}
              >
                <View style={[styles.leagueCircle, { backgroundColor: colors.background, borderRadius: borderRadius.full }]}>
                  <AppText variant="caption" color={colors.secondary} style={styles.leagueAbbr}>{league.abbr}</AppText>
                </View>
                <AppText variant="caption" color={colors.textSecondary} numberOfLines={1} style={styles.leagueName}>
                  {league.name}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Empty state */}
        {filteredMatches.length === 0 && (
          <View style={styles.emptyState}>
            <AppText variant="bodyMd" color={colors.textTertiary}>Nenhuma partida encontrada</AppText>
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>

      <BottomTabBar tabs={BOTTOM_TABS} />
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
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: '800', letterSpacing: 1 },
  scroll: { flex: 1 },
  tabsContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  sportTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[1],
  },
  tabText: { fontWeight: '600' },
  redDot: { width: 6, height: 6, borderRadius: 3 },
  section: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  accentBar: {
    height: 3,
    width: 40,
    borderRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontWeight: '800', letterSpacing: 0.5 },
  liveHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  liveCountChip: { paddingHorizontal: spacing[2], paddingVertical: 2 },
  twoColGrid: { flexDirection: 'row', gap: spacing[3] },
  halfCard: { flex: 1 },
  matchCard: {
    padding: spacing[3],
    gap: spacing[2],
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveChip: { paddingHorizontal: spacing[2], paddingVertical: 2 },
  liveText: { fontWeight: '700', fontSize: 10 },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  teamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  teamInfoRight: { flexDirection: 'row-reverse' },
  teamLogoPlaceholder: { width: 24, height: 24, flexShrink: 0 },
  teamName: { flex: 1, fontWeight: '600' },
  scoreBox: { paddingHorizontal: spacing[2] },
  scoreText: { fontWeight: '800' },
  vsText: { fontWeight: '500' },
  oddsRow: { flexDirection: 'row', gap: spacing[2] },
  oddBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[2],
    gap: 2,
  },
  oddValue: { fontWeight: '700' },
  leaguesRow: { gap: spacing[3] },
  leagueCard: {
    alignItems: 'center',
    padding: spacing[3],
    gap: spacing[2],
    width: 80,
  },
  leagueCircle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leagueAbbr: { fontWeight: '700', fontSize: 12 },
  leagueName: { textAlign: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: spacing[8] },
  bottomPad: { height: spacing[4] },
});
