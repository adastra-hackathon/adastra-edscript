import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import type { BetslipOddsOptions } from '../types/betslip.types';

interface BetslipOptionsProps {
  options: BetslipOddsOptions;
  onChange: (options: Partial<BetslipOddsOptions>) => void;
}

export const BetslipOptions = memo(function BetslipOptions({
  options,
  onChange,
}: BetslipOptionsProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <OptionRow
        label="Aceitar todas as alterações de odds"
        checked={options.acceptAnyOddsChange}
        onToggle={() => onChange({ acceptAnyOddsChange: !options.acceptAnyOddsChange, acceptOnlyHigherOdds: false })}
        colors={colors}
      />
      <OptionRow
        label="Aceitar apenas odds mais altas"
        checked={options.acceptOnlyHigherOdds}
        onToggle={() => onChange({ acceptOnlyHigherOdds: !options.acceptOnlyHigherOdds, acceptAnyOddsChange: false })}
        colors={colors}
      />
    </View>
  );
});

interface OptionRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  colors: ReturnType<typeof useAppTheme>['colors'];
}

const OptionRow = memo(function OptionRow({ label, checked, onToggle, colors }: OptionRowProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.75}
      style={styles.row}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? colors.secondary : 'transparent',
            borderColor: checked ? colors.secondary : colors.border,
          },
        ]}
      >
        {checked && (
          <AppText variant="caption" color={colors.textOnSecondary}>
            ✓
          </AppText>
        )}
      </View>
      <AppText variant="bodyMd" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.xs,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
});
