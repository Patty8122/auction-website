import { useState, useEffect } from 'react';
import { auctionService } from '@/services/auctionService';

const useGetUserAuctions = (userId) => {
  const [userAuctions, setUserAuctions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      try {
        const data = await auctionService.getAuctionsByUserId(userId);
        setUserAuctions(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, [userId]);

  return { userAuctions, isLoading, error };
};

export default useGetUserAuctions;
