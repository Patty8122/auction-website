import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { auctionService } from '@/services/auctionService';
import { useUser } from '@/hooks/user/useUser';
import AuctionCard from '@/components/auctionCard/AuctionCard';
import './css/HomePage.css';

const App = () => {
  const { currentUser, logout, isLoading: isUserLoading } = useUser();
  const [activeAuctions, setActiveAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      if (currentUser) {
        try {
          const auctions = await auctionService.getAuctionsByUserId(currentUser.id);
          setActiveAuctions(auctions);
        } catch (error) {
          console.error('Error fetching auctions:', error);
          setActiveAuctions([]);
        }
      }
    };

    fetchAuctions();
  }, [currentUser]);

  useEffect(() => {
    const socket = io('http://localhost:3003');

    /*
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    */

    socket.on('bidUpdate', (data) => {
      let { auctionId, bidAmount } = data;
      auctionId = parseInt(auctionId, 10);

      setActiveAuctions(currentAuctions =>
        currentAuctions.map(auction =>
          auction.id === auctionId ? { ...auction, current_bid: bidAmount } : auction
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const calculateTimeLeft = (endTime) => {
    const difference = +new Date(endTime) - +new Date();

    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return "00:00:00";
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAuctions(currentAuctions =>
        currentAuctions.map(auction => ({
          ...auction,
          timeLeft: calculateTimeLeft(auction.end_time)
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAuctions]);

  const handleLogout = () => {
    logout();
  };

  const handleAddItem = (itemName, initialBid) => {
    const newItem = { id: activeAuctions.length + 1, name: itemName, currentBid: initialBid };
    setActiveAuctions([...activeAuctions, newItem]);

    // TODO - Send new item to backend
  };

  const handleRemoveItem = (itemId) => {
    const updatedAuctions = activeAuctions.filter((item) => item.id !== itemId);
    setActiveAuctions(updatedAuctions);

    // TODO - Send item id to backend to remove item
  };

  // TODO - Send item id and new bid to backend

  const handlePurchase = (itemId) => {
    console.log(`Item ${itemId} purchased`);

    // TODO - Send item id to backend to purchase item
  };

  return (
    <div className="app">
      <header>
        <h1>Auction Service</h1>
        <div>
          {currentUser ? (
            <>
              <p>Hello, {currentUser.username}!</p>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={() => navigate('/login')}>Login</button>
          )}
        </div>
      </header>

      <section>
        <h2>Active Auctions</h2>
        {currentUser ? (
          activeAuctions && activeAuctions.length > 0 ? (
            <ul>
              {activeAuctions.map((item) => (
                <AuctionCard
                  key={item.id}
                  auction={item}
                  onPurchase={handlePurchase}
                  onRemove={handleRemoveItem}
                  timeLeft={item.timeLeft}
                />
              ))}
            </ul>
          ) : (
            <p>Once you place a bid, your auctions will show here!</p>
          )
        ) : (
          <p>Sign in to see your auctions!</p>
        )}
      </section>


      <section>
        <h2>Add Item</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const itemName = e.target.itemName.value;
            const initialBid = parseFloat(e.target.initialBid.value);
            handleAddItem(itemName, initialBid);
            e.target.reset();
          }}
        >
          <label htmlFor="itemName">Item Name:</label>
          <input type="text" id="itemName" required />
          <label htmlFor="initialBid">Starting Bid:</label>
          <input type="number" id="initialBid" required />
          <button type="submit">Add Item</button>
        </form>
      </section>
    </div>
  );
};

export default App;
