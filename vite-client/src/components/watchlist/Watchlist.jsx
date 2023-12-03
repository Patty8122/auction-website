import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '@/components/ui';
import { toast } from 'react-toastify';
import styles from './Watchlist.module.css';
import { itemService } from '../../services/itemService';

const Watchlist = () => {
  const [inputValue, setInputValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [createNewCategory, setCreateNewCategory] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [watchlist, setWatchlist] = useState([
    { category: 'Electronics', maxPrice: 100 },
    { category: 'Clothing', maxPrice: 50 }]);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await itemService.getCategories();
      setCategories(fetchedCategories);

      // Preload dropdown with first 4 categories
      setFilteredCategories(fetchedCategories.slice(0, 4));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setCreateNewCategory(false);
    const filtered = categories
      .filter(category => category.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 4);
    setFilteredCategories(filtered);
  };

  const handleCreateCategoryClick = (category) => {
    setInputValue(category);
    setCreateNewCategory(true);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    // Timeout to allow click event to register before hiding dropdown
    setTimeout(() => setShowDropdown(false), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (createNewCategory) {
      await itemService.createCategory(inputValue);
      fetchCategories();
    }
    console.log(`Category: ${inputValue}`);
    // Handle submission for existing category
  };

  return (
    <div className={styles.watchlist}>
      <h2>Watchlist</h2>
      <Card className={styles.watchlistCard}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="category">Category:</label>
          <div className={styles.inputContainer}>
            <input
              type="text"
              id="category"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete='off'
              required
              className={styles.input}
            />
            {showDropdown && (
              <div className={styles.dropdown}>
                {inputValue && (
                  <div className={styles.dropdownItem} onClick={() => handleCreateCategoryClick(inputValue)}>
                    Create category <b>{inputValue}</b>
                  </div>
                )}
                {filteredCategories.map((category, index) => (
                  <div key={index} className={styles.dropdownItem} onClick={() => setInputValue(category)}>
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
          <label htmlFor="maxPrice">Max Price:</label>
          <input type="number" id="maxPrice" required className={styles.input} />
          <Button type="submit">Add to watchlist</Button>
        </form>
      </Card>
      <Card className={styles.watchlistCard}>
        <h3>My Watchlist</h3>
        <div className={styles.watchlistItems}>
          {watchlist.length === 0 ? (
            <p>Add an item to your watchlist above and it will appear here.</p>
          ) : (
            watchlist.map((item, index) => (
              <div key={index} className={styles.watchlistItem}>
                <p>{item.category}</p>
                <p>&lt; ${item.maxPrice}</p>
              </div>
            ))
          )}
        </div>
      </Card>

    </div>
  );
};

export default Watchlist;
