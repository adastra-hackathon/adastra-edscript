import React, { memo } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from '../ui/AppText';
import { BellIcon, GearIcon } from '../icons';
import { borderRadius, spacing } from '../../core/theme';

interface User {
  name?: string;
  avatar?: string;
  balance?: string;
}

interface Props {
  user: User;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  onProfilePress?: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const UserSection = memo(function UserSection({
  user,
  onNotificationPress,
  onSettingsPress,
  onProfilePress,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Avatar + info */}
      <TouchableOpacity
        onPress={onProfilePress}
        style={styles.profileArea}
        activeOpacity={0.7}
      >
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarCircle, { backgroundColor: colors.secondary }]}>
            <AppText variant="labelMd" style={{ color: colors.textOnSecondary }}>
              {user.name ? getInitials(user.name) : '?'}
            </AppText>
          </View>
        )}

        <View style={styles.userInfo}>
          {user.name && (
            <AppText variant="labelMd" color={colors.textPrimary} numberOfLines={1}>
              {user.name}
            </AppText>
          )}
          {user.balance && (
            <AppText variant="caption" color={colors.secondary} numberOfLines={1}>
              {user.balance}
            </AppText>
          )}
        </View>
      </TouchableOpacity>

      {/* Quick actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={[styles.actionBtn, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          accessibilityLabel="Notificações"
        >
          <BellIcon size={18} color={colors.iconPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSettingsPress}
          style={[styles.actionBtn, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          accessibilityLabel="Configurações"
        >
          <GearIcon size={18} color={colors.iconPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
  },
  userInfo: {
    maxWidth: 100,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[1.5],
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
