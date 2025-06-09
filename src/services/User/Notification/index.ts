import rootAPI from '../../rootAPI';
import {
  Notification,
  RawNotification,
  GetNotificationResponse,
} from './typing';

// Lấy danh sách thông báo
export async function getNotifications(): Promise<Notification[]> {
  const res = await rootAPI.get<{ data: GetNotificationResponse }>('/user/notifications');
  const notificationsRaw: RawNotification[] = res.data.data?.notifications || [];

  return notificationsRaw.map((item) => ({
    id: item._id,
    title: item.title,
    content: item.message,
    isRead: item.is_read,
    createdAt: item.createdAt,
  }));
}

// Lấy số lượng thông báo chưa đọc
export async function getUnreadCount(): Promise<{ count: number }> {
  const res = await rootAPI.get<{ data: number }>('/user/notifications/unread-count');
  return { count: res.data.data };
}

// Đánh dấu một thông báo là đã đọc
export async function markNotificationAsRead(id: string) {
  return rootAPI.patch(`/user/notifications/${id}/read`);
}

// Đánh dấu tất cả thông báo là đã đọc
export async function markAllNotificationsAsRead() {
  return rootAPI.patch(`/user/notifications/mark-all-read`);
}

// Xóa một thông báo
export async function deleteNotification(id: string) {
  return rootAPI.delete(`/user/notifications/${id}`);
}
