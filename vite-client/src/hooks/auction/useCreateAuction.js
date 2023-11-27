import { useState } from 'react';
import { auctionService } from '@/services/auctionService';

const useCreateAuction = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAuction = async ({ title, description, startDateTime, endDateTime, startingPrice }) => {
    setLoading(true);
    setError(null);

    try {
      const auctionData = {
        itemId,
        sellerId,
        startDateTime,
        endDateTime,
        startingPrice,
        bidIncrement,
      };

      const data = await auctionService.createAuction(auctionData);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAuction, isLoading, error };
};

export default useCreateAuction;
