import rootAPI from '../../rootAPI';
import { LoginCredentials, RegisterCredentials } from './typing';

export async function loginUser(credentials: LoginCredentials) {
	return rootAPI.post('/user/auth/login', credentials);
}

export async function registerUser(credentials: RegisterCredentials) {
	return rootAPI.post('/user/auth/register', credentials);
}

export async function getMeUser() {
	return rootAPI.get('/user/auth/me');
}

export async function logoutUser() {
	return rootAPI.post('/user/auth/logout');
}
