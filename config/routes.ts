export default [
	{
		path: '/',
		redirect: '/landing',
	},
	{
		path: '/landing',
		layout: false,
		component: './LandingPage',
	},
	{
		path: '/auth',
		layout: false,
		routes: [
			{
				path: '/auth/login',
				layout: false,
				name: 'login',
				component: './Auth/Login',
			},
			{
				path: '/auth/register',
				layout: false,
				name: 'register',
				component: './Auth/Register',
			},
			{
				path: '/auth/change-password',
				layout: true,
				name: 'change-password',
				component: './Auth/ChangePasswordPage',
			},
			{
				path: '/auth/forgot-password',
				layout: false,
				name: 'forgot-password',
				component: './Auth/ForgotResetPassword',
			},
			{
				path: '/auth',
				redirect: '/auth/login',
			},
		],
	},
	// Common routes (visible to both admin and user)
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	// Admin routes
	{
		path: '/admin/devices',
		name: 'Quản lý thiết bị',
		component: './Admin/Device',
		icon: 'LaptopOutlined',
	},
	{
		path: '/admin/borrow-requests',
		name: 'Quản lý yêu cầu mượn',
		component: './Admin/BorrowRequest',
		icon: 'FormOutlined',
	},
	{
		path: '/admin/users',
		name: 'Quản lý người dùng',
		component: './Admin/User',
		icon: 'TeamOutlined',
	},
	// User routes
	{
		path: '/user/dashboard',
		name: 'Trang chủ',
		component: './user/TrangChuUser',
		icon: 'HomeOutlined',
	},
	{
		path: '/user/devices',
		name: 'Thiết bị có sẵn',
		component: './user/ThietBi',
		icon: 'LaptopOutlined',
	},
	{
		path: '/user/devices/:id',
		component: './user/ThietBi/Detail',
		layout: true,
	},
	{
		path: '/user/devices/:id/borrow-requests',
		component: './user/ThietBi/BorrowRequest',
		layout: true,
	},
	{
		path: '/user/borrow-requests',
		name: 'Yêu cầu mượn của tôi',
		component: './user/YeuCauMuon',
		icon: 'FormOutlined',
	},
	{
		path: '/user/borrowed-history',
		name: 'Lịch sử mượn thiết bị',
		component: './user/LichSuMuon',
		icon: 'HistoryOutlined',
	},
	{
		path: '/user/profile',
		name: 'Trang cá nhân',
		component: './user/Profile',
		icon: 'UserOutlined',
	},
	
];
