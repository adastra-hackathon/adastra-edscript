import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../../components/ui/AppText';
import { Button } from '../../../../components/ui/Button';
import { useAppTheme } from '../../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../../core/theme';

interface Props {
  balanceFormatted: string;
  onDepositPress: () => void;
}

export const ProfileModalBalance = memo(function ProfileModalBalance({
  balanceFormatted,
  onDepositPress,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.balanceRow}>
        <AppText variant="caption" color={colors.textSecondary}>
          Saldo disponível
        </AppText>
        <AppText variant="h3" color={colors.secondary}>
          {balanceFormatted}
        </AppText>
      </View>
      <Button
        label="Depositar"
        onPress={onDepositPress}
        variant="secondary"
        size="sm"
        fullWidth={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  balanceRow: {
    gap: spacing[0.5],
  },
});
