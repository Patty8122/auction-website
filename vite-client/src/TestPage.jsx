import React, { useState } from 'react';
import useCreateAuction from '@/hooks/auction/useCreateAuction';

const TestPage = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const { createAuction, isLoading, error } = useCreateAuction();

  const createTestAuction = async () => {
    setResponseMessage('');

    try {
      await createAuction({
        itemId: 1,
		sellerId: 1,
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        startingPrice: 100,
		bidIncrement: 10,
      });
      setResponseMessage('Success: Auction created');
    } catch (error) {
      console.error('Error creating test auction:', error);
      setResponseMessage('Error creating auction');
    }
  };

  return (
    <div className="test-page">
      <h1>Test Client</h1>
      <div className="service-container">
        <button onClick={createTestAuction} disabled={isLoading}>
          Create Test Auction
        </button>
        {isLoading && <p>Creating auction...</p>}
        {responseMessage && <div className="response"><pre>{responseMessage}</pre></div>}
        {error && <div className="error"><pre>Error: {error.message}</pre></div>}
      </div>
    </div>
  );
};

export default TestPage;
