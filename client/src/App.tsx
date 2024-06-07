import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { useNavigate } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Games from './pages/Games';
import Game from './pages/Game';
import GameDetails from './pages/Game';
import Communities from './pages/Communities';


const App: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, handleLogin, user } = useAuth();
  const navigate  = useNavigate();

  useEffect(handleLogin, []);

  const handleLogout = () => {
    // Clear cookie by setting its expiry to the past
    document.cookie = 'token=; Max-Age=0; path=/;';
    setIsLoggedIn(false);
    // Optionally redirect the user to the login page
    navigate('/login');
  };

  return (
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {user &&  
              <li>
                <Link to={"/profile/" + user.id}>Profile</Link>
              </li>}
              <li>
                <Link to="/games">Games</Link>
              </li>
              <li>
                <Link to="/communities"> Communities </Link>
              </li>
              {!isLoggedIn &&
              <>       
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </>
              }
              <button className="logoutButton" onClick={handleLogout}>Logout</button>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ProtectedRoute Component={Home} isLoggedIn={isLoggedIn}/>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/games" element={<Games />} />
            <Route path='/communities' element={<Communities />} />
            <Route path="/game/:id" element={<GameDetails />} />
            <Route path="/login" element={<Login />} />
            {user &&  <Route path="/profile/:id" element={<Profile />} /> }
          </Routes>
        </main>
      </div>
  );
}

export default App;
