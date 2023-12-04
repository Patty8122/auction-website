import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/user/useUser';
import SearchAuctions from '@/components/searchAuctions/SearchAuctions';
import SearchCard from './components/searchCard/SearchCard';
import { auctionService } from '@/services/auctionService';
import { itemService } from '@/services/itemService';
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
        const auctions = await auctionService.getAuctions();
        const enrichedAuctions = await auctionService.enrichAuctions(auctions);
        let filteredAuctions = enrichedAuctions;

        if (searchCriteria.itemName) {
          const matchingItems = await itemService.searchItems(searchCriteria.itemName);
          const matchingTitles = matchingItems.map(item => item.title);

          filteredAuctions = enrichedAuctions.filter(auction => 
            matchingTitles.includes(auction.item_title));
        }

        if (searchCriteria.category) {
          filteredAuctions = filteredAuctions.filter(auction =>
            auction.category.toLowerCase() === searchCriteria.category.toLowerCase());
        }

        setActiveAuctions(filteredAuctions);
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
