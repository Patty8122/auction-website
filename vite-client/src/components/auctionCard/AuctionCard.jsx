import React, { useEffect, useState } from 'react';
import usePlaceBid from '@/hooks/auction/usePlaceBid';
import { Button, Card } from '@/components/ui';
import styles from './AuctionCard.module.css';

const AuctionCard = ({ auction }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const { placeBid } = usePlaceBid();

  const handleBidSubmit = async () => {
    const bidValue = parseInt(bidAmount, 10);
    if (!isNaN(bidValue) && bidValue > 0) {
      const bidData = {
        userId: 5,
        bidAmount: bidValue,
      }

      try {
        await placeBid(auction.id, bidData);
        alert('Bid placed successfully');
        setBidAmount('');
      } catch (error) {
        alert(`Error placing bid: ${error.message}`);
      }
    } else {
      alert('Please enter a valid bid amount');
    }
  };

  const onPurchase = (auctionId) => {
    alert(`Purchase auction ${auctionId}`);
  }

  const onRemove = (auctionId) => {
    alert(`Remove auction ${auctionId}`);
  }

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

  return (
    <Card>
      <div className={styles.auctionInfo}>
        <p><strong>ID:</strong> {auction.id}</p>
        <p><strong>Current Bid:</strong> ${auction.current_bid}</p>
      </div>
      <div className={styles.bidSection}>
        <input 
          className={styles.bidInput}
          type="number" 
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)} 
          placeholder="Enter bid"
        />
        <Button className={styles.bidButton} onClick={handleBidSubmit}>Bid</Button>
      </div>
      <div className={styles.actionButtons}>
        <Button onClick={() => onPurchase(auction.id)}>Purchase</Button>
        <Button onClick={() => onRemove(auction.id)}>Remove</Button>
      </div>
      <div className={styles.timeLeft}>
        <p>{timeLeft}</p>
      </div>
    </Card>
  );
  
};

export default AuctionCard;
