import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { auctionService } from '@/services/auctionService';
import { useUser } from '@/hooks/user/useUser';
import AuctionCard from '@/components/auctionCard/AuctionCard';
import styles from './MyActiveAuctions.module.css';


const MyActiveAuctions = () => {
    const { currentUser } = useUser();
    const [activeAuctions, setActiveAuctions] = useState([]);
  
    // useEffect(() => {
    //   const socket = io('http://localhost:3003');
  
    //   socket.on('bidUpdate', (data) => {
    //     let { auctionId, bidAmount } = data;
    //     auctionId = parseInt(auctionId, 10);
  
    //     setActiveAuctions(currentAuctions =>
    //       currentAuctions.map(auction =>
    //         auction.id === auctionId ? { ...auction, current_bid: bidAmount } : auction
    //       )
    //     );
    //   });
  
    //   return () => {
    //     socket.disconnect();
    //   };
    // }, []);
  
    useEffect(() => {
      const fetchAuctions = async () => {
        if (currentUser) {
          try {
            const auctions = await auctionService.getAuctions(currentUser.user_id);
            for (let auction of auctions) {
              const winningBid = await auctionService.getCurrentBid(auction.id);
              console.log(winningBid);
              auction.current_bid = winningBid.bid_amount;
            }
  
            const enrichedAuctions = await auctionService.enrichAuctions(auctions);
            console.log(enrichedAuctions);
            setActiveAuctions(enrichedAuctions);
          } catch (error) {
            console.error('Error fetching auctions:', error);
            setActiveAuctions([]);
          }
        }
      };
  
      fetchAuctions();
    }, [currentUser]);
  
    return (
      <section className={styles.activeAuctions}>
        <h2>Active Auctions</h2>
        {activeAuctions.length > 0 ? (
          <div className={styles.auctionList}>
            {activeAuctions.map((item) => (
              <AuctionCard key={item.id} auction={item}/>
            ))}
          </div>
        ) : (
          <p>Once you list your items for auction, your auctions will show here!</p>
        )}
      </section>
    );
  };
  
  export default MyActiveAuctions;
  