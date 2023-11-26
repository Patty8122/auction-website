import React, { useState } from 'react';
import './css/HomePage.css';

const App = () => {
  const [user, setUser] = useState('rachit');
  const [activeAuctions, setActiveAuctions] = useState([
    { id: 1, name: 'Item 1', currentBid: 20 },
    { id: 2, name: 'Item 2', currentBid: 30 },
  ]);

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleAddItem = (itemName, initialBid) => {
    const newItem = { id: activeAuctions.length + 1, name: itemName, currentBid: initialBid };
    setActiveAuctions([...activeAuctions, newItem]);

	// TODO - Send new item to backend
  };

  const handleRemoveItem = (itemId) => {
    const updatedAuctions = activeAuctions.filter((item) => item.id !== itemId);
    setActiveAuctions(updatedAuctions);

	// TODO - Send item id to backend to remove item
  };

  const handleBid = (itemId, newBid) => {
    const updatedAuctions = activeAuctions.map((item) => {
      if (item.id === itemId) {
        return { ...item, currentBid: newBid };
      }
      return item;
    });
    setActiveAuctions(updatedAuctions);

	// TODO - Send item id and new bid to backend
  };

  const handlePurchase = (itemId) => {
    console.log(`Item ${itemId} purchased`);

	// TODO - Send item id to backend to purchase item
  };

  return (
    <div className="app">
      <header>
        <h1>Auction Service</h1>
		<div>
			<p>Hello, {user}!</p>
			<button onClick={handleLogout}>Logout</button>
		</div>
      </header>

      <section>
        <h2>Active Auctions</h2>
        <ul>
          {activeAuctions.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span>Current Bid: ${item.currentBid}</span>
				{/* Set a new bid here in handleBid(). I was not sure about the logic, so used this now */}
              <button onClick={() => handleBid(item.id, item.currentBid + 5)}>Bid</button>
              <button onClick={() => handlePurchase(item.id)}>Purchase</button>
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Add Item</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const itemName = e.target.itemName.value;
            const initialBid = parseFloat(e.target.initialBid.value);
            handleAddItem(itemName, initialBid);
            e.target.reset();
          }}
        >
          <label htmlFor="itemName">Item Name:</label>
          <input type="text" id="itemName" required />
          <label htmlFor="initialBid">Starting Bid:</label>
          <input type="number" id="initialBid" required />
          <button type="submit">Add Item</button>
        </form>
      </section>
    </div>
  );
};

export default App;
