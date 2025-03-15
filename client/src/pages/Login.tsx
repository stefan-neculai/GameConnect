import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL;
  // Helper function to validate email
  const isValidEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let valid = true;
    let errors = { email: '', password: '' };

    if (!isValidEmail(email)) {
      errors.email = 'Invalid email format';
      valid = false;
    }

    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!valid) {
      setErrors(errors);
      return;
    }
    setLoading(true);
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Ensure cookies are sent with the request
      body: JSON.stringify({ email, password })
    });
    setLoading(false);

    if (response.ok) {
      const data = await response.json(); // Parsing the JSON response body
      document.cookie = `token=${data.token}; path=/; max-age=3600; secure; samesite=None`; // Set cookie manually
      console.log('Login successful');
      handleLogin();
      navigate('/');
    } else {
      console.log('Login failed');
      alert('Failed to login. Check your credentials and try again.');
    }
  };

  return (
      <section className="LogInContainer">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors(prev => ({ ...prev, email: '' }));
              }}
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({ ...prev, password: '' }));
              }}
            />
            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          </div>
          {loading ? <div className="loader"> </div> : <button type="submit" disabled={loading}> Log In </button>}
          <p className="signup-link">Don't have an account already? Click here to <Link to={'/signup'}>sign up.</Link></p>
        </form>
      </section>
  );
};

export default Login;
