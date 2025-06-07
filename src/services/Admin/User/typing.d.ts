export interface User {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	gender?: string;
	dob?: string;
	address?: string;
	department?: string;
	avatar?: string;
	status: 'active' | 'deactive';
	login_provider?: string;
	permissions?: string[];
	createdAt?: string;
	updatedAt?: string;
}

export interface UserCreateRequest {
	name: string;
	email: string;
	phone?: string;
	gender?: string;
	dob?: string;
	address?: string;
	department?: string;
	avatar?: File | string;
	password: string;
	login_provider?: string;
}

export interface UserUpdateRequest {
	name?: string;
	email?: string;
	phone?: string;
	gender?: string;
	dob?: string;
	address?: string;
	department?: string;
	avatar?: File | string;
	password?: string;
	login_provider?: string;
}

export interface UserStatistics {
	total: number;
	active: number;
	deActive: number;
}

export interface UserDataType {
	key: string;
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
}
