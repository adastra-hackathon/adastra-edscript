import { renderHook, act } from '@testing-library/react-native';
import { useNotifications } from '../features/notifications/hooks/useNotifications';

describe('useNotifications', () => {
  describe('initial state', () => {
    it('loads mock notifications on mount', () => {
      const { result } = renderHook(() => useNotifications());
      expect(result.current.notifications.length).toBeGreaterThan(0);
    });

    it('starts with filter = "all"', () => {
      const { result } = renderHook(() => useNotifications());
      expect(result.current.filter).toBe('all');
    });

    it('isLoading is false initially', () => {
      const { result } = renderHook(() => useNotifications());
      expect(result.current.isLoading).toBe(false);
    });

    it('unreadCount reflects the number of unread notifications', () => {
      const { result } = renderHook(() => useNotifications());
      const manualCount = result.current.notifications.filter(n => !n.isRead).length;
      expect(result.current.unreadCount).toBe(manualCount);
    });
  });

  describe('setFilter', () => {
    it('switches filter to "unread" and returns only unread notifications', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.setFilter('unread');
      });

      expect(result.current.filter).toBe('unread');
      result.current.notifications.forEach(n => {
        expect(n.isRead).toBe(false);
      });
    });

    it('switching back to "all" returns all notifications', () => {
      const { result } = renderHook(() => useNotifications());
      const totalCount = result.current.notifications.length;

      act(() => {
        result.current.setFilter('unread');
      });

      act(() => {
        result.current.setFilter('all');
      });

      expect(result.current.filter).toBe('all');
      expect(result.current.notifications.length).toBe(totalCount);
    });

    it('unread filter returns fewer or equal items than all filter', () => {
      const { result } = renderHook(() => useNotifications());
      const allCount = result.current.notifications.length;

      act(() => {
        result.current.setFilter('unread');
      });

      expect(result.current.notifications.length).toBeLessThanOrEqual(allCount);
    });
  });

  describe('markAsRead', () => {
    it('marks a specific notification as read', () => {
      const { result } = renderHook(() => useNotifications());
      const unread = result.current.notifications.find(n => !n.isRead);
      if (!unread) return; // skip if all already read

      act(() => {
        result.current.markAsRead(unread.id);
      });

      const updated = result.current.notifications.find(n => n.id === unread.id);
      expect(updated?.isRead).toBe(true);
    });

    it('decreases unreadCount by 1', () => {
      const { result } = renderHook(() => useNotifications());
      const unread = result.current.notifications.find(n => !n.isRead);
      if (!unread) return;
      const before = result.current.unreadCount;

      act(() => {
        result.current.markAsRead(unread.id);
      });

      expect(result.current.unreadCount).toBe(before - 1);
    });

    it('does not affect already-read notifications', () => {
      const { result } = renderHook(() => useNotifications());
      const read = result.current.notifications.find(n => n.isRead);
      if (!read) return;
      const before = result.current.unreadCount;

      act(() => {
        result.current.markAsRead(read.id);
      });

      expect(result.current.unreadCount).toBe(before);
    });
  });

  describe('markAllAsRead', () => {
    it('marks all notifications as read', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.markAllAsRead();
      });

      result.current.notifications.forEach(n => {
        expect(n.isRead).toBe(true);
      });
    });

    it('sets unreadCount to 0', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.markAllAsRead();
      });

      expect(result.current.unreadCount).toBe(0);
    });

    it('unread filter returns empty list after markAllAsRead', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.markAllAsRead();
        result.current.setFilter('unread');
      });

      expect(result.current.notifications).toHaveLength(0);
    });
  });
});
