import React from 'react';
import { useUser } from '@/hooks/user/useUser';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useUser();
    
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
