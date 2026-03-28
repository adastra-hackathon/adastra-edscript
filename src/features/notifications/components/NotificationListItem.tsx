import React, { memo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import type { Notification, NotificationType } from '../types/notification.types';

interface Props {
  notification: Notification;
  onPress: (id: string) => void;
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}m atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { emoji: string; color: string }
> = {
  deposit:   { emoji: '💰', color: '#22c55e' },
  withdraw:  { emoji: '💸', color: '#f59e0b' },
  level:     { emoji: '⭐', color: '#a855f7' },
  promotion: { emoji: '🎁', color: '#3b82f6' },
  game:      { emoji: '🎰', color: '#ec4899' },
  system:    { emoji: '🔔', color: '#64748b' },
};

export const NotificationListItem = memo(function NotificationListItem({
  notification,
  onPress,
}: Props) {
  const { colors } = useAppTheme();
  const config = TYPE_CONFIG[notification.type];
  const isUnread = !notification.isRead;

  const handlePress = useCallback(() => {
    onPress(notification.id);
  }, [notification.id, onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: isUnread ? colors.surface : colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Tipo icon */}
      <View style={[styles.iconBox, { backgroundColor: config.color + '22' }]}>
        <AppText style={styles.emoji}>{config.emoji}</AppText>
      </View>

      {/* Conteúdo */}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <AppText
            variant="bodyMd"
            color={isUnread ? colors.textPrimary : colors.textSecondary}
            style={[styles.title, isUnread && styles.titleBold]}
            numberOfLines={1}
          >
            {notification.title}
          </AppText>
          <AppText variant="caption" color={colors.textTertiary} style={styles.time}>
            {formatRelativeTime(notification.createdAt)}
          </AppText>
        </View>
        <AppText
          variant="bodySm"
          color={isUnread ? colors.textSecondary : colors.textTertiary}
          numberOfLines={2}
          style={styles.description}
        >
          {notification.description}
        </AppText>
      </View>

      {/* Indicador não lido */}
      {isUnread && (
        <View style={[styles.unreadDot, { backgroundColor: colors.secondary }]} />
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing[3],
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  body: {
    flex: 1,
    gap: spacing[1],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  title: {
    flex: 1,
  },
  titleBold: {
    fontWeight: '700',
  },
  time: {
    flexShrink: 0,
  },
  description: {
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: spacing[2],
    flexShrink: 0,
  },
});
