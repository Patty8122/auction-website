import React, { useState } from 'react';
import { auctionService } from '@/services/auctionService';
import { userService } from '@/services/userService';
import { itemService } from '@/services/itemService';
import './App.css';

function App() {
  const [responseAuction, setResponseAuction] = useState('');
  const [responseUser, setResponseUser] = useState('');
  const [responseItem, setResponseItem] = useState('');

  const fetchTestAuction = async () => {
    const response = await auctionService.getTest(); // Fixed to auctionService
    setResponseAuction(response);
  }

  const fetchTestUser = async () => {
    console.log('fetchTestUser');
    const response = await userService.getTest(); // Fixed to userService
    setResponseUser(response);
  }

  const fetchTestItem = async () => {
    console.log('fetchTestItem');
    const response = await itemService.getTest(); // Fixed to userService
    setResponseItem(response);
  }

  return (
    <div className="test-page">
      <h1>Test Client</h1>
      <div className="service-container">
        <button onClick={fetchTestAuction}>Auction Endpoint</button>
        {responseAuction && <div className="response">{responseAuction}</div>}
      </div>
      <div className="service-container">
        <button onClick={fetchTestUser}>User Endpoint</button>
        {responseUser && <div className="response">{responseUser}</div>}
      </div>
      <div className="service-container">
        <button onClick={fetchTestItem}>Item Endpoint</button>
        {responseItem && <div className="response">{responseItem}</div>}
      </div>
    </div>
  );
}

export default App;
