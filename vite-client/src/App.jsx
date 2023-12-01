import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserProvider from "./hooks/user/useUser";
import './App.css';
import TestPage from './TestPage';
import LoginPage from './LoginPage';
import HomePage from "./HomePage";
import SellerPage from "./SellerPage";
import Navbar from './components/navbar/Navbar';

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/cart" element={
            <>
              <Navbar />
              <TestPage />
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/explore" element={
            <>
              <Navbar />
              <HomePage />
            </>
          } />
          <Route path="/buy" element={
            <>
              <Navbar />
              <HomePage />
            </>
          } />
          <Route path="/sell" element={
            <>
              <Navbar />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navbar />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
