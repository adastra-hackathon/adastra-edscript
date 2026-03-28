import React, { memo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { AppText } from '../../../../components/ui/AppText';
import { useAppTheme } from '../../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../../core/theme';

interface Props {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export const ProfileModalMenuItem = memo(function ProfileModalMenuItem({
  label,
  icon,
  onPress,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
        {icon}
      </View>
      <AppText variant="bodyMd" color={colors.textPrimary} style={styles.label}>
        {label}
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
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
});
