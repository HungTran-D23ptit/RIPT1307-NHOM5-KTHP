import { getBorrowRequests } from '@/services/Admin/borrowRequest';

export interface ApprovedRequest {
	_id: string;
	user: { name: string };
	device: { name: string };
	quantity: number;
	borrow_date: string;
	return_date: string;
	status: string;
	createdAt: string;
}

export interface PaginationState {
	current: number;
	pageSize: number;
	total: number;
}

export interface ApprovedRequestsResponse {
	requests: ApprovedRequest[];
	page: number;
	per_page: number;
	total: number;
}

export const fetchApprovedRequests = async (page = 1, pageSize = 10): Promise<ApprovedRequestsResponse> => {
	const response = await getBorrowRequests({
		status: 'APPROVED',
		page,
		per_page: pageSize,
	});

	return {
		requests: response.data.requests,
		page: response.data.page,
		per_page: response.data.per_page,
		total: response.data.total,
	};
};
