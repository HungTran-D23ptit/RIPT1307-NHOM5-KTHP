import { getDevices } from '@/services/User/Device';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { DeviceState } from './types';
import { getDeviceTypeLabel, getStatusInfo } from './utils';

export const useDeviceManagement = () => {
	const [state, setState] = useState<DeviceState>({
		search: '',
		type: '',
		status: '',
		devices: [],
	});

	useEffect(() => {
		const fetchDevices = async () => {
			try {
				const params: any = {};
				if (state.search) params.search = state.search;
				if (state.type) params.type = state.type;
				if (state.status) params.status = state.status;

				const response = await getDevices(params);
				let filteredDevices = response.data.data;

				if (state.type) {
					filteredDevices = filteredDevices.filter((d) => d.type === state.type);
				}
				if (state.status) {
					filteredDevices = filteredDevices.filter((d) => d.status === state.status);
				}

				setState((prev) => ({ ...prev, devices: filteredDevices }));
			} catch (error) {
				console.error('Error fetching devices:', error);
				message.error('Không thể tải danh sách thiết bị');
			}
		};

		fetchDevices();
	}, [state.search, state.type, state.status]);

	const handleSearchChange = (value: string) => {
		setState((prev) => ({ ...prev, search: value }));
	};

	const handleTypeChange = (value: string) => {
		setState((prev) => ({ ...prev, type: value }));
	};

	const handleStatusChange = (value: string) => {
		setState((prev) => ({ ...prev, status: value }));
	};

	return {
		state,
		handleSearchChange,
		handleTypeChange,
		handleStatusChange,
		getStatusInfo,
		getDeviceTypeLabel,
	};
};
