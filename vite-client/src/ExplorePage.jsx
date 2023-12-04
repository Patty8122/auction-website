import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/user/useUser';
import SearchAuctions from '@/components/searchAuctions/SearchAuctions';
import SearchCard from './components/searchCard/SearchCard';
import { auctionService } from '@/services/auctionService';
import styles from './css/ExplorePage.module.css';

const ExplorePage = () => {
  const { currentUser } = useUser();
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({});
  // Example structure: { category: '', itemName: '' } 

  useEffect(() => {
    let intervalId;

    const fetchAuctions = async () => {
      try {
        const auctions = await auctionService.getAuctions(searchCriteria);
        const processedAuctions = [];

        for (let auction of auctions) {
          // Process for winning bid
          if (auction.winning_bid_id) {
            const winningBid = await auctionService.getCurrentBid(auction.id);
            auction.current_bid = winningBid.bid_amount;
          } else {
            auction.current_bid = 0;
          }
          processedAuctions.push(auction);
        }

        // Enrich auctions with additional details
        const enrichedAuctions = await auctionService.enrichAuctions(processedAuctions);
        setActiveAuctions(enrichedAuctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setActiveAuctions([]);
      }
    };

    if (currentUser) {
      fetchAuctions();
      intervalId = setInterval(fetchAuctions, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentUser, searchCriteria]);

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
  };

  return (
    <div className={styles.app}>
      {currentUser && currentUser.user_type === 'customer' && (
        <div className={styles.exploreFlex}>
          <SearchCard onSearch={handleSearch} />
          <SearchAuctions activeAuctions={activeAuctions} />
        </div>
      )}

      {currentUser && currentUser.user_type === 'admin' && (
        <p>Admin page</p>
      )}
    </div>
  );
};

export default ExplorePage;
