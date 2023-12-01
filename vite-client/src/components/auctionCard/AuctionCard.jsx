import React, { useEffect, useState } from 'react';
import usePlaceBid from '@/hooks/auction/usePlaceBid';

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
    <li>
      <span>{auction.id}</span>
      <span>Current Bid: ${auction.current_bid}</span>
      <input 
        type="number" 
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)} 
        placeholder="Enter bid amount"
      />
      <button onClick={handleBidSubmit}>Bid</button>
      <button onClick={() => onPurchase(auction.id)}>Purchase</button>
      <button onClick={() => onRemove(auction.id)}>Remove</button>
      <p>{timeLeft}</p>
    </li>
  );
};

export default AuctionCard;
