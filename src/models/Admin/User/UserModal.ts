import { activateUser, deleteUser } from '@/services/Admin/User';
import type { UseUserModalReturn } from '@/services/Admin/User/frontendTyping';
import type { UserDataType } from '@/services/Admin/User/typing';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export const useUserModal = (onSuccess: () => void): UseUserModalReturn => {
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<UserDataType | null>(null);
	const [editStatus, setEditStatus] = useState<string>('');

	const handleEditClick = useCallback((record: UserDataType) => {
		setSelectedUser(record);
		setEditStatus(record.status);
		setModalVisible(true);
	}, []);

	const handleModalOk = useCallback(async () => {
		if (selectedUser) {
			try {
				if (editStatus === 'ACTIVE') {
					await activateUser(selectedUser._id);
				} else if (editStatus === 'DE_ACTIVE') {
					await deleteUser(selectedUser._id);
				}
				message.success('Cập nhật trạng thái người dùng thành công');
				setModalVisible(false);
				setSelectedUser(null);
				onSuccess();
			} catch (error: any) {
				message.error(error.response?.data?.message || 'Cập nhật trạng thái người dùng thất bại');
			}
		}
	}, [selectedUser, editStatus, onSuccess]);

	const handleModalCancel = useCallback(() => {
		setModalVisible(false);
		setSelectedUser(null);
		setEditStatus('');
	}, []);

	return {
		modalVisible,
		selectedUser,
		editStatus,
		setEditStatus,
		handleEditClick,
		handleModalOk,
		handleModalCancel,
	};
};
