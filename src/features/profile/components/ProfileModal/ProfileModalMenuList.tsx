import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../../core/hooks/useAppTheme';
import { spacing } from '../../../../core/theme';
import { ProfileModalMenuItem } from './ProfileModalMenuItem';
import type { ProfileMenuAction } from '../../types/profile.types';

interface Props {
  actions: ProfileMenuAction[];
}

export const ProfileModalMenuList = memo(function ProfileModalMenuList({ actions }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
      {actions.map((action) => (
        <ProfileModalMenuItem
          key={action.id}
          label={action.label}
          icon={action.icon}
          onPress={action.onPress}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: spacing[2],
  },
});
