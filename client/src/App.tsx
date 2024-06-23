import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useNavigate } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Games from "./pages/Games";
import Game from "./pages/Game";
import GameDetails from "./pages/Game";
import Communities from "./pages/Communities";
import Community from "./pages/Community";
import Post from "./components/Post";
import PostPage from "./pages/PostPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const App: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, handleLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(handleLogin, []);

  const handleLogout = () => {
    // Clear cookie by setting its expiry to the past
    document.cookie = "token=; Max-Age=0; path=/;";
    setIsLoggedIn(false);
    // Optionally redirect the user to the login page
    navigate("/login");
  };

  return (
    <div className="App">
      <header className="App-header">
        {user && (
          <>
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <Link to={"/profile/" + user.id}>Profile</Link>
            </div>
            <div>
              <Link to="/games">Games</Link>
            </div>
            <div>
              <Link to="/communities"> Communities </Link>
            </div>
            <div className="inboxIcon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
          </>
        )}

        {!isLoggedIn && (
          <>
            <div>
              <Link to="/signup">Sign Up</Link>
            </div>
            <div className="loginLink">
              <Link to="/login">Login</Link>
            </div>
          </>
        )}
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/games" element={<Games />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/community/:id" element={<Community />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/login" element={<Login />} />
          {user && <Route path="/profile/:id" element={<Profile />} />}
        </Routes>
      </main>
    </div>
  );
};

export default App;
