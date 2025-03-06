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
import useSound from "use-sound";
import notificationSound from "./assets/level-up-191997.mp3";
const App: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, handleLogin, user } = useAuth();
  const { notifications } = useSocket();
  const [isChatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const [playSound] = useSound(notificationSound);

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
      {isLoggedIn && <header className="App-header">
        { user && (
          <>
            <div className="profileLink">
              <Link to={"/profile/" + user._id}>
                <img
                  src={`https://localhost:4000/${user.profilePicture}`}
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
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
