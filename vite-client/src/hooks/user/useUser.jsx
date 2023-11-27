import React, { createContext, useState, useEffect, useContext } from 'react';
import { userService } from '../../services/userService';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem('user_id');
    const username = sessionStorage.getItem('username');
    if (userId && username) {
      setCurrentUser({ id: userId, username: username });
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const user_info = await userService.login(username, password);
      if (user_info) {
        sessionStorage.setItem('user_id', user_info.user_id);
        sessionStorage.setItem('username', user_info.username);
        setCurrentUser({ id: user_info.user_id, username: user_info.username });
      }
    } catch (error) {
      console.error("Login failed: ", error.message);
      // Handle login error
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('username');
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed: ", error.message);
      // Handle logout error
    }
  };

  const register = async (username, password, email) => {
    try {
      await userService.createUser(username, password, email);
      // No need to set current user here since createUser calls login
    } catch (error) {
      console.error("Registration failed: ", error.message);
      // Handle registration error
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, isLoading, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
