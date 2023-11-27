import { useState, useEffect } from 'react';
import { auctionService } from '@/services/auctionService';

const useGetAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      try {
        const data = await auctionService.getAuctions();
        setAuctions(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return { auctions, isLoading, error };
};

export default useGetAuctions;
