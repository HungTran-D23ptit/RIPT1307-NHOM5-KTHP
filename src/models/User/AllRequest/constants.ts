export const STATUS_CONFIG = {
    PENDING: { color: '#fff', text: 'Chờ duyệt', bgColor: '#f18c1a' },
    APPROVED: { color: '#fff', text: 'Đã duyệt', bgColor: '#1bb955' },
    REJECTED: { color: '#fff', text: 'Đã từ chối', bgColor: '#ef4444' },
    CANCELLED: { color: '#fff', text: 'Đã hủy', bgColor: '#6b7280' },
    RETURNING: { color: '#fff', text: 'Đang trả', bgColor: '#3b82f6' },
    RETURNED: { color: '#fff', text: 'Đã trả', bgColor: '#10b981' },
    OVERDUE: { color: '#fff', text: 'Quá hạn', bgColor: '#dc2626' },
} as const;

export const CONTACT_INFO = {
    title: 'Thiết bị quản lý phòng',
    address: 'Tầng 1, Tòa nhà chính',
    phone: '(024) 1234-5678',
    email: 'equipment@university.edu.vn',
    workingHours: {
        weekdays: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
        saturday: 'Thứ 7: 8:00 - 12:00'
    }
} as const; 