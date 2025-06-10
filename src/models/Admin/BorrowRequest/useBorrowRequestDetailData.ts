import {
	approveBorrowRequest,
	BorrowingDevice,
	confirmReturnDevice,
	getBorrowRequestDetail,
	rejectBorrowRequest,
} from '@/services/Admin/borrowRequest';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useBorrowRequestDetailData = (requestId: string) => {
	const [request, setRequest] = useState<BorrowingDevice | null>(null);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState(false);
	const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
	const [rejectReason, setRejectReason] = useState('');

	const fetchRequestDetail = async () => {
		try {
			const response = await getBorrowRequestDetail(requestId);
			if (response.success && response.data) {
				setRequest(response.data);
			} else {
				message.error(response.message || 'Lỗi khi tải thông tin chi tiết');
			}
		} catch (error: any) {
			message.error(error.response?.data?.message || 'Lỗi khi tải thông tin chi tiết');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (requestId) {
			fetchRequestDetail();
		}
	}, [requestId]);

	const handleApprove = async (onBack: () => void) => {
		setActionLoading(true);
		try {
			await approveBorrowRequest(requestId);
			message.success('Duyệt đơn mượn thành công');
			onBack();
		} catch (error: any) {
			message.error(error.response?.data?.message || 'Duyệt đơn mượn thất bại');
		} finally {
			setActionLoading(false);
		}
	};

	const handleReject = () => {
		setIsRejectModalVisible(true);
	};

	const handleRejectConfirm = async (onBack: () => void) => {
		if (!rejectReason) {
			message.error('Vui lòng nhập lý do từ chối');
			return;
		}
		setActionLoading(true);
		try {
			await rejectBorrowRequest(requestId, rejectReason);
			message.success('Từ chối đơn mượn thành công');
			setIsRejectModalVisible(false);
			setRejectReason('');
			onBack();
		} catch (error: any) {
			message.error(error.response?.data?.message || 'Từ chối đơn mượn thất bại');
		} finally {
			setActionLoading(false);
		}
	};

	const handleRejectCancel = () => {
		setIsRejectModalVisible(false);
		setRejectReason('');
	};

	const handleConfirmReturn = async (onBack: () => void) => {
		setActionLoading(true);
		try {
			await confirmReturnDevice(requestId);
			message.success('Xác nhận trả thiết bị thành công');
			onBack();
		} catch (error: any) {
			message.error(error.response?.data?.message || 'Xác nhận trả thiết bị thất bại');
		} finally {
			setActionLoading(false);
		}
	};

	return {
		request,
		loading,
		actionLoading,
		isRejectModalVisible,
		rejectReason,
		setRejectReason,
		fetchRequestDetail,
		handleApprove,
		handleReject,
		handleRejectConfirm,
		handleRejectCancel,
		handleConfirmReturn,
	};
};
