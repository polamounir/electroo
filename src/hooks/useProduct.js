import { useState, useEffect } from 'react';
import { getProductById } from '../api/product';

export const useProduct = (id) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        const productData = await getProductById(id);
        setData(productData);
      } catch (err) {
        setIsError(true);
        setError(err.message || 'Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { data, isLoading, isError, error, refetch: () => fetchProduct() };
};