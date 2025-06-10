import { logoutAdmin } from '@/services/Admin/Auth';
import { logoutUser } from '@/services/User/Auth';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, message } from 'antd';
import React from 'react';
import { useHistory } from 'umi';
import NotificationDropdown from './NotificationDropdown';
import './index.less';

// ✅ Import context để lấy avatar người dùng
import { useUser } from '@/contexts/UserContext';

const Navbar: React.FC = () => {
	const history = useHistory();
	const user = useUser();

	const handleLogout = async () => {
		const role = localStorage.getItem('role');
		try {
			if (role === 'admin') {
				await logoutAdmin();
			} else if (role === 'user') {
				await logoutUser();
			}
		} catch (error) {
			console.error('Lỗi đăng xuất:', error);
		} finally {
			localStorage.removeItem('token');
			localStorage.removeItem('role');
			message.success('Đăng xuất thành công!');
			history.push('/auth/login');
		}
	};

	const handleMenuClick = ({ key }: { key: string }) => {
		if (key === 'logout') handleLogout();
		if (key === 'profile') history.push('/user/profile');
		if (key === 'setting') history.push('/auth/change-password');
	};

	const menu = (
		<Menu className='navbar-menu' onClick={handleMenuClick}>
			<Menu.Item key='setting' icon={<SettingOutlined />}>
				Đổi mật khẩu
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key='logout' icon={<LogoutOutlined />}>
				Đăng xuất
			</Menu.Item>
		</Menu>
	);

	return (
		<div className='navbar'>
			<div className='navbar-right'>
				<NotificationDropdown />
				<Dropdown overlay={menu} placement='bottomRight'>
					<Avatar
						src={user?.avatar} // ✅ Ưu tiên avatar người dùng nếu có
						icon={!user?.avatar && <UserOutlined />}
						className='navbar-avatar'
					/>
				</Dropdown>
			</div>
		</div>
	);
};

export default Navbar;
