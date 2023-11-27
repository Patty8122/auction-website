import { useState } from 'react';
import { auctionService } from '@/services/auctionService';

const usePlaceBid = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeBid = async (auctionId, bidData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await auctionService.placeBid(auctionId, bidData);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error(`Error placing bid on auction ${auctionId}:`, error);
      setError(error);
      setIsLoading(false);
      throw error;
    }
  };

  return { placeBid, isLoading, error };
};

export default usePlaceBid;
