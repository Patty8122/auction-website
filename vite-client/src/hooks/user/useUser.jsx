import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { userService } from '../../services/userService';

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in by looking for user_id in sessionStorage
  useEffect(() => {
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
      setCurrentUser({ id: userId });
    }
  }, []);

  const login = async (username, password) => {
    const data = await userService.login(username, password);
    setCurrentUser({ user_id: data.user_id, username: data.username });
  };

  const logout = async () => {
    await userService.logout();
    setCurrentUser(null);
  };

  const register = async (username, password, email) => {
    const data = await userService.createUser(username, password, email);
    setCurrentUser({ user_id: data.user_id, username: data.username, email: data.email });
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
