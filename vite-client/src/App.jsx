import React, { useState } from 'react';
import './App.css';

function App() {
  const [response, setResponse] = useState('');

  const testEndpoint = async () => {
    try {
      const res = await fetch(`/auction/test`);
      const data = await res.text();
      setResponse(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setResponse('Error fetching data');
    }
  };

  return (
    <div className="test-page">
      <h1>Test Client</h1>
      <button onClick={testEndpoint}>Test Endpoint</button>
      {response && <div className="response">{response}</div>}
    </div>
  );
}

export default App;
