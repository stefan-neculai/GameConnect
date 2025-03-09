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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const handleLogin = () => {
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (token) {
      const tokenValue = token.split('=')[1];
      const decoded: User = jwtDecode(tokenValue);
      fetchUser(decoded.id);
      setIsLoggedIn(true);
      setUser(decoded);
    }
    else {
      navigate('/login');
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
    }
  }

  useEffect(handleLogin, []);
  return (
    <AuthContext.Provider value={{ handleLogin, isLoggedIn, user, setIsLoggedIn, setUser }}>
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
