import React from 'react';
import { useUser } from '@/hooks/user/useUser';
import ActiveAuctions from '@/components/activeAuctions/ActiveAuctions';
import Watchlist from './components/watchlist/Watchlist';
import styles from './css/BuyPage.module.css';

const BuyPage = () => {
  const { currentUser } = useUser();

  return (
    <div className={styles.app}>
      {currentUser && currentUser.user_type == 'customer' && (
        <div className={styles.customerFlex}>
          <Watchlist />
          <ActiveAuctions />
        </div>
      )}

      {currentUser && currentUser.user_type == 'admin' && (
        <p>Admin page</p>
      )}
    </div>
  );
};

export default BuyPage;
