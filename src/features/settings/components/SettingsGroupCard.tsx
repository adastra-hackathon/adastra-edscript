import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { borderRadius } from '../../../core/theme';

interface Props {
  children: React.ReactNode;
}

/**
 * Container visual para um grupo de itens de configurações.
 * Puramente apresentacional — sem lógica.
 */
export const SettingsGroupCard = memo(function SettingsGroupCard({ children }: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
