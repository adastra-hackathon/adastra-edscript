import React, { memo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { NotificationsHeader } from '../components/NotificationsHeader';
import { NotificationListItem } from '../components/NotificationListItem';
import { useNotifications } from '../hooks/useNotifications';
import type { Notification } from '../types/notification.types';

export const NotificationsScreen = memo(function NotificationsScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation();

  const { isAuthenticated } = useProtectedRoute({
    pendingRoute: { stack: 'App', screen: 'Notifications' },
  });

  const {
    notifications,
    filter,
    setFilter,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
  } = useNotifications();

  const handleItemPress = useCallback(
    (id: string) => {
      markAsRead(id);
    },
    [markAsRead]
  );

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationListItem notification={item} onPress={handleItemPress} />
    ),
    [handleItemPress]
  );

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <NotificationsHeader
        unreadCount={unreadCount}
        onBack={() => navigation.goBack()}
        onMarkAll={markAllAsRead}
      />

      {/* Filtros */}
      <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setFilter('all')}
          style={[
            styles.filterBtn,
            filter === 'all' && {
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
            },
            filter !== 'all' && { borderColor: colors.border },
          ]}
        >
          <AppText
            variant="bodySm"
            color={filter === 'all' ? '#000' : colors.textSecondary}
            style={styles.filterText}
          >
            Todos
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('unread')}
          style={[
            styles.filterBtn,
            filter === 'unread' && {
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
            },
            filter !== 'unread' && { borderColor: colors.border },
          ]}
        >
          <AppText
            variant="bodySm"
            color={filter === 'unread' ? '#000' : colors.textSecondary}
            style={styles.filterText}
          >
            Não lidos
          </AppText>
          {unreadCount > 0 && filter !== 'unread' && (
            <View style={[styles.filterBadge, { backgroundColor: colors.secondary }]}>
              <AppText variant="caption" color="#000" style={styles.filterBadgeText}>
                {unreadCount}
              </AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {isLoading ? (
        <ActivityIndicator
          color={colors.secondary}
          style={styles.loader}
          size="large"
        />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <AppText style={styles.emptyEmoji}>🔔</AppText>
              <AppText variant="bodyMd" color={colors.textSecondary} align="center">
                {filter === 'unread'
                  ? 'Nenhuma notificação não lida.'
                  : 'Nenhuma notificação ainda.'}
              </AppText>
            </View>
          }
          contentContainerStyle={notifications.length === 0 ? styles.emptyList : undefined}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  filterText: { fontWeight: '600' },
  filterBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[1],
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
  },
  loader: { flex: 1 },
  empty: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[10],
  },
  emptyEmoji: { fontSize: 40 },
  emptyList: { flex: 1 },
});
