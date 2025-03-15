import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import Login from "./Login";
import SignUp from "./SignUp";
import "./AuthPage.css";

const AuthPage: React.FC = () => {
    const path = window.location.pathname;

    return (
    <div className="auth-page">
        {path === "/login" && <Login />}
        {path === "/signup" && <SignUp />}
        <div className="auth-image-wrapper">
            <img src="https://www.gamingzombies.com/blog/wp-content/uploads/2022/04/the-best-social-media-platforms-for-gamers-scaled.jpg" alt="Sign up" />
            <div className="auth-image-caption">Discover games. Connect with players. Experience more.</div>
        </div>
    </div>)
};

export default AuthPage;
