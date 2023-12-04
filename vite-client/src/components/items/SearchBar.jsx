import React, { useEffect, useState } from 'react';
import { itemService } from '@/services/itemService';
import { useUser } from '@/hooks/user/useUser';
import styles from './MyItems.module.css';

import { Button, Card } from '@/components/ui';
import ItemCard from '@/components/items/ItemCard';



const SearchBar = () => {

    const [searchInput, setSearchInput] = useState("");
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const { currentUser } = useUser();

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };
  

    const searchItems = async (searchInput) => {
        if (searchInput.length > 0) {
            const items = await itemService.searchItems(searchInput);
            setItems(items);
        } 

    }

    useEffect(() => {
        const fetchItems = async () => {
            if (currentUser) {
                try {
                    const categories = await itemService.getCategories();
                    setCategories(categories);
                } catch (error) {
                    console.error('Error fetching items:', error);
                    setCategories([]);
                }
            }
        };
    
        fetchItems();
    }, [currentUser]);

    const categoryName = (id) => {
        var currCategory = categories.find((category) => category.id === id);
        console.log("currCategory", currCategory);
        return currCategory
    }

    return <div className={styles.myItems}>
        <h2> Search for items of interest! </h2>

        <input
            type="search"
            placeholder="Search here"
            onChange={handleChange}
            value={searchInput} />

        <button onClick={() => searchItems(searchInput)}>Search</button>

        <h2> Search Results </h2>
        {items && items.map((item) => (
            <ItemCard key={item.id} item={item} category={categoryName(item.category_id)}/>
        ))}
           
    </div>    
    
}

  

export default SearchBar;