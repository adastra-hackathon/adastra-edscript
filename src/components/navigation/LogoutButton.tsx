import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from '../ui/AppText';
import { LogoutIcon } from '../icons';
import { borderRadius, spacing } from '../../core/theme';

interface Props {
  label?: string;
  onPress: () => void;
}

export const LogoutButton = memo(function LogoutButton({
  label = 'Sair da conta',
  onPress,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.errorBackground }]}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <LogoutIcon size={20} color={colors.error} />
      <AppText variant="labelLg" color={colors.error}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
  },
});
