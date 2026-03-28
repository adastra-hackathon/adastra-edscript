import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AppText } from '../../../../components/ui/AppText';
import { useAppTheme } from '../../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../../core/theme';

interface Props {
  initials: string;
  fullName: string;
  email: string;
  levelLabel: string;
  avatarUrl?: string;
}

export const ProfileModalHeader = memo(function ProfileModalHeader({
  initials,
  fullName,
  email,
  levelLabel,
  avatarUrl,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.secondary, borderColor: colors.secondary }]}>
          <AppText variant="h3" style={{ color: colors.textOnSecondary }}>
            {initials}
          </AppText>
        </View>
      )}

      <AppText variant="h3" color={colors.textPrimary} style={styles.name}>
        {fullName}
      </AppText>
      <AppText variant="bodyMd" color={colors.textSecondary}>
        {email}
      </AppText>
      <View style={[styles.badge, { backgroundColor: colors.surface, borderColor: colors.secondary }]}>
        <AppText variant="caption" color={colors.secondary}>
          {levelLabel}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[1],
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    marginBottom: spacing[2],
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  name: {
    marginTop: spacing[1],
  },
  badge: {
    marginTop: spacing[1.5],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
});
