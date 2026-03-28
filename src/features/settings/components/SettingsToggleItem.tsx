import React, { memo } from 'react';
import { View, Switch, StyleSheet, Platform } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../core/theme';

interface Props {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

/**
 * Linha de configuração com switch toggle.
 * Estado e callback vêm 100% de fora — sem lógica interna.
 */
export const SettingsToggleItem = memo(function SettingsToggleItem({
  icon,
  label,
  value,
  onToggle,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <View style={styles.iconSlot}>{icon}</View>
      <AppText variant="bodyMd" color={colors.textPrimary} style={styles.label}>
        {label}
      </AppText>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: Platform.OS === 'ios' ? undefined : '#374151',
          true: colors.secondary + '55',
        }}
        thumbColor={value ? colors.secondary : Platform.OS === 'android' ? '#9CA3AF' : undefined}
        ios_backgroundColor="#374151"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    minHeight: 52,
  },
  iconSlot: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  label: {
    flex: 1,
  },
});
