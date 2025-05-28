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

];
