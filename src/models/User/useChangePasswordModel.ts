import { useState } from 'react';
import { message } from 'antd';
import { changePassword } from '@/services/User/Auth';
import { ChangePasswordRequest } from '@/services/User/typing';

export default function useChangePasswordModel() {
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    setLoading(true);
    try {
      await changePassword(data);
      message.success('Đổi mật khẩu thành công');
      return true;
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Đổi mật khẩu thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleChangePassword,
  };
}
