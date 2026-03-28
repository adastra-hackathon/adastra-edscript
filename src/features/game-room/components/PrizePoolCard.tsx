import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { formatCurrency, calcWinnerPrize, calcPlatformFee } from '../utils/gameRoomCalculations';

interface Props {
  prizePool: number;
}

export function PrizePoolCard({ prizePool }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppText style={[styles.title, { color: colors.textSecondary }]}>Prize Pool</AppText>
      <AppText style={[styles.total, { color: colors.secondary }]}>{formatCurrency(prizePool)}</AppText>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.row}>
        <AppText style={[styles.label, { color: colors.textSecondary }]}>Vencedor (99%)</AppText>
        <AppText style={[styles.value, { color: colors.textPrimary }]}>{formatCurrency(calcWinnerPrize(prizePool))}</AppText>
      </View>
      <View style={styles.row}>
        <AppText style={[styles.label, { color: colors.textSecondary }]}>Plataforma (1%)</AppText>
        <AppText style={[styles.value, { color: colors.textTertiary }]}>{formatCurrency(calcPlatformFee(prizePool))}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: 16, marginBottom: 12 },
  title: { fontSize: 12, fontFamily: 'Inter-Regular', marginBottom: 4 },
  total: { fontSize: 28, fontFamily: 'Inter-Bold', marginBottom: 12 },
  divider: { height: 1, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 13, fontFamily: 'Inter-Regular' },
  value: { fontSize: 13, fontFamily: 'Inter-Medium' },
});
