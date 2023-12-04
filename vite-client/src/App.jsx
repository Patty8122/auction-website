import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<ProtectedRoute />} >
            <Route path="/cart" element={
              <>
                <Navbar />
                <TestPage />
              </>
            } />

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
                <SellerPage />
              </>
            } />
            <Route path="/profile" element={
              <>
                <Navbar />
                <ProfilePage />
              </>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </UserProvider>
  );
}

export default App;
