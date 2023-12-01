import React from "react";
import styles from "./css/ProfilePage.module.css";
import { useUser } from '@/hooks/user/useUser';
import { Button } from '@/components/ui';
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const { currentUser, logout, isLoading: isUserLoading } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        currentUser ? (
            <div>
                <h1>Profile</h1>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        ) : (
            <h1>Please login to continue.</h1>
        )
    );
}

export default ProfilePage;