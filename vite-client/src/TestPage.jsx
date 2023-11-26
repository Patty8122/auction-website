import { userService } from '@/services/userService';
import { auctionService } from '@/services/auctionService';
import React from 'react';
import { useState } from 'react';

const TestPage = () => {

	const [responseAuction, setResponseAuction] = useState('');
	const [responseUser, setResponseUser] = useState('');

	const fetchTestAuction = async () => {
		const response = await auctionService.getTest();
		setResponseAuction(response);
	}

	const fetchTestUser = async () => {
		const response = await userService.getTest();
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

export default TestPage;