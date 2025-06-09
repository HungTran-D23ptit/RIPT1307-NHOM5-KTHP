import { useState, useEffect } from 'react';
import HomeService from '@/services/User/Home/HomeService';
import { BorrowingStats } from '@/services/User/Home/typing';

export const useStatsOverview = () => {
  const [stats, setStats] = useState<BorrowingStats>({
    totalBorrowed: 0,
    totalReturned: 0,
    pendingApproval: 0,
    overdue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await HomeService.getBorrowingStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return {
    stats
  };
}; 