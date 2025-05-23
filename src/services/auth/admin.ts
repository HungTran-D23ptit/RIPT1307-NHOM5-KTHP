import axios from '@/utils/axios';
import { API_URL } from '@/config/config';
import type Auth from './typing.d';

// API đăng ký tài khoản admin
export async function register(payload: Auth.Admin.RegisterPayload) {
  return axios.post<{ message: string }>(`${API_URL}/auth/admin/register`, payload);
}

// API đăng nhập cho admin
export async function login(payload: Auth.Admin.LoginPayload) {
  return axios.post<Auth.Admin.LoginResponse>(`${API_URL}/auth/admin/login`, payload);
}

// API lấy thông tin admin hiện tại
export async function getCurrentUser() {
  return axios.get<Auth.Admin.UserData>(`${API_URL}/auth/admin/me`);
}

// API quên mật khẩu
export async function forgotPassword(email: string) {
  return axios.post<{ message: string }>(`${API_URL}/auth/admin/forgot-password`, { email });
}

// API đổi mật khẩu
export async function resetPassword(payload: Auth.ResetPasswordPayload) {
  return axios.post<{ message: string }>(`${API_URL}/auth/admin/reset-password`, payload);
}

// API đăng xuất
export async function logout() {
  return axios.post<{ message: string }>(`${API_URL}/auth/admin/logout`);
}
