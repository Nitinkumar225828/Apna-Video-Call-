import React, { useState, useContext } from 'react';
import './Authentication.css';
import { AuthContext } from '../contexts/AuthContext';
import illustration from '../assets/focused.png'; // Use your own illustration

const Authentication = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState(0); // 0 = login, 1 = register
  const [showMessage, setShowMessage] = useState(false);

  const { handleLogin, handleRegister } = useContext(AuthContext);

  const handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(name, username, password);
        setMessage(result);
        setShowMessage(true);
        setError('');
        setFormState(0);
        setName('');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong!';
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side Illustration */}
      <div className="auth-left">
        <img src={illustration} alt="Video Meeting" className="illustration" />
        <h1>Welcome to Apna Video Call</h1>
        <p>Connect, collaborate, and communicate effortlessly</p>
      </div>

      {/* Right Side Form */}
      <div className="auth-right">
        <div className="form-container">
          <div className="toggle-buttons">
            <button
              className={formState === 0 ? 'active' : ''}
              onClick={() => setFormState(0)}
            >
              Sign In
            </button>
            <button
              className={formState === 1 ? 'active' : ''}
              onClick={() => setFormState(1)}
            >
              Sign Up
            </button>
          </div>

          {formState === 1 && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error">{error}</div>}

          <button className="primary-btn" onClick={handleAuth}>
            {formState === 0 ? 'Login' : 'Register'}
          </button>

          {showMessage && <div className="success">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
