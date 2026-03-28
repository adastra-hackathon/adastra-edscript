import React, { memo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from '../ui/AppText';
import { borderRadius, spacing } from '../../core/theme';
import { Divider } from "../ui/Divider";

export interface MenuItemConfig {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
}

export const MenuItem = memo(function MenuItem({ label, icon, onPress, active }: MenuItemConfig) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: active ? colors.secondary : colors.surfaceElevated },
        ]}
      >
        {icon}
      </View>

      <AppText
        variant="labelLg"
        color={active ? colors.secondary : colors.textPrimary}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingVertical: spacing[2],
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
