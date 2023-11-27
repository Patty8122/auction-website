import { useState, useEffect } from 'react';
import { auctionService } from '@/services/auctionService';

const useGetAuctionById = (id) => {
  const [auction, setAuction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await auctionService.getAuctionById(id);
        setAuction(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  return { auction, isLoading, error };
};

export default useGetAuctionById;
