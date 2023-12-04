import { Button, Card } from '@/components/ui';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '@/hooks/user/useUser';
import { itemService } from '@/services/itemService';
import Container from './Container';

import styles from './ItemCard.module.css';

const ItemCard = ({ item, category, ...props }) => {
    const { currentUser } = useUser();
    const [isDeleted, setIsDeleted] = useState(false);





    const onEdit = async (event, item) => {
        event.preventDefault(event);
        // "quantity": quantity,
        // "title": title,
        // "category_id": category_id,
        // "initial_bid_price": initialBidPrice,
        // "shipping_cost": shippingCost,
        // "seller_id": currentUser.user_id,
        // "photo_url1": image_url1,
        const { quantity, title, category_id, initial_bid_price, shipping_cost, photo_url1} = event.target;

        console.log("event.target", event.target);
        console.log("quantity", quantity.value);
        console.log("title", title.value);
        console.log("category_id", category_id.value);
        console.log("initial_bid_price", initial_bid_price.value);
        console.log("shipping_cost", shipping_cost.value);
        console.log("photo_url1", photo_url1.value);

        var updatedItem = {}
        if (quantity && quantity.value !== '') {
            updatedItem.quantity = parseInt(quantity.value);
            console.log("quantity.value", quantity.value);
            console.log("updatedItem.quantity", updatedItem.quantity);
        }

        if (title && title.value !== '') {
            updatedItem.title = title.value;
        }
        if (category_id && category_id.value !== '') {
            updatedItem.category_id = parseInt(category_id.value);
        }
        if (initial_bid_price && initial_bid_price.value !== '') {
            updatedItem.initial_bid_price = parseFloat(initial_bid_price.value);
        }
        if (shipping_cost && shipping_cost.value !== '') {
            updatedItem.shipping_cost = parseFloat(shipping_cost.value);
        }
        if (photo_url1 && photo_url1.value !== '') {
            updatedItem.photo_url1 = photo_url1.value;
        }

        console.log("updatedItem", updatedItem)
        toast.success(`Updated item ${item.id}`);   
        await itemService.editItem(updatedItem, item.id)

      };

    
    
    const onRemove = async (itemId) => {
        setIsDeleted(true); 
        await itemService.removeItem(itemId);
        toast.success(`Remove item ${itemId}`);
    }
    

    if (isDeleted) {
        return null; 
    }
    return (
        <Card>
        <div className={styles.itemCard}>
            <div className={styles.itemImage}>
                <img src={item.photo_url1} alt="item" />
            </div>
            <div className={styles.itemInfo}>
                <div className={styles.category}>
                    {category}
                </div>
                <div className={styles.itemtitle}>
                    {item.title}
                </div>
                <div className={styles.itemPrice}>
                    ${item.initial_bid_price}
                </div>


                { currentUser && currentUser.user_id && currentUser.user_id !== item.seller_id && (
                    <div>
                        <Button onClick={() => bid(item.id)}>Bid</Button>
                    </div>
                )}

                {currentUser && currentUser.user_id && currentUser.user_id === item.seller_id && 
                    (   
                        <div>
                        <Container triggerText={'Edit Item'} onSubmit={(event) => onEdit(event, item)} placeholders={item}/>
                        <Button onClick={() => onRemove(item.id)}>Remove</Button>
                        </div>
                    )}
            </div>
        </div>
    </Card>
  );

}


export default ItemCard;