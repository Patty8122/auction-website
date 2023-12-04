import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { itemService } from '@/services/itemService';
import { useUser } from '@/hooks/user/useUser';
import ItemCard from '@/components/items/ItemCard';
import styles from './MyItems.module.css';


const MyItems = () => {
    const { currentUser } = useUser();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        // const intervalId = setInterval(() => {  //assign interval to a variable to clear it.

        const fetchItems = async () => {
        if (currentUser) {
            try {
            const items = await itemService.getItemsByUserId(currentUser.user_id);
            const categories = await itemService.getCategories();
            setItems(items);
            setCategories(categories);
            console.log("items", items);
            } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
            setCategories([]);
            }
        }
        };
    
        fetchItems();
        // }
        // , 10000);

        // return () => clearInterval(intervalId); //This is important

    }, [currentUser]);
    
    const categoryName = (id) => {
        var currCategory = categories.find((category) => category.id === id);
        console.log("currCategory", currCategory);
        return currCategory
    }

    return (
        <section>
        <h2>My Items</h2>
        {items.length > 0 ? (
            <div className={styles.myItems}>
            {items && categories && items.map((item) => (
                <ItemCard key={item.id} item={item} category={categoryName(item.category_id)}/>
            ))}
            </div>
        ) : (
            <p>Once you add an item, your items will show here!</p>
        )}
        </section>
    );
}


export default MyItems;
    