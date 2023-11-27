import { useState, useEffect } from 'react';
import { auctionService } from '@/services/auctionService';

const useGetAuctions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuctions = async () => {
    setIsLoading(true);
    try {
      const data = await auctionService.getAuctions();
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return { getAuctions };
};

export default useGetAuctions;
