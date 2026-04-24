import { getBorrowRequests } from '@/services/Admin/borrowRequest';
import { BorrowRequestParams, PaginationState, RejectedRequest } from '@/services/Admin/BorrowRequest/types';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useRejectedRequests = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<RejectedRequest[]>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		current: 1,
		pageSize: 10,
		total: 0,
	});

	const fetchData = async (page = 1, pageSize = 10) => {
		setLoading(true);
		try {
			const params: BorrowRequestParams = {
				status: 'REJECTED',
				page,
				per_page: pageSize,
			};
			const response = await getBorrowRequests(params);
			setData(response.data.data.requests);
			setPagination({
				current: response.data.data.page,
				pageSize: response.data.data.per_page,
				total: response.data.data.total,
			});
		} catch (error) {
			message.error('Không thể tải danh sách yêu cầu đã từ chối');
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
