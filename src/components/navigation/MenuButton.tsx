import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { MenuIcon } from '../icons';
import { borderRadius, spacing } from '../../core/theme';

interface Props {
  onPress: () => void;
}

export const MenuButton = memo(function MenuButton({ onPress }: Props) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Abrir menu"
    >
      <MenuIcon size={20} color={colors.textPrimary} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
