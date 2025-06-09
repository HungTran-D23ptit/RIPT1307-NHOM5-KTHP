import * as adminAPI from '@/services/Admin/Notification';
import type { Notification } from '@/services/Admin/Notification/typing';
import * as userAPI from '@/services/User/Notification';
import { useEffect, useState } from 'react';

export function useNotifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);

	// Lấy role 1 lần khi hook mount, nếu bạn có context auth thì nên lấy từ đó
	const [api, setApi] = useState<typeof adminAPI | typeof userAPI | null>(null);

	useEffect(() => {
		const role = localStorage.getItem('role');
		if (role === 'admin') setApi(adminAPI);
		else if (role === 'user') setApi(userAPI);
		else setApi(null);
	}, []);

	const fetchData = async () => {
		if (!api) return;
		setLoading(true);
		try {
			const [notiList, countRes] = await Promise.all([api.getNotifications(), api.getUnreadCount()]);
			setNotifications(notiList);
			setUnreadCount(countRes.count);
		} catch (err) {
			console.error('Lỗi khi lấy thông báo:', err);
		} finally {
			setLoading(false);
		}
	};

	const markAsRead = async (id: string) => {
		if (!api) return;
		try {
			await api.markNotificationAsRead(id);
			await fetchData();
		} catch (err) {
			console.error('Lỗi khi đánh dấu đã đọc:', err);
		}
	};

	const markAll = async () => {
		if (!api) return;
		try {
			await api.markAllNotificationsAsRead();
			await fetchData();
		} catch (err) {
			console.error('Lỗi khi đánh dấu tất cả đã đọc:', err);
		}
	};

	const deleteNotification = async (id: string) => {
		if (!api) return;
		try {
			await api.deleteNotification(id);
			await fetchData();
		} catch (err) {
			console.error('Lỗi khi xóa thông báo:', err);
		}
	};

	useEffect(() => {
		if (api) fetchData();
	}, [api]);

	return {
		notifications,
		unreadCount,
		loading,
		refetch: fetchData,
		markAsRead,
		markAll,
		deleteNotification,
	};
}
