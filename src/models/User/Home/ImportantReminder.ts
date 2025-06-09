import { useState, useEffect } from 'react';
import HomeService from '@/services/User/Home/HomeService';
import { ImportantReminder } from '@/services/User/Home/typing';

export const useImportantReminder = () => {
  const [reminders, setReminders] = useState<ImportantReminder[]>([]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await HomeService.getImportantReminders();
        setReminders(data);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };

    fetchReminders();
  }, []);

  return {
    reminders
  };
}; 