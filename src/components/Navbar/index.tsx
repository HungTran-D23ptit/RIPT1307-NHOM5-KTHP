import React from 'react';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Menu, message } from 'antd';
import { useHistory } from 'umi';
// import NotificationDropdown from '@/components/RightContent/NoticeIcon';
import './index.less';
import { logoutAdmin } from '@/services/Admin/Auth';
import { logoutUser } from '@/services/User/Auth';

const Navbar: React.FC = () => {
  const history = useHistory();

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
    <Menu className="navbar-menu" onClick={handleMenuClick}>
      <Menu.Item key="profile">Hồ sơ</Menu.Item>
      <Menu.Item key="setting">Cài đặt</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <div className="navbar-right">
        {/* <NotificationDropdown /> */}
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar icon={<UserOutlined />} className="navbar-avatar" />
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
