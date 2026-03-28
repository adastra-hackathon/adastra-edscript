import React, { memo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { AppText } from '../../../../components/ui/AppText';
import { LogoutIcon } from '../../../../components/icons/LogoutIcon';
import { useAppTheme } from '../../../../core/hooks/useAppTheme';
import { spacing } from '../../../../core/theme';

interface Props {
  onPress: () => void;
}

export const ProfileModalLogout = memo(function ProfileModalLogout({ onPress }: Props) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
    >
      <LogoutIcon size={20} color={colors.error} />
      <AppText variant="bodyMd" color={colors.error}>
        Sair
      </AppText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginBottom: spacing[2],
  },
});
