import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const options = {
        method: 'GET',
        url: 'https://ecommerce.markomedhat.com/api/categories?Page=1&Limit=20',
      };

      try {
        const { data } = await axios.request(options);
        return data.data.items || [];
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error('Failed to fetch categories');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
