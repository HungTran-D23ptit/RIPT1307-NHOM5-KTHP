export interface DeviceType {
	label: string;
	value: string;
}

export interface DeviceFormData {
	name: string;
	code: string;
	description?: string;
	quantity: number;
	type: string;
	status?: string;
	image_url?: File;
}

export interface DeviceResponse {
	_id: string;
	name: string;
	code: string;
	description?: string;
	quantity: number;
	type: string;
	status: string;
	image_url?: string;
}

export interface AddDeviceModalProps {
	visible: boolean;
	onCancel: () => void;
	onSuccess: () => void;
}

export interface EditDeviceModalProps {
	visible: boolean;
	onCancel: () => void;
	onSuccess: () => void;
	initialData: DeviceResponse;
}

export interface AvailableDevicesProps {
	searchText: string;
	deviceType: string;
	deviceStatus: string;
	onSuccess?: () => void;
}

export interface BorrowedDevicesProps {
	searchText: string;
	deviceType: string;
	deviceStatus: string;
	onSuccess?: () => void;
}

export interface MaintenanceDevicesProps {
	searchText: string;
	deviceType: string;
	deviceStatus: string;
	onSuccess?: () => void;
}

export interface DeviceTableItem {
	_id: string;
	code: string;
	name: string;
	borrow_date: string;
	return_date: string;
	user: {
		name: string;
	};
	status: string;
}

export interface GetDevicesParams {
	status?: string;
	type?: string;
	search?: string;
	page?: number;
	per_page?: number;
}

export interface GetBorrowedDevicesParams {
	status?: string;
	type?: string;
	search?: string;
	page?: number;
	per_page?: number;
}

export interface GetMaintenanceDevicesParams {
	search?: string;
	type?: string;
	status?: string;
	page?: number;
	per_page?: number;
}

export interface UpdateDeviceData {
	name?: string;
	code?: string;
	description?: string;
	quantity?: number;
	type?: string;
	status?: string;
	image_url?: string | File;
	file?: File;
}
