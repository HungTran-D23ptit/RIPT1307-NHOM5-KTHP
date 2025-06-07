import rootAPI from '../../rootAPI';
import type { UserCreateRequest, UserUpdateRequest } from './typing';

const API_BASE = '/admin/users';

export async function getUsers(params: { page?: number; per_page?: number } = {}) {
	console.log('Calling getUsers API with params:', params);
	return rootAPI
		.get(API_BASE, { params })
		.then((response) => {
			console.log('getUsers API response:', response.data);
			return response;
		})
		.catch((error) => {
			console.error('getUsers API error:', error.response?.data || error.message);
			throw error;
		});
}

export async function getUserProfile(id: string) {
	return rootAPI.get(`${API_BASE}/${id}`);
}

export async function createUser(userData: UserCreateRequest) {
	return rootAPI.post(API_BASE, userData);
}

export async function updateUser(id: string, userData: UserUpdateRequest) {
	return rootAPI.put(`${API_BASE}/${id}`, userData);
}

export async function deleteUser(id: string) {
	return rootAPI.delete(`${API_BASE}/${id}`);
}

export async function activateUser(id: string) {
	return rootAPI.post(`${API_BASE}/${id}`);
}

export async function getUserStatistics() {
	return rootAPI.get(`${API_BASE}/statistic/total`);
}
