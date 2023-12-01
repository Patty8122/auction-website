import React from 'react';
import { Card, Button } from '@/components/ui';
import styles from './Watchlist.module.css';

const categories = ['Electronics', 'Books', 'Clothing', 'Sports', 'Art'];

const Watchlist = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const category = e.target.category.value;
    const maxPrice = parseFloat(e.target.maxPrice.value);
    console.log({ category, maxPrice });
    e.target.reset();
  };

  return (
    <Card className={styles.watchlistCard}>
      <form onSubmit={handleSubmit}>
        <h2>Watchlist</h2>
        <label htmlFor="category">Category:</label>
        <select id="category" required className={styles.input}>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>

        <label htmlFor="maxPrice">Max Price:</label>
        <input type="number" id="maxPrice" required className={styles.input} />

        <Button type="submit">Add to watchlist</Button>
      </form>
    </Card>
  );
};

export default Watchlist;
