const API_URL = '/api';

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
    const user_info = data.user_info.user_info;
    console.log(user_info);
    console.log(user_info.user_id);
    console.log(user_info.username);
    if (user_info) {
      sessionStorage.setItem('user_id', user_info.user_id);
      sessionStorage.setItem('username', user_info.username);
    }
    return user_info;
  } catch (error) {
    throw new Error(error.message);
  }
};

const logout = async () => {
  const userId = sessionStorage.getItem('user_id');
  if (userId) {
    try {
      const response = await fetch(`${API_URL}/logout/${userId}`, { method: 'POST' });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      const data = await response.json();
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('username');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
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

    const data = await response.json();
    if (data && data.user_id) {
      // Log the user in after successful registration
      return await login(username, password);
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
};
