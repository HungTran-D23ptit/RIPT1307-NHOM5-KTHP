export interface UserDataType {
	_id: string;
	name: string;
	email: string;
	phone: string;
	gender: string;
	dob: string;
	address: string;
	department: string;
}

export interface UseUserModalReturn {
	modalVisible: boolean;
	selectedUser: UserDataType | null;
	editStatus: string;
	setEditStatus: (status: string) => void;
	handleEditClick: (record: UserDataType) => void;
	handleModalOk: () => Promise<void>;
	handleModalCancel: () => void;
}

export interface UseUserDataProps {
	initialPage?: number;
	initialPageSize?: number;
	initialStatus?: string;
}

export interface UseUserDataReturn {
	filteredData: UserDataType[];
	loading: boolean;
	pagination: {
		current: number;
		pageSize: number;
		total: number;
	};
	selectedStatus: string;
	setPagination: (pagination: { current: number; pageSize: number; total: number }) => void;
	setSelectedStatus: (status: string) => void;
	fetchUsers: () => Promise<void>;
	onSearch: (value: string) => void;
}

export interface UserTableProps {
	data: UserDataType[];
	loading: boolean;
	pagination: {
		current: number;
		pageSize: number;
		total: number;
	};
	onPaginationChange: (current: number, pageSize: number) => void;
	onEditClick: (record: UserDataType) => void;
}

export interface UserModalProps {
	visible: boolean;
	selectedUser: UserDataType | null;
	editStatus: string;
	onOk: () => void;
	onCancel: () => void;
	onStatusChange: (value: string) => void;
}

export interface UserFiltersProps {
	searchValue: string;
	selectedStatus: string;
	onSearchChange: (value: string) => void;
	onStatusChange: (value: string) => void;
}
