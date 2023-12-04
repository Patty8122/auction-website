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
import AdminPage from "./AdminPage";
import Navbar from './components/navbar/Navbar';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <TestPage />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ExplorePage />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/buy"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <BuyPage />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SellerPage />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ProfilePage />
                </>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h1>404 - Page not found</h1>} />
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
