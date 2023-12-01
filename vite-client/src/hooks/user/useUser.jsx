import React, { createContext, useState, useEffect, useContext } from 'react';
import { userService } from '../../services/userService';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user_dict = userService.getSessionUser();
    if (user_dict) {
      setCurrentUser(user_dict);
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const user_dict = await userService.login(username, password);
      if (user_dict) {
        setCurrentUser(user_dict);
      }
    } catch (error) {
      console.error("Login failed: ", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed: ", error.message);
    }
  };

  const register = async (username, password, email) => {
    try {
      // Create the user, then log them in
      const response = await userService.createUser(username, password, email);
      if (response && response.user_id) {
        await login(username, password);
      }
    } catch (error) {
      console.error("Registration failed: ", error.message);
      throw error;
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
