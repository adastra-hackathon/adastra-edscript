import { useState, useCallback, useMemo } from 'react';
import type { Notification, NotificationFilter } from '../types/notification.types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'deposit',
    title: 'Depósito confirmado',
    description: 'Seu depósito de R$ 500,00 foi processado com sucesso.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: '2',
    type: 'level',
    title: 'Nível avançado!',
    description: 'Parabéns! Você alcançou o nível Prata.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Bônus disponível',
    description: 'Você ganhou um bônus de R$ 100,00. Jogue agora e aproveite!',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: '4',
    type: 'game',
    title: 'Jackpot próximo!',
    description: 'O jackpot de Fortune Tiger está em R$ 2.3M. Tente a sorte!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: '5',
    type: 'withdraw',
    title: 'Saque processado',
    description: 'Seu saque de R$ 1.200,00 foi enviado para sua conta bancária.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'Manutenção programada',
    description: 'O sistema estará em manutenção das 02h às 04h de amanhã.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
];

export interface UseNotificationsReturn {
  notifications: Notification[];
  filter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
}

/**
 * Gerencia lista de notificações e filtros.
 * Preparado para integração com API — substituir MOCK_NOTIFICATIONS por query real.
 */
export function useNotifications(): UseNotificationsReturn {
  const [items, setItems] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [isLoading] = useState(false);

  const unreadCount = useMemo(
    () => items.filter(n => !n.isRead).length,
    [items]
  );

  const notifications = useMemo(
    () => (filter === 'unread' ? items.filter(n => !n.isRead) : items),
    [items, filter]
  );

  const markAsRead = useCallback((id: string) => {
    setItems(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    // TODO: await notificationsApi.markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
    // TODO: await notificationsApi.markAllAsRead();
  }, []);

  return {
    notifications,
    filter,
    setFilter,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
  };
}
