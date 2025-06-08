import { useState } from 'react';
import { message } from 'antd';
import { forgotPassword, resetPassword } from '@/services/User/Auth'; 

export default function useForgotResetPasswordModel() {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await forgotPassword({ email });
      message.success('Mã OTP đã được gửi vào email của bạn.');
      return true;
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Gửi mã OTP thất bại';
      message.error(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    setLoading(true);
    try {
      if (newPassword !== confirmPassword) {
        message.error('Xác nhận mật khẩu không khớp.');
        setLoading(false);
        return false;
      }
      await resetPassword({ email, otp, newPassword, confirmPassword });
      message.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      return true;
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Đổi mật khẩu thất bại';
      message.error(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleForgotPassword,
    handleResetPassword,
  };
}
