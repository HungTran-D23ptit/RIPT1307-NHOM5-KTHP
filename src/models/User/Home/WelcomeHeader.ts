import { useState, useEffect } from 'react';
import { getUserProfile } from '@/services/User/Profile';

export const useWelcomeHeader = () => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserProfile();
        if (response.data?.data?.name) {
          setUserName(response.data.data.name);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return {
    userName
  };
}; 