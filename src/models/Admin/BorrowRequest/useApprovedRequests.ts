import { fetchApprovedRequests } from '@/services/Admin/BorrowRequest/approvedRequests';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { ApprovedRequest, PaginationState } from './types';

export const useApprovedRequests = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<ApprovedRequest[]>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		current: 1,
		pageSize: 10,
		total: 0,
	});

	const fetchData = async (page = 1, pageSize = 10) => {
		setLoading(true);
		try {
			const response = await fetchApprovedRequests(page, pageSize);
			setData(response.requests);
			setPagination({
				current: response.page,
				pageSize: response.per_page,
				total: response.total,
			});
		} catch (error) {
			message.error('Không thể tải danh sách yêu cầu đã duyệt');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleTableChange = (newPagination: any) => {
		fetchData(newPagination.current, newPagination.pageSize);
	};

	return {
		loading,
		data,
		pagination,
		handleTableChange,
	};
};
