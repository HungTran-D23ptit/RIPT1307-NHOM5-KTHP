import { DeviceTableItem, getBorrowedDevices } from '@/services/Admin/Device/device';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useBorrowedDevices = (searchText: string, deviceType: string, deviceStatus: string) => {
	const [data, setData] = useState<DeviceTableItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await getBorrowedDevices({
				search: searchText,
				type: deviceType === 'all' ? undefined : deviceType,
				status: deviceStatus === 'all' ? undefined : deviceStatus,
				page,
				per_page: 10,
			});
			setData(response.data.data.borrowings);
			setTotal(response.data.data.total);
		} catch (error) {
			message.error('Không thể tải danh sách thiết bị đang mượn');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [searchText, deviceType, deviceStatus, page]);

	const getStatusTag = (status: string) => {
		let color = 'blue';
		let text = 'Đang mượn';

		if (status === 'RETURNED') {
			color = 'green';
			text = 'Đã trả';
		} else if (status === 'LATE') {
			color = 'red';
			text = 'Trả trễ';
		}

		return { color, text };
	};

	return {
		data,
		loading,
		page,
		total,
		setPage,
		getStatusTag,
	};
};
