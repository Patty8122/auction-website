const API_URL = '/api';

// Utility functions for session storage management
const setSessionUser = (user) => {
  sessionStorage.setItem('user', JSON.stringify(user));
};

const getSessionUser = () => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const clearSessionUser = () => {
  sessionStorage.removeItem('user');
};

// API calls to ui-service
const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();

    // NB: This redundancy in user_info is from mediator adding another layer
    const user_info = data.user_info.user_info;
    console.log(user_info);
    const user_dict = {
      user_id: user_info.user_id,
      username: user_info.username,
      user_type: user_info.user_type,
      email: user_info.email,
    };

    setSessionUser(user_dict);
    return user_dict;
  } catch (error) {
    throw new Error(error.message);
  }
};


const logout = async () => {
  try {
    const user_dict = getSessionUser();
    if (!user_dict) {
      throw new Error('No user in session');
    }

    const { user_id } = user_dict;
    const response = await fetch(`${API_URL}/logout/${user_id}`, { method: 'POST' });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    clearSessionUser();
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};


const createUser = async (username, password, email) => {
  try {
    const response = await fetch(`${API_URL}/create_user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    // Logout should be handled by the caller, since
    // they will need to update state
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};


const suspendUser = async (user_id) => {
  try {
    const response = await fetch(`${API_URL}/suspend_user/${user_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      throw new Error('Suspension failed');
    }

    const data = await response.json();
    // if (data && data.user_id) {
    //   // Log the user in after successful registration
    //   return await login(username, password);
    // }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (user_id, status = null, email = null, seller_rating = null) => {
  try {
    const response = await fetch(`${API_URL}/update_user/${user_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, email, seller_rating }),
    });

    if (!response.ok) {
      throw new Error('Suspension failed');
    }

    const data = await response.json();
    // if (data && data.user_id) {
    //   // Log the user in after successful registration
    //   return await login(username, password);
    // }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUser = async (user_id) => {
  try {
    const response = await fetch(`${API_URL}/delete_user/${user_id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Deletion failed');
    }

    const data = await response.json();
    if (data.status === 'failed') {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const userService = {
  login,
  logout,
  createUser,
  suspendUser,
  updateUser,
  deleteUser,
  getSessionUser,
};