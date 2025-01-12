// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  // Basic states for user name, email, and password if you want a "real" login
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If you want to show/hide the "Real Login" fields
  const [showRealLogin, setShowRealLogin] = useState(false);

  // Handle "Play as Guest"
  const handlePlayAsGuest = async () => {
    if (!username.trim()) {
      // Basic validation to ensure a username is entered
      alert('Please enter a username before continuing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username }),
      });
      if (!response.ok) {
        throw new Error('Failed to create guest');
      }
      const data = await response.json();
      // data.playerId and data.name
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('playerName', data.name);

      // Navigate to the main page (WordInput)
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error creating guest player');
    }
  };

  // If you want a real "login" approach, you can do handleLogin() to /api/auth/login
  // The following is just a placeholder example:
  const handleRealLogin = async () => {
    alert('Real login not fully implemented in this example!');
    // Example flow might be:
    // 1. Validate email & password
    // 2. fetch('http://localhost:5000/api/auth/login', {method: 'POST', body: JSON.stringify({ email, password })});
    // 3. Store response in localStorage
    // 4. navigate('/');
  };

  // Toggle login form (if you want to show/hide real login fields)
  const toggleRealLogin = () => {
    setShowRealLogin(!showRealLogin);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome! Please Choose:</h1>

      {/* USERNAME Field - Required for "Play as Guest" */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '8px', fontSize: '1rem', width: '200px' }}
        />
      </div>

      {/* Toggle to show optional Real Login fields */}
      <button
        onClick={toggleRealLogin}
        style={{ marginBottom: '1rem', padding: '8px 16px', cursor: 'pointer' }}
      >
        {showRealLogin ? 'Hide Real Login Fields' : 'Show Real Login Fields'}
      </button>

      {showRealLogin && (
        <div style={{ margin: '1rem auto', maxWidth: '300px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email (for real login)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px', fontSize: '1rem', width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="Password (for real login)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '8px', fontSize: '1rem', width: '100%' }}
            />
          </div>
          <button
            onClick={handleRealLogin}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Log In
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        {/* Play as Guest Button */}
        <button
          onClick={handlePlayAsGuest}
          style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}
        >
          Play as Guest
        </button>

        {/* "Real" Login is done in the toggleable fields above */}
      </div>
    </div>
  );
}

export default LoginPage;
