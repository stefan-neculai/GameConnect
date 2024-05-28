import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const response = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Ensure cookies are sent with the request
      body: JSON.stringify({ email, password })
    });
  
    if (response.ok) {
      const data = await response.json(); // Parsing the JSON response body
      document.cookie = `token=${data.token}; path=/; max-age=3600;`; // Set cookie manually
      console.log('Login successful');
      // Redirect user or perform other action
      window.location.href = '/dashboard'; // Example redirect after successful login
    } else {
      console.log('Login failed');
      // Show error message to the user
      alert('Failed to login. Check your credentials and try again.');
    }
  };
  

  return (
    <div className="Login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
