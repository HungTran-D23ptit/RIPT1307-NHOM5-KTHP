import { getUsers } from '@/services/Admin/User';
import type { UseUserDataProps, UseUserDataReturn } from '@/services/Admin/User/frontendTyping';
import type { UserDataType } from '@/services/Admin/User/typing';
import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useUserData = ({
	initialPage = 1,
	initialPageSize = 10,
	initialStatus = 'all',
}: UseUserDataProps = {}): UseUserDataReturn => {
	const [userData, setUserData] = useState<UserDataType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const [pagination, setPagination] = useState({
		current: initialPage,
		pageSize: initialPageSize,
		total: 0,
	});
	const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);

	const fetchUsers = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getUsers();
			const { data } = response.data;
			const usersWithKey = data.map((item: any) => ({
				...item,
				key: item._id,
			}));
			setUserData(usersWithKey);
		} catch (error) {
			message.error('Lấy danh sách người dùng thất bại');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const filteredData = useMemo(() => {
		let result = userData;

		if (selectedStatus !== 'all') {
			result = result.filter((user) => user.status === selectedStatus);
		}

		if (searchValue) {
			const searchLower = searchValue.toLowerCase();
			result = result.filter(
				(user) =>
					user.name?.toLowerCase().includes(searchLower) ||
					user.email?.toLowerCase().includes(searchLower) ||
					user.phone?.toLowerCase().includes(searchLower) ||
					user.department?.toLowerCase().includes(searchLower),
			);
		}

		setPagination((prev) => ({
			...prev,
			total: result.length,
		}));

		return result;
	}, [userData, selectedStatus, searchValue]);

	const handleStatusChange = useCallback((status: string) => {
		setSelectedStatus(status);
		setPagination((prev) => ({ ...prev, current: 1 }));
	}, []);

	const handleSearch = useCallback((value: string) => {
		setSearchValue(value);
		setPagination((prev) => ({ ...prev, current: 1 }));
	}, []);

	return {
		filteredData,
		loading,
		pagination,
		selectedStatus,
		setPagination,
		setSelectedStatus: handleStatusChange,
		fetchUsers,
		onSearch: handleSearch,
	};
};
