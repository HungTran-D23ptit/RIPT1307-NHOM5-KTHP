import { useNotifications } from '@/hooks/useNotifications';
import type { Notification } from '@/services/Admin/Notification/typing';
import { BellOutlined, CheckOutlined, DeleteOutlined, ReadOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Dropdown, List, message, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './NotificationDropdown.less';

const { Text } = Typography;

const formatNotificationContent = (content: string) => {
	const match = content.match(/\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b.*?\(.*?\)/);
	if (match) {
		const rawDate = match[0];
		const parsedDate = dayjs(new Date(rawDate));
		if (parsedDate.isValid()) {
			const formatted = parsedDate.locale('vi').format('HH:mm DD/MM/YYYY');
			return content.replace(rawDate, formatted);
		}
	}
	return content;
};

const NotificationDropdown = () => {
	const { notifications, unreadCount, loading, markAsRead, markAll, deleteNotification } = useNotifications();

	const handleMarkAll = async () => {
		try {
			await markAll();
			message.success('Đã đánh dấu tất cả là đã đọc');
		} catch {
			message.error('Không thể đánh dấu tất cả là đã đọc');
		}
	};

	const handleMarkAsRead = async (id: string) => {
		try {
			await markAsRead(id);
			message.success('Đã đánh dấu là đã đọc');
		} catch {
			message.error('Không thể đánh dấu là đã đọc');
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteNotification(id);
			message.success('Đã xóa thông báo');
		} catch {
			message.error('Không thể xóa thông báo');
		}
	};

	const menuContent = (
		<div className='notification-dropdown'>
			<div className='notification-header'>
				<Text strong>Thông báo</Text>
				{notifications.length > 0 && (
					<Button type='link' icon={<ReadOutlined />} onClick={handleMarkAll} size='small'>
						Đánh dấu tất cả đã đọc
					</Button>
				)}
			</div>

			<Divider style={{ margin: '8px 0' }} />

			{loading ? (
				<div className='notification-loading'>
					<Spin />
				</div>
			) : notifications.length === 0 ? (
				<div className='notification-empty'>
					<Text type='secondary'>Không có thông báo nào</Text>
				</div>
			) : (
				<List
					itemLayout='horizontal'
					dataSource={notifications}
					className='notification-list'
					renderItem={(item: Notification) => (
						<List.Item
							className={`notification-item ${item.isRead ? '' : 'unread'}`}
							actions={[
								!item.isRead && (
									<CheckOutlined
										key='mark'
										onClick={() => handleMarkAsRead(item.id)}
										title='Đánh dấu đã đọc'
										style={{ color: '#52c41a', cursor: 'pointer' }}
									/>
								),
								<DeleteOutlined
									key='delete'
									onClick={() => handleDelete(item.id)}
									title='Xóa thông báo'
									style={{ color: '#f5222d', cursor: 'pointer' }}
								/>,
							]}
						>
							<List.Item.Meta
								title={
									<span className='notification-title'>
										{item.title}
										{!item.isRead && <span className='dot' />}
									</span>
								}
								description={
									<>
										<div>{formatNotificationContent(item.content)}</div>
										<small style={{ color: '#999' }}>
											{dayjs(item.createdAt).locale('vi').format('HH:mm DD/MM/YYYY')}
										</small>
									</>
								}
							/>
						</List.Item>
					)}
				/>
			)}
		</div>
	);

	return (
		<Dropdown
			overlay={menuContent}
			trigger={['click']}
			placement='bottomRight'
			overlayClassName='notification-dropdown-overlay'
		>
			<Badge count={unreadCount} size='small' overflowCount={99}>
				<BellOutlined className='notification-icon' />
			</Badge>
		</Dropdown>
	);
};

export default NotificationDropdown;
