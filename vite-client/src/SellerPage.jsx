import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { itemService } from '@/services/itemService';
import { useUser } from '@/hooks/user/useUser';
//import './css/HomePage.css';

const App = () => {
  const { currentUser, logout, isLoading: isUserLoading } = useUser();
    const navigate = useNavigate();

const fetchAuctions = async () => {
    if (currentUser) {
    try {
        const myItems = await itemService.getMyItems(currentUser.id);
        console.log(myItems);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
    }
};

//   useEffect(() => {
//     const socket = io('http://localhost:3004');

//     socket.on('connect', () => {
//         console.log('Connected to socket');
//         }
//     );
    


//     return () => {
//       socket.disconnect();
//     };
//   }, []);


  return (
    <div>
      <h1>Home Page</h1>

        <button onClick={() => navigate('/login')}> Login </button>
        <button onClick={() => fetchAuctions()}>Fetch Auctions</button>
    </div>
  );


};
export default App;
