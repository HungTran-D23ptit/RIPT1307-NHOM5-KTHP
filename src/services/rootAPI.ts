import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://borrowease-back-end.onrender.com';

const rootAPI = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

rootAPI.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

rootAPI.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			const { status, data } = error.response;

			console.log('API Error:', {
				status,
				data,
				url: error.config.url,
				method: error.config.method,
				headers: error.config.headers,
			});

			if (data && typeof data === 'object') {
				if (data.status && data.message) {
					error.response.data = {
						...data,
						message: data.message,
					};
				} else if (data.email || data.password) {
					const errors = [];
					if (data.email) errors.push(`Email: ${data.email}`);
					if (data.password) errors.push(`Mật khẩu: ${data.password}`);
					error.response.data.message = errors.join('\n');
				}
			}
			if (!error.response.data.message) {
				error.response.data.message = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
			}

			console.log('Final error message:', error.response.data.message);
		}
		return Promise.reject(error);
	},
);

export default rootAPI;
