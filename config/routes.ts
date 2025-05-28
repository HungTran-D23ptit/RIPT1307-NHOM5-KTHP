export default [
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
				path: '/auth',
				redirect: '/auth/login',
			},
		],
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/admin/devices',
		name: 'Quản lý thiết bị',
		component: './Admin/Device',
		icon: 'LaptopOutlined',
	},

	// {
	// 	path: '/gioi-thieu',
	// 	name: 'About',
	// 	component: './TienIch/GioiThieu',
	// 	hideInMenu: true,
	// },

	// {
	// 	path: '/notification',
	// 	routes: [
	// 		{
	// 			path: './subscribe',
	// 			exact: true,
	// 			component: './ThongBao/Subscribe',
	// 		},
	// 		{
	// 			path: './check',
	// 			exact: true,
	// 			component: './ThongBao/Check',
	// 		},
	// 		{
	// 			path: './',
	// 			exact: true,
	// 			component: './ThongBao/NotifOneSignal',
	// 		},
	// 	],
	// 	layout: false,
	// 	hideInMenu: true,
	// },
	// {
	// 	path: '/',
	// 	redirect: '/landing',
	// },
	// {
	// 	path: '/403',
	// 	component: './exception/403/403Page',
	// 	layout: false,
	// },
	// {
	// 	path: '/hold-on',
	// 	component: './exception/DangCapNhat',
	// 	layout: false,
	// },
	// {
	// 	component: './exception/404',
	// },
];
