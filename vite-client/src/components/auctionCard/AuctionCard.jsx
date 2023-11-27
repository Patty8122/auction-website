import React, { useState } from 'react';
import usePlaceBid from '@/hooks/auction/usePlaceBid';

const AuctionCard = ({ auction, onPurchase, onRemove, timeLeft }) => {
  const [bidAmount, setBidAmount] = useState('');
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
      <p>{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</p>
    </li>
  );
};

export default AuctionCard;
