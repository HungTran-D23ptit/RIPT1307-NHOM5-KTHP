import { extend } from 'umi-request';

const request = extend({
	prefix: process.env.REACT_APP_API_BASE_URL || 'https://borrowease-back-end.onrender.com',
	timeout: 10000,
});

// Add request interceptors
request.interceptors.request.use((url, options) => {
	const token = localStorage.getItem('token'); // Lấy token từ localStorage
	const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
	return {
		url,
		options: { ...options, headers: { ...options.headers, ...authHeader } },
	};
});

// Add response interceptors
request.interceptors.response.use(async (response) => {
	if (response.status === 401) {
		// Xử lý lỗi xác thực, ví dụ: redirect về trang login
		console.error('Authentication failed');
		// window.location.href = '/auth/login'; // Ví dụ redirect
	}
	return response;
});

export default request;
