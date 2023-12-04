import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import styles from './SearchCard.module.css';

const SearchCard = ({ onSearch }) => {
  const [category, setCategory] = useState('');
  const [itemName, setItemName] = useState('');

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleCategorySearch = () => {
    onSearch({ category, itemName: '' });
  };

  const handleItemNameSearch = () => {
    onSearch({ itemName, category: '' });
  };

  return (
    <Card className={styles.searchCard}>
      <div className={styles.searchField}>
        <label htmlFor="category">Category:</label>
        <input 
          type="text" 
          id="category" 
          value={category} 
          onChange={handleCategoryChange} 
          className={styles.input} 
        />
        <Button onClick={handleCategorySearch}>Search by Category</Button>
      </div>
      <div className={styles.searchField}>
        <label htmlFor="itemName">Item Name:</label>
        <input 
          type="text" 
          id="itemName" 
          value={itemName} 
          onChange={handleItemNameChange} 
          className={styles.input} 
        />
        <Button onClick={handleItemNameSearch}>Search by Item Name</Button>
      </div>
    </Card>
  );
};

export default SearchCard;
