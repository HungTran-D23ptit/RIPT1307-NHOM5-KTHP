import { useState, useEffect } from 'react';
import { RecommendedDevice } from '@/services/User/Home/typing';
import HomeService from '@/services/User/Home/HomeService';

export const useEquipmentRecommendations = () => {
  const [recommendations, setRecommendations] = useState<RecommendedDevice[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await HomeService.getRecommendedDevices();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, []);

  return {
    recommendations
  };
}; 