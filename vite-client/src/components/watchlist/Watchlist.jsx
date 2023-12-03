import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '@/components/ui';
import { toast } from 'react-toastify';
import styles from './Watchlist.module.css';
import { itemService } from '../../services/itemService';

const Watchlist = () => {
  const [inputValue, setInputValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [watchlist, setWatchlist] = useState([
    { category: 'Electronics', maxPrice: 100 },
    { category: 'Clothing', maxPrice: 50 }]);

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
    const filtered = categories
      .filter(category => category.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 4);
    setFilteredCategories(filtered);
  };

  const handleCreateNewCategory = async () => {
    const newCategory = document.getElementById('newCategory').value;
    if (!newCategory) {
      toast.warn('Please enter a category name');
      return;
    }
  
    try {
      await itemService.createCategory(newCategory);
      await fetchCategories(); // Fetch the updated list of categories
      toast.success('Category created successfully');
    } catch (error) {
      toast.error('Error creating category');
    }
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

    if (!inputValue || !document.getElementById('maxPrice').value) {
      toast.warn('Please fill out all fields');
      return;
    }

    const maxPrice = parseFloat(document.getElementById('maxPrice').value);

    // Wait for state update before checking category existence
    setTimeout(async () => {
      const categoryExists = categories.some(category => category.toLowerCase() === inputValue.toLowerCase());
      if (!categoryExists) {
        toast.error('Category not found');
        return;
      }

      // Category exists, add to watchlist
      const watchlistItem = { category: inputValue, maxPrice };
      setWatchlist([...watchlist, watchlistItem]);
      setInputValue('');
      document.getElementById('maxPrice').value = '';
      toast.success('Item added to watchlist');
    }, 0);
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
              className={styles.input}
            />
            {showDropdown && (
              <div className={styles.dropdown}>
                {filteredCategories.map((category, index) => (
                  <div key={index} className={styles.dropdownItem} onClick={() => setInputValue(category)}>
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
          <label htmlFor="maxPrice">Max Price:</label>
          <input type="number" id="maxPrice" className={styles.input} />
          <Button type="submit">Add to watchlist</Button>
        </form>
        <p>Don't see your category listed? Create a new one below.</p>
        <div className={styles.newCategoryContainer}>
          <input
            type="text"
            id="newCategory"
            placeholder="Enter new category"
            className={styles.input}
          />
          <Button onClick={handleCreateNewCategory}>Create</Button>
        </div>
      </Card>

      <Card className={styles.watchlistCard}>
        <h3>My Watchlist</h3>
        <p id={styles.notification}>You will be notified when an item matching one of these criteria is listed.</p>
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
