import type { UserModalProps } from '@/services/Admin/User/frontendTyping';
import { Descriptions, Modal, Select } from 'antd';
import dayjs from 'dayjs';

const UserModal: React.FC<UserModalProps> = ({ visible, selectedUser, editStatus, onOk, onCancel, onStatusChange }) => {
	if (!selectedUser) return null;

	return (
		<Modal
			title='Chỉnh sửa thông tin người dùng'
			open={visible}
			onOk={onOk}
			onCancel={onCancel}
			okText='Lưu'
			cancelText='Hủy'
		>
			<Descriptions column={1} bordered>
				<Descriptions.Item label='Họ tên'>{selectedUser.name}</Descriptions.Item>
				<Descriptions.Item label='Email'>{selectedUser.email}</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>{selectedUser.phone}</Descriptions.Item>
				<Descriptions.Item label='Giới tính'>
					{selectedUser.gender === 'male' ? 'Nam' : selectedUser.gender === 'female' ? 'Nữ' : 'Khác'}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>{dayjs(selectedUser.dob).format('DD/MM/YYYY')}</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ'>{selectedUser.address}</Descriptions.Item>
				<Descriptions.Item label='Khoa/Ngành'>{selectedUser.department}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					<Select
						value={editStatus}
						onChange={onStatusChange}
						style={{ width: '100%' }}
						options={[
							{ value: 'ACTIVE', label: 'Đang hoạt động' },
							{ value: 'DE_ACTIVE', label: 'Ngưng hoạt động' },
						]}
					/>
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default UserModal;
