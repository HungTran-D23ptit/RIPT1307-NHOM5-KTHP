import axios from '@/utils/axios';
import { API_URL } from '@/config/config';
import type Auth from './typing';

// API đăng ký tài khoản người dùng
export async function register(payload: Auth.User.RegisterPayload) {
  return axios.post<{ message: string }>(`${API_URL}/auth/user/register`, payload);
}

// API đăng nhập cho người dùng
export async function login(payload: Auth.User.LoginPayload) {
  return axios.post<Auth.User.LoginResponse>(`${API_URL}/auth/user/login`, payload);
}

// API lấy thông tin người dùng hiện tại
export async function getCurrentUser() {
  return axios.get<Auth.User.UserData>(`${API_URL}/auth/user/me`);
}

// API quên mật khẩu
export async function forgotPassword(email: string) {
  return axios.post<{ message: string }>(`${API_URL}/auth/user/forgot-password`, { email });
}

// API đổi mật khẩu
export async function resetPassword(payload: Auth.ResetPasswordPayload) {
  return axios.post<{ message: string }>(`${API_URL}/auth/user/reset-password`, payload);
}

// API đăng xuất
export async function logout() {
  return axios.post<{ message: string }>(`${API_URL}/auth/user/logout`);
}
