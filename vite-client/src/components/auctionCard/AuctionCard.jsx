import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '@/hooks/user/useUser';
import usePlaceBid from '@/hooks/auction/usePlaceBid';
import { Button, Card } from '@/components/ui';
import styles from './AuctionCard.module.css';

const AuctionCard = ({ auction }) => {
  const { currentUser } = useUser();
  const { placeBid } = usePlaceBid();
  const [bidAmount, setBidAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  const isBidValid = () => {
    const currentBid = parseInt(auction.current_bid, 10);
    const bidIncrement = parseInt(auction.bid_increment, 10);
    return bidAmount >= currentBid + bidIncrement;
  }

  const handleBidSubmit = async () => {
    if (isBidValid()) {
      const bidData = {
        userId: currentUser.user_id,
        bidAmount: parseInt(bidAmount, 10),
      }

      try {
        await placeBid(auction.id, bidData);
        toast.success('Bid placed successfully!');
        setBidAmount('');
      } catch (error) {
        toast.error('Error placing bid');
      }
    } else {
      toast.warn('Invalid bid amount');
    }
  };

  // Handle change in bid input
  const handleBidInputChange = (e) => {
    const inputVal = e.target.value;
    const parsedVal = parseInt(inputVal, 10);

    // Set state only if input is a number and non-negative
    if (!isNaN(parsedVal) && parsedVal >= 0) {
      setBidAmount(parsedVal);
    } else {
      setBidAmount(0);
    }
  };

  const onPurchase = (auctionId) => {
    toast.success(`Purchase auction ${auctionId}`);
  }

  const onRemove = (auctionId) => {
    toast.success(`Remove auction ${auctionId}`);
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
        <p><strong>{auction.id}</strong></p>
        <p className={styles.currentBid}><strong>Current Bid:</strong> ${auction.current_bid}</p>
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
