export interface MostBorrowedDevice {
	borrowCount: number;
	device_id: string;
	name: string;
	code: string;
	image_url: string;
}

export interface DeviceTotalStats {
	total: {
		total: number;
		NORMAL: number;
		MAINTENANCE: number;
	};
}

export interface DeviceTypeStats {
	type: string;
	count: number;
}

export interface DeviceStatusData {
	type: string;
	value: number;
}
