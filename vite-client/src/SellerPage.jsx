import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { itemService } from '@/services/itemService';
import { useUser } from '@/hooks/user/useUser';

import './css/HomePage.css';
import Container from './components/items/Container';

const App = () => {
  const { currentUser, logout, isLoading: isUserLoading } = useUser();
  const [items, setItems] = useState([]);
  const triggerText = 'Create Item';
  const onSubmit = (event) => {
    event.preventDefault(event);
    console.log(event.target.name.value);
    console.log(event.target.email.value);
  };
  const navigate = useNavigate();

const fetchItems = async () => {
    if (currentUser) {
    try {
        const myItems = await itemService.getMyItems(currentUser.id);
        setItems(myItems);
        console.log('myItems:', myItems);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
    }
};

const createItem = async () => {
  // display form to create item as modal
  // the form is a component
  // the form has a submit button

  


  




}

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
        <button onClick={() => fetchItems()}>Fetch Items</button>
        <Container triggerText={triggerText} onSubmit={onSubmit} />
    </div>
  );


};
export default App;
