export interface PendingRequest {
	_id: string;
	user: { name: string };
	device: { name: string };
	quantity: number;
	borrow_date: string;
	return_date: string;
	status: string;
	createdAt: string;
}

export interface RejectedRequest {
	_id: string;
	user: { name: string };
	device: { name: string };
	quantity: number;
	borrow_date: string;
	return_date: string;
	status: string;
	createdAt: string;
	note?: string;
}

export interface PaginationState {
	current: number;
	pageSize: number;
	total: number;
}

export interface FetchBorrowRequestsParams {
	status: string;
	page: number;
	per_page: number;
}

export interface User {
	login_provider: string;
	_id: string;
	name: string;
	email: string;
	phone: string;
	gender: string;
	dob: string;
	address: string;
	department: string;
	avatar: string;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface Device {
	_id: string;
	name: string;
	code: string;
	type: string;
	description: string;
	image_url: string;
	quantity: number;
	status: string;
	is_available: boolean;
	last_borrowed_at: string | null;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface BorrowingDevice {
	_id: string;
	user: User;
	device: Device;
	quantity: number;
	reason: string;
	borrow_date: string;
	return_date: string;
	actual_return_date: string | null;
	status: string;
	note: string;
	createdAt: string;
	updatedAt: string;
}

export interface BorrowRequestResponse {
	status: number;
	success: boolean;
	message: string;
	data: {
		requests: RejectedRequest[];
		page: number;
		per_page: number;
		total: number;
	};
}

export interface AdminRequestDetailProps {
	requestId: string;
	onBack: () => void;
}

export interface BorrowRequestParams {
	status: string;
	page: number;
	per_page: number;
}
