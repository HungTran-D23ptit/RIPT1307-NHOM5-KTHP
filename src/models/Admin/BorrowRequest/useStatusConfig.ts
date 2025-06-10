export type BorrowRequestStatus =
	| 'PENDING'
	| 'APPROVED'
	| 'REJECTED'
	| 'CANCELLED'
	| 'RETURNING'
	| 'RETURNED'
	| 'OVERDUE';

export const useStatusConfig = () => {
	const statusConfig = {
		PENDING: { color: '#fff', text: 'Chờ duyệt', bgColor: '#f18c1a' },
		APPROVED: { color: '#fff', text: 'Đã duyệt', bgColor: '#1bb955' },
		REJECTED: { color: '#fff', text: 'Đã từ chối', bgColor: '#ef4444' },
		CANCELLED: { color: '#fff', text: 'Đã hủy', bgColor: '#6b7280' },
		RETURNING: { color: '#fff', text: 'Đang trả', bgColor: '#3b82f6' },
		RETURNED: { color: '#fff', text: 'Đã trả', bgColor: '#10b981' },
		OVERDUE: { color: '#fff', text: 'Quá hạn', bgColor: '#dc2626' },
	} as const;

	const getStatusTag = (status: string) => {
		const config = statusConfig[status as BorrowRequestStatus] || statusConfig.PENDING;
		return {
			backgroundColor: config.bgColor,
			color: '#fff',
			border: 'none',
			borderRadius: 12,
			padding: '2px 12px',
			height: 24,
			lineHeight: '20px',
			fontSize: 12,
			fontWeight: 500,
			text: config.text,
		};
	};

	return {
		statusConfig,
		getStatusTag,
	};
};
