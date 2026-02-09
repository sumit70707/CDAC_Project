import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const location = useLocation();

    // 1. Check Authentication
    if (!isAuthenticated) {
        // Redirect to login, but remember where they were trying to go
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Check Role (if specific roles are required)
    if (allowedRoles && !allowedRoles.includes(role)) {
        // User is logged in but doesn't have permission (e.g. Customer trying to access Seller Dashboard)
        return <Navigate to="/" replace />;
    }

    // 3. Render the protected component
    return children;
};

export default ProtectedRoute;
