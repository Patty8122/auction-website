import React, { useState } from 'react';
import { auctionService } from '@/services/auctionService';
import { userService } from '@/services/userService';
import './App.css';

function App() {
  const [responseAuction, setResponseAuction] = useState('');
  const [responseUser, setResponseUser] = useState('');

  const fetchTestAuction = async () => {
    const response = await auctionService.getTest(); // Fixed to auctionService
    setResponseAuction(response);
  }

  const fetchTestUser = async () => {
    const response = await userService.getTest(); // Fixed to userService
    setResponseUser(response);
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
    </div>
  );
}

export default App;
