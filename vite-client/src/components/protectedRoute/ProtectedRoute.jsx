import React from 'react';
import { useUser } from '@/hooks/user/useUser';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { currentUser, isLoading } = useUser();
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser.user_type === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
