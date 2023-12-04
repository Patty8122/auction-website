import React from 'react';
import { useUser } from '@/hooks/user/useUser';
import ActiveAuctions from '@/components/activeAuctions/ActiveAuctions';
import SearchCard from './components/searchCard/SearchCard';
import styles from './css/ExplorePage.module.css';

const ExplorePage = () => {
  const { currentUser } = useUser();

  return (
    <div className={styles.app}>
      {currentUser && currentUser.user_type == 'customer' && (
        <div className={styles.exploreFlex}>
          <SearchCard />
          <ActiveAuctions />
        </div>
      )}

      {currentUser && currentUser.user_type == 'admin' && (
        <p>Admin page</p>
      )}
    </div>
  );
};

export default ExplorePage;
