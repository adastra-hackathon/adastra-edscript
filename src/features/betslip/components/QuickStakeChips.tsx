import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import { QUICK_STAKES } from '../types/betslip.types';

interface QuickStakeChipsProps {
  activeValue?: number;
  onSelect: (amount: number) => void;
}

export const QuickStakeChips = memo(function QuickStakeChips({
  activeValue,
  onSelect,
}: QuickStakeChipsProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {QUICK_STAKES.map((amount) => {
        const isActive = activeValue === amount;
        return (
          <TouchableOpacity
            key={amount}
            onPress={() => onSelect(amount)}
            activeOpacity={0.75}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.secondary : colors.surfaceElevated,
                borderColor: isActive ? colors.secondary : colors.border,
              },
            ]}
          >
            <AppText
              variant="labelSm"
              color={isActive ? colors.textOnSecondary : colors.textSecondary}
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
  },
  chip: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
  },
});
