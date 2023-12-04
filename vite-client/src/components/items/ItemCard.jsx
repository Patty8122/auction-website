import { Button, Card } from '@/components/ui';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '@/hooks/user/useUser';
import { itemService } from '@/services/itemService';   
import { auctionService } from '@/services/auctionService';
import Container from './Container';
import ContainerBid from './ContainerBid';


import styles from './ItemCard.module.css';

const ItemCard = ({ item, category, ...props }) => {
    const { currentUser } = useUser();
    const [isDeleted, setIsDeleted] = useState(false);
    
    const convertToUTC = () => {
   
        // Convert the datetime to UTC string format
        const utcString = new Date().toUTCString();
    
        return utcString;
    }

    const onBid = async (event, itemId) => {
        event.preventDefault(event);
        // itemid: 'Item Id',
        // startDateTime: 'Start Date Time',
        // endDateTime: 'End Date Time',
        // startingPrice: 'Starting Price',
        // sellerId: 'Seller Id',
        // bidIncrement: 'Bid Increment',
        const {itemid, startDateTime, endDateTime, startingPrice, sellerId, bidIncrement} = event.target;
        console.log("event.target", event.target);
        console.log("itemid", itemid.value);
        console.log("startDateTime", startDateTime.value);
        console.log("endDateTime", endDateTime.value);
        console.log("startingPrice", startingPrice.value);
        console.log("sellerId", sellerId.value);
        console.log("bidIncrement", bidIncrement.value);

        var auction = {}
        if (itemid && itemid.value !== '') {
            auction.item_id = parseInt(itemid.value);
        }
        if (startDateTime && startDateTime.value !== '') {
            auction.start_date_time = startDateTime.value;
        }
        if (endDateTime && endDateTime.value !== '') {
            auction.end_date_time = endDateTime.value;
        }
        if (startingPrice && startingPrice.value !== '') {
            auction.starting_price = parseFloat(startingPrice.value);
        }
        if (sellerId && sellerId.value !== '') {
            auction.seller_id = parseInt(sellerId.value);
        }
        if (bidIncrement && bidIncrement.value !== '') {
            auction.bid_increment = parseFloat(bidIncrement.value);
        }

        console.log("auction", auction)
        toast.success(`Bid item ${itemId}`);
        // await itemService.bidItem(auction, itemId);
        // await auctionService.createAuction(auction, itemId);


    }


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
                        <ContainerBid triggerText={'Start Auction'} onSubmit={(event) => onBid(event, item.id)} placeholders={
                            {
                                itemid: item.id,
                                startDateTime: convertToUTC(),
                                endDateTime: convertToUTC(),
                                startingPrice: item.initial_bid_price,
                                sellerId: item.seller_id,
                                bidIncrement: 5,
                            }
                        }/>
                        <Button onClick={() => onRemove(item.id)}>Remove</Button>
                        </div>
                    )}
            </div>
        </div>
    </Card>
  );

}


export default ItemCard;