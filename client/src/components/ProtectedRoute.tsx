import React from 'react';
import { Route, Navigate, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    Component: React.FC<any>;
    isLoggedIn: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ Component }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? (
        <Component />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;