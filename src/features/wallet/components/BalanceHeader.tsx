import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import { ChevronLeftIcon } from '../../../components/icons';

interface BalanceHeaderProps {
  title: string;
  balance: number;
  onBack: () => void;
}

export const BalanceHeader = memo(function BalanceHeader({
  title,
  balance,
  onBack,
}: BalanceHeaderProps) {
  const { colors } = useAppTheme();

  const formatted = balance.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Top row: back + title */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={8}
          style={[styles.backBtn, { backgroundColor: colors.surfaceElevated }]}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <AppText variant="h3" color={colors.textPrimary}>
          {title}
        </AppText>

        {/* Spacer para manter o título centralizado */}
        <View style={styles.spacer} />
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Balance */}
      <View style={styles.balanceRow}>
        <AppText variant="labelSm" color={colors.textSecondary}>
          Saldo disponível
        </AppText>
        <AppText variant="h1" color={colors.secondary}>
          {formatted}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[4],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: 36,
  },
  divider: {
    height: 1,
  },
  balanceRow: {
    gap: spacing[1],
  },
});
