import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import Games from "./pages/Games";
import GameDetails from "./pages/Game";
import Communities from "./pages/Communities";
import Community from "./pages/Community";
import PostPage from "./pages/PostPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faGamepad,
  faHome,
  faPeopleGroup,
  faComment,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "./context/SocketContext";
import Chat from "./components/Chat";
import Modal from "./components/Modal";
import './variables.css';
import AuthPage from "./pages/AuthPage";

const App: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, handleLogin, user } = useAuth();
  const { notifications } = useSocket();
  const [isChatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(handleLogin, []);

  useEffect(() => {
  }, [isLoggedIn]);

  useEffect(() => {
    console.log("user is ", user, user?.id, user?._id);
  }
  , [user]);


  const handleLogout = () => {
    // Clear cookie by setting its expiry to the past
    document.cookie = "token=; Max-Age=0; path=/;";
    setIsLoggedIn(false);
    // Optionally redirect the user to the login page
    navigate("/login");
  };

  // ProtectedRoute.jsx - Only accessible when logged in
  function ProtectedRoute({ children }: { children: React.ReactNode }) : JSX.Element {
    return isLoggedIn ?  <>{children}</> : <Navigate to="/login" replace />;
  }

  // AuthRoute.jsx - Only accessible when logged out
  function AuthRoute({ children }: { children: React.ReactNode }) : JSX.Element{
    return !isLoggedIn ?  <>{children}</> : <Navigate to="/" replace />;
  }

  return (
    <div className="App">
      {isLoggedIn && <header className="App-header">
        { user && (
          <>
            <div className="profileLink">
              <Link to={"/profile/" + user._id}>
                <img
                  src={`${API_URL}/../${user.profilePicture}`}
                  alt="avatar"
                />
                <p> {user.username} </p>
              </Link>
            </div>
            <div>
              <Link to="/">
                <FontAwesomeIcon icon={faHome} />
                <p> Home </p>
              </Link>
            </div>
            <div>
              <Link to="/games">
                <FontAwesomeIcon icon={faGamepad} />
                <p> Games </p>
              </Link>
            </div>
            <div>
              <Link to="/communities">
                {" "}
                <FontAwesomeIcon icon={faPeopleGroup} />
                <p> Communities </p>{" "}
              </Link>
            </div>

            <div className="inboxIcon" onClick={() => setChatOpen(true)}>
              <FontAwesomeIcon icon={faComment} />
              <p> Chats </p>
              {notifications.length != 0 && (
                <div className="notificationCount">
                  {" "}
                  {notifications.length ? notifications.length : ""}
                </div>
              )}
            </div>

            
            <div onClick={handleLogout}>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
              />
              <p> Exit </p>
            </div>
          </>
        )}
      </header>}
      <main>
      <Modal isOpen={isChatOpen} onClose={() => setChatOpen(false)}>
        <Chat/>
      </Modal>
        <Routes>
          <Route path="/login" element={<AuthRoute><AuthPage/></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><AuthPage /></AuthRoute>} />
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
          <Route path="/communities" element={<ProtectedRoute><Communities /></ProtectedRoute>} />
          <Route path="/community/:id" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/post/:id" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
          <Route path="/game/:id" element={<ProtectedRoute><GameDetails /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
