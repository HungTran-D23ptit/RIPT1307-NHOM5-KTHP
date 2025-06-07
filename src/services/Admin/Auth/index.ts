import rootAPI from '../../rootAPI';
import type { LoginCredentials } from './tying';

export async function loginAdmin(credentials: LoginCredentials) {
	return rootAPI.post('/admin/auth/login', credentials);
}

export async function getMeAdmin() {
	return rootAPI.get('/admin/auth/me');
}

export async function logoutAdmin() {
	return rootAPI.post('/admin/auth/logout');
}
