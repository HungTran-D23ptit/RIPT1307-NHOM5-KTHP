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
	const data = await response.clone().json().catch(() => null);
	
	if (response.status === 401) {
		console.error('Authentication failed');
		// localStorage.removeItem('token');
		// window.location.href = '/auth/login';
	}
	
	// Attach data to response object so it's accessible via .data
	// or just return the data directly? 
	// Standard umi-request with interceptor returning 'response' will make the call return that.
	// We want the call to return the body data to match Axios-like behavior used in services.
	if (data) {
		(response as any).data = data;
	}
	
	return response;
});

export default request;
