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
