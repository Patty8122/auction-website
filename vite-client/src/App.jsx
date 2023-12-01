import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserProvider from "./hooks/user/useUser";
import './App.css';
import TestPage from './TestPage';
import LoginPage from './LoginPage';
import BuyPage from "./BuyPage";
import SellerPage from "./SellerPage";
import ExplorePage from "./ExplorePage";
import ProfilePage from "./ProfilePage";
import Navbar from './components/navbar/Navbar';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';

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
              <ExplorePage />
            </>
          } />
          <Route path="/buy" element={
            <>
              <Navbar />
              <BuyPage />
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
              <ProfilePage />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
