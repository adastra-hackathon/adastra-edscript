import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import type { SystemCombination } from '../types/betslip.types';

interface SystemCombinationsCardProps {
  combinations: SystemCombination[];
  multipleStake: number;
}

const fmt = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const SystemCombinationsCard = memo(function SystemCombinationsCard({
  combinations,
  multipleStake,
}: SystemCombinationsCardProps) {
  const { colors } = useAppTheme();

  if (combinations.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AppText variant="bodyMd" color={colors.textTertiary} style={styles.empty}>
          Adicione ao menos 3 seleções para ver as combinações do Sistema.
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <AppText variant="labelSm" color={colors.textTertiary} style={styles.col1}>
          Combinações#
        </AppText>
        <AppText variant="labelSm" color={colors.textTertiary} style={styles.colRight}>
          Aposta Total
        </AppText>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Rows */}
      {combinations.map((combo) => (
        <View key={combo.label} style={styles.comboRow}>
          <View style={styles.col1}>
            <AppText variant="labelMd" color={colors.textPrimary}>
              1 {combo.label}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {combo.totalBets} apostas
            </AppText>
          </View>
          <View style={[styles.stakeBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <AppText variant="bodyMd" color={colors.textPrimary}>
              {fmt(multipleStake)}
            </AppText>
          </View>
        </View>
      ))}

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* 1 Para cima row */}
      <View style={styles.comboRow}>
        <View style={styles.col1}>
          <AppText variant="labelMd" color={colors.textPrimary}>
            1 Para cima {combinations.length} apostas
          </AppText>
        </View>
        <View style={[styles.stakeBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <AppText variant="bodyMd" color={colors.secondary}>
            {fmt(combinations.reduce((sum, c) => sum + c.totalStake, 0))}
          </AppText>
        </View>
      </View>
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
  empty: {
    textAlign: 'center',
    lineHeight: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col1: {
    flex: 1,
    gap: spacing[0.5],
  },
  colRight: {
    textAlign: 'right',
  },
  divider: {
    height: 1,
  },
  comboRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  stakeBox: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    minWidth: 90,
    alignItems: 'flex-end',
  },
});
