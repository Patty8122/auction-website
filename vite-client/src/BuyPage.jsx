import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/user/useUser';
import { Button } from '@/components/ui';
import ActiveAuctions from '@/components/activeAuctions/ActiveAuctions';
import AddItem from '@/components/addItem/AddItem';
import Watchlist from './components/watchlist/Watchlist';
import styles from './css/BuyPage.module.css';

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
    <div className={styles.app}>
      {currentUser && currentUser.user_type == 'customer' && (
        <div className={styles.customerFlex}>
          <Watchlist />
          <ActiveAuctions />
        </div>
      )}

      {currentUser && currentUser.user_id == 1 && (
        <p>Admin page</p>
      )}
    </div>
  );
};

export default BuyPage;
