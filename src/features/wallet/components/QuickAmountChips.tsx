import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import { QUICK_AMOUNTS } from '../types/wallet.types';

interface QuickAmountChipsProps {
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
}

export const QuickAmountChips = memo(function QuickAmountChips({
  selectedAmount,
  onSelect,
}: QuickAmountChipsProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {QUICK_AMOUNTS.map((amount) => {
        const isActive = selectedAmount === amount;
        return (
          <TouchableOpacity
            key={amount}
            onPress={() => onSelect(amount)}
            activeOpacity={0.75}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.backgroundSecondary,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <AppText
              variant="labelMd"
              color={isActive ? colors.textInverse : colors.textSecondary}
            >
              R$ {amount}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  chip: {
    flex: 1,
    minWidth: 72,
    paddingVertical: spacing[2.5],
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
  },
});
