import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Card } from '@/components/ui';
import { auctionService } from '@/services/auctionService';
import styles from './AdminAuctionCard.module.css';

const AdminAuctionCard = ({ auction }) => {
  const [bidAmount, setBidAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  const calculateTimeLeft = (endTime) => {
    const difference = +new Date(endTime) - +new Date();

    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return "BIDDING COMPLETE";
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft(auction.end_time);
      setTimeLeft(timeLeft);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });

  const onEndAuction = async (auctionId) => {
    try {
      await auctionService.endAuction(auctionId);
      toast.success('Auction ended successfully');
    } catch (error) {
      toast.error('Could not end auction');
    }
  }

  return (
    <Card className={styles.auctionCard}>
      <div className={styles.cardHeader}>
        <h3>{auction.item_title} ({auction.quantity})</h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.bidInfo}>
          <p className={styles.currentBid}>Current Bid: ${auction.current_bid}</p>
          <Button className={styles.endButton} onClick={() => onEndAuction(auction.id)}>End</Button>
          <div className={styles.timeLeft}>
            <p>{timeLeft}</p>
          </div>
        </div>
      </div>
    </Card>
  );

};

export default AdminAuctionCard;
