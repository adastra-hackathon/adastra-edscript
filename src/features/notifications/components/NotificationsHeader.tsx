import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../core/theme';

interface Props {
  unreadCount: number;
  onBack: () => void;
  onMarkAll: () => void;
}

/**
 * Header da tela de notificações.
 * Puramente apresentacional — callbacks vêm de fora.
 */
export const NotificationsHeader = memo(function NotificationsHeader({
  unreadCount,
  onBack,
  onMarkAll,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityLabel="Voltar">
        <AppText variant="h3" color={colors.textSecondary}>{'‹'}</AppText>
      </TouchableOpacity>

      <View style={styles.titleArea}>
        <AppText variant="h3" color={colors.textPrimary} style={styles.title}>
          Notificações
        </AppText>
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <AppText variant="caption" color="#000" style={styles.badgeText}>
              {unreadCount}
            </AppText>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={onMarkAll}
        style={styles.markAllBtn}
        disabled={unreadCount === 0}
      >
        <AppText
          variant="bodySm"
          color={unreadCount > 0 ? colors.secondary : colors.textTertiary}
        >
          Marcar todos
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    minWidth: 40,
    paddingRight: spacing[2],
  },
  titleArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    fontWeight: '700',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[1.5],
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  markAllBtn: {
    paddingLeft: spacing[2],
  },
});
