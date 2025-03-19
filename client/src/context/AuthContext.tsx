import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/User';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  handleLogin: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User | null) => void;
  checkLogin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const checkLogin = async () => {
    const res = await fetch(`${API_URL}/auth`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if(res.ok) {
      let response = await res.json();
      setUser(response.user);
      setIsLoggedIn(true);
      return true;
    }
    setIsLoggedIn(false);
    return false;
  }

  const handleLogin = async () => {
    let loggedIn = await checkLogin();
    if(!loggedIn) {
      navigate('/login');
    } else {  
      navigate('/');
    }
  }

  const fetchUser = async (id : string) => {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      setIsLoggedIn(true);
    }
  }

  return (
    <AuthContext.Provider value={{ handleLogin, isLoggedIn, user, setIsLoggedIn, setUser, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
