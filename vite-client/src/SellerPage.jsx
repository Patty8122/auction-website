import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '@/services/itemService';
import { useUser } from '@/hooks/user/useUser';
import Container from './components/items/Container';
import MyItems from './components/items/MyItems';
import SearchBar from './components/items/SearchBar';
import MyActiveAuctions from './components/items/MyActiveAuctions';

const App = () => {
  const { currentUser, logout, isLoading: isUserLoading } = useUser();
  
  const refreshPage = () => {
    window.location.reload();
  }

  const onSubmit = (event) => {
    event.preventDefault(event);
    if (event.target.title.value === '') {
      toast.error('Please enter a title');
      return;
    } else if (event.target.category_id.value === '') {
      toast.error('Please enter a category');
      return;
    } else if (event.target.shipping_cost.value === '') {
      toast.error('Please enter a shipping cost');
      return;
    } else if (event.target.quantity.value === '') {
      toast.error('Please enter a quantity');
      return;
    } else if (event.target.initial_bid_price.value === '') {
      toast.error('Please enter an initial bid price');
      return;
    } 
    const title = event.target.title.value;
    const category_id = event.target.category_id.value;
    const shippingCost = event.target.shipping_cost.value;
    const quantity = event.target.quantity.value;
    const initialBidPrice = event.target.initial_bid_price.value;
    // const photo_url1 = event.target.photo_url1.value;
    const photo_url1 = '';
    const item =  {
      "quantity": quantity,
      "title": title,
      "category_id": category_id,
      "initial_bid_price": initialBidPrice,
      "shipping_cost": shippingCost,
      "seller_id": currentUser.user_id,
      "photo_url1": photo_url1,
    }
    console.log("item", item);
    console.log("currentUser", currentUser);
    itemService.createItem(item, currentUser);
    refreshPage();
  };

  return (
    <div>
        {currentUser && currentUser.user_type == 'customer' && (
          <div >
            <div style={{margin: '2rem auto', width: 'fit-content'}}>
              <Container triggerText={'Create Item'} onSubmit={onSubmit} />
            </div>
            <MyItems />
            {/* <MyActiveAuctions /> */}
          </div>
        )}
    </div>
  );


};
export default App;