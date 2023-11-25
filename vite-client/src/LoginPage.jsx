// Import necessary React modules
import React, { useState } from 'react';
import './css/LoginPage.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO: Send email and password to backend and change the page

    console.log('Email:', email);
    console.log('Password:', password);

    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
        </button>

        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>

        {isLogin && (
          <button type="button" onClick={() => console.log('Logging in as admin')}>
            Login as Admin
          </button>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
