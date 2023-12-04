import React, { useEffect, useState } from 'react';
import { auctionService } from '@/services/auctionService';
import { useUser } from '@/hooks/user/useUser';
import AdminAuctionCard from '@/components/adminAuctionCard/AdminAuctionCard';
import styles from './AdminAuctions.module.css';

const AdminAuctions = () => {
  const { currentUser } = useUser();
  const [activeAuctions, setActiveAuctions] = useState([]);

  useEffect(() => {
    let intervalId;

    const fetchAuctions = async () => {
      if (currentUser) {
        try {
          const auctions = await auctionService.getAuctions();
          for (let auction of auctions) {
            auction.current_bid = 0;
            try {
              const winningBid = await auctionService.getCurrentBid(auction.id);
              auction.current_bid = winningBid.bid_amount;
            } catch (error) {
              console.log("couldn't fetch bid");
            }
          }
  
          const enrichedAuctions = await auctionService.enrichAuctions(auctions);
          setActiveAuctions(enrichedAuctions);
        } catch (error) {
          console.error('Error fetching auctions:', error);
          setActiveAuctions([]);
        }
      }
    };

    if (currentUser) {
      fetchAuctions();
      intervalId = setInterval(fetchAuctions, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentUser]);

  return (
    <section className={styles.activeAuctions}>
      <h2>Current Auctions</h2>
      {activeAuctions.length > 0 ? (
        <div className={styles.auctionList}>
          {activeAuctions.map((item) => (
            <AdminAuctionCard key={item.id} auction={item}/>
          ))}
        </div>
      ) : (
        <p>Once you place a bid, your auctions will show here!</p>
      )}
    </section>
  );
};

export default AdminAuctions;
