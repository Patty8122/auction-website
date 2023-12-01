import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/user/useUser';
import { Button, Card } from '@/components/ui';
import './css/LoginPage.css';

const LoginPage = () => {
  /*
   * isLogin: true if the user is logging in, false if the user is signing up
   * username: the username entered by the user
   * password: the password entered by the user
   * error: error message to display to the user
   */
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      try {
        await login(username, password);

        // Success
        navigate('/buy');
      } catch (err) {
        setError(err.message || 'Failed to login');
      }
    } else {
      // Sign-up logic
      try {
        await register(username, password, email);

        // Success
        navigate('/buy');
      } catch (err) {
        setError(err.message || 'Failed to register');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />


        {!isLogin &&
          <>
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        }

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />


        <Button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
        </Button>

        <Button type="submit">{isLogin ? 'Login' : 'Sign Up'}</Button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LoginPage;
