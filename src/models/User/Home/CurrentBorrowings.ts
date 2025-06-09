import { useState, useEffect } from 'react';
import HomeService from '@/services/User/Home/HomeService';
import { CurrentBorrowing } from '@/services/User/Home/typing';

export const useCurrentBorrowings = () => {
  const [borrowings, setBorrowings] = useState<CurrentBorrowing[]>([]);

  const fetchBorrowings = async () => {
    try {
      const data = await HomeService.getCurrentBorrowings();
      setBorrowings(data);
    } catch (error) {
      console.error('Error fetching current borrowings:', error);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  return {
    borrowings,
    fetchBorrowings
  };
}; 