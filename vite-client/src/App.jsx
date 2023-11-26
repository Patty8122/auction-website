import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css';
import TestPage from './TestPage';
import LoginPage from './LoginPage';
import HomePage from "./HomePage";

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
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    
    </>
  );
}

export default App;
