export interface DeviceResponse {
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

export interface GetDevicesResponse {
	total: number;
	page: number;
	per_page: number;
	data: DeviceResponse[];
}

export interface GetDevicesParams {
	page?: number;
	per_page?: number;
	search?: string;
	type?: string;
	status?: string;
}

export interface DeviceDetail {
	_id: string;
	name: string;
	code: string;
	type: string;
	status: 'NORMAL' | 'MAINTENANCE';
	quantity: number;
	description?: string;
	image_url?: string;
	avg_rating?: number;
	reviews?: {
		total: number;
		data: {
			_id: string;
			rating: number;
			comment: string;
			user?: {
				name: string;
				avatar?: string;
			};
		}[];
	};
}

export interface DeviceType {
	value: string;
	label: string;
}

export interface StatusInfo {
	status: string;
	statusClass: string;
	canBorrow: boolean;
}

export interface DeviceState {
	search: string;
	type: string;
	status: string;
	devices: DeviceResponse[];
}

export interface BorrowRequestForm {
	quantity: number;
	borrow_date: string;
	return_date: string;
	reason: string;
}

export interface BorrowRequestState {
	device: DeviceResponse | null;
	quantity: number;
	borrowDate: any;
	returnDate: any;
	reason: string;
	loading: boolean;
}
