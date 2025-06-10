import { approveBorrowRequest, getBorrowRequests } from '@/services/Admin/borrowRequest';
import { PaginationState, PendingRequest } from '@/services/Admin/BorrowRequest/types';
import { message, Modal } from 'antd';
import { useEffect, useState } from 'react';

export const usePendingRequests = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<PendingRequest[]>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		current: 1,
		pageSize: 10,
		total: 0,
	});

	const fetchData = async (page = 1, pageSize = 10) => {
		setLoading(true);
		try {
			const response = await getBorrowRequests({
				status: 'PENDING',
				page,
				per_page: pageSize,
			});

			const requests = response?.data?.requests || [];
			const total = response?.data?.total || 0;

			setData(requests);
			setPagination({
				...pagination,
				current: page,
				pageSize,
				total,
			});
		} catch (error) {
			message.error('Không thể tải danh sách yêu cầu mượn');
			setData([]);
		} finally {
			setLoading(false);
		}
	};

	const handleTableChange = (newPagination: any) => {
		fetchData(newPagination.current, newPagination.pageSize);
	};

	const handleApprove = (id: string) => {
		Modal.confirm({
			title: 'Xác nhận duyệt yêu cầu',
			content: 'Bạn có chắc chắn muốn duyệt yêu cầu mượn này không?',
			okText: 'Xác nhận',
			cancelText: 'Đóng',
			onOk: async () => {
				setLoading(true);
				try {
					await approveBorrowRequest(id);
					message.success('Duyệt đơn mượn thành công');
					fetchData(pagination.current, pagination.pageSize);
				} catch (error: any) {
					message.error(error.response?.data?.message || 'Duyệt đơn mượn thất bại');
				} finally {
					setLoading(false);
				}
			},
		});
	};

	useEffect(() => {
		fetchData();
	}, []);

	return {
		loading,
		data,
		pagination,
		handleTableChange,
		handleApprove,
		fetchData,
	};
};
