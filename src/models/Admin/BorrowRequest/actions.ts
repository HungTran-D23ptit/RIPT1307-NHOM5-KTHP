import { getBorrowRequests } from '@/services/Admin/borrowRequest';
import request from '@/utils/request';
import { message } from 'antd';
import { BorrowRequestActions, BorrowRequestState } from './index';

export const createBorrowRequestActions = (
	state: BorrowRequestState,
	setState: React.Dispatch<React.SetStateAction<BorrowRequestState>>,
): BorrowRequestActions => {
	const fetchData = async (page = 1, pageSize = 10) => {
		setState((prev) => ({ ...prev, loading: true }));
		try {
			const response = await getBorrowRequests({
				status: 'RETURNING',
				page,
				per_page: pageSize,
			});
			setState((prev) => ({
				...prev,
				data: response.data.requests,
				pagination: {
					current: response.data.page,
					pageSize: response.data.per_page,
					total: response.data.total,
				},
			}));
		} catch (error) {
			message.error('Không thể tải danh sách yêu cầu đang trả');
		} finally {
			setState((prev) => ({ ...prev, loading: false }));
		}
	};

	const handleTableChange = (pagination: any) => {
		fetchData(pagination.current, pagination.pageSize);
	};

	const handleConfirmReturn = async (id: string) => {
		try {
			await request(`/admin/borrow-requests/${id}/confirm-return`, {
				method: 'PATCH',
			});
			message.success('Xác nhận trả thiết bị thành công');
			fetchData(state.pagination.current, state.pagination.pageSize);
		} catch (error) {
			message.error('Xác nhận trả thiết bị thất bại');
		}
	};

	const handleViewDetail = (id: string) => {
		setState((prev) => ({
			...prev,
			detailRequestId: id,
			showDetailModal: true,
		}));
	};

	const handleCloseDetailModal = () => {
		setState((prev) => ({
			...prev,
			showDetailModal: false,
			detailRequestId: null,
		}));
		fetchData(state.pagination.current, state.pagination.pageSize);
	};

	return {
		fetchData,
		handleTableChange,
		handleConfirmReturn,
		handleViewDetail,
		handleCloseDetailModal,
	};
};
