import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import type { BetslipMode } from '../types/betslip.types';

interface BetslipSummaryCardProps {
  mode: BetslipMode;
  selectionCount: number;
  totalOdds: number;
  totalStake: number;
  potentialPayout: number;
}

const fmt = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const BetslipSummaryCard = memo(function BetslipSummaryCard({
  mode,
  selectionCount,
  totalOdds,
  totalStake,
  potentialPayout,
}: BetslipSummaryCardProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <SummaryRow
        label="Seleções"
        value={String(selectionCount)}
        valueColor={colors.textPrimary}
        colors={colors}
      />
      {mode !== 'simple' && (
        <SummaryRow
          label="Cotação total"
          value={totalOdds.toFixed(2)}
          valueColor={colors.textPrimary}
          colors={colors}
        />
      )}
      <SummaryRow
        label="Aposta Total"
        value={fmt(totalStake)}
        valueColor={colors.secondary}
        colors={colors}
      />
      <SummaryRow
        label="Ganho potencial"
        value={fmt(potentialPayout)}
        valueColor={colors.secondary}
        colors={colors}
        bold
      />
    </View>
  );
});

interface RowProps {
  label: string;
  value: string;
  valueColor: string;
  colors: ReturnType<typeof useAppTheme>['colors'];
  bold?: boolean;
}

const SummaryRow = memo(function SummaryRow({ label, value, valueColor, colors, bold }: RowProps) {
  return (
    <View style={styles.row}>
      <AppText variant="bodyMd" color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText
        variant={bold ? 'labelLg' : 'labelMd'}
        color={valueColor}
        style={bold ? styles.bold : undefined}
      >
        {value}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bold: {
    fontFamily: 'Inter-Bold',
  },
});
