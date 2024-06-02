import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
import { User } from '../types/User';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  handleLogin: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (token) {
      const tokenValue = token.split('=')[1];
      const decoded: User = jwtDecode(tokenValue);
      setIsLoggedIn(true);
      setUser(decoded);
    }
    else {
      navigate('/login');
    }
  }

  useEffect(handleLogin, []);
  return (
    <AuthContext.Provider value={{ handleLogin, isLoggedIn, user, setIsLoggedIn }}>
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
