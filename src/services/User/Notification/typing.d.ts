// Định nghĩa raw data nhận từ API
export interface RawNotification {
  _id: string;
  title: string;
  message: string;
  is_read: boolean;
  createdAt: string;
}

// Định nghĩa sau khi đã map lại dùng trong frontend
export interface Notification {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// Định nghĩa kiểu dữ liệu trả về khi lấy danh sách
export interface GetNotificationResponse {
  notifications: RawNotification[];
  total: number;
  page: number;
  per_page: number;
}
