export type NotificationType =
  | 'deposit'
  | 'level'
  | 'withdraw'
  | 'system'
  | 'promotion'
  | 'game';

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  type: NotificationType;
}

export type NotificationFilter = 'all' | 'unread';
