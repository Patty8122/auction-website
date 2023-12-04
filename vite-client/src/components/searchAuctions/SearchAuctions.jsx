import React from 'react';
import AuctionCard from '@/components/auctionCard/AuctionCard';
import styles from './SearchAuctions.module.css';

const SearchAuctions = ({ activeAuctions }) => {
  return (
    <section className={styles.activeAuctions}>
      {activeAuctions.length > 0 ? (
        <div className={styles.auctionList}>
          {activeAuctions.map((item) => (
            <AuctionCard key={item.id} auction={item}/>
          ))}
        </div>
      ) : (
        <p>No auctions meet your search criteria.</p>
      )}
    </section>
  );
};

export default SearchAuctions;

