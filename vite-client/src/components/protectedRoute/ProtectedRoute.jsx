import React from 'react';
import { useUser } from '@/hooks/user/useUser';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false, children }) => {
    const { currentUser, isLoading } = useUser();
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && currentUser.user_type !== 'admin') {
        return <Navigate to="/explore" replace />;
    }

    if (!adminOnly && currentUser.user_type === 'admin') {
        console.log("Redirecting to admin page")
        return <Navigate to="/admin" replace />;
    }

    console.log("Rendering protected route")

    return children;
};

export default ProtectedRoute;
