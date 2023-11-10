import React, { useState } from 'react';
import { auctionService } from '@/services/auctionService';
import './App.css';

function App() {
  const [response, setResponse] = useState('');

  const fetchTest = async () => {
    const response = await auctionService.getTest();
    setResponse(response);
  }

  return (
    <div className="test-page">
      <h1>Test Client</h1>
      <button onClick={fetchTest}>Test Endpoint</button>
      {response && <div className="response">{response}</div>}
    </div>
  );
}

export default App;
