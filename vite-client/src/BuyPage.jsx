import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/user/useUser';
import { Button } from '@/components/ui';
import ActiveAuctions from '@/components/activeAuctions/ActiveAuctions';
import AddItem from '@/components/addItem/AddItem';
import './css/HomePage.css';

const BuyPage = () => {
  const { currentUser, logout, isLoading: isUserLoading } = useUser();
  const [activeAuctions, setActiveAuctions] = useState([]);
  const navigate = useNavigate();

  const handleAddItem = (itemName, initialBid) => {
    const newItem = { id: activeAuctions.length + 1, name: itemName, currentBid: initialBid };
    setActiveAuctions([...activeAuctions, newItem]);

    // TODO - Send new item to backend
    // and move this logic to itemSection or some other component
  };

  return (
    <div className="app">
      <header>
        <h1>Auction Service</h1>
        <div>
          {currentUser ? (
            <>
              <p>Hello, {currentUser.username}!</p>
              <Button onClick={() => logout()}>Logout</Button>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </header>

      {currentUser && currentUser.user_type != 'customer' &&  (
        <>
          <ActiveAuctions />
          <AddItem handleAddItem={handleAddItem} />
        </>
      )}

      {currentUser && currentUser.user_id == 2 && (
        <p>Admin page</p>
      )}
    </div>
  );
};

export default BuyPage;
