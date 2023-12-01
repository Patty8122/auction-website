import React from "react";
import styles from "./css/ProfilePage.module.css";
import { useUser } from '@/hooks/user/useUser';
import { Button } from '@/components/ui';
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const { currentUser, logout, deleteUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = () => {
        deleteUser();
        navigate('/login');
    }

    return (
        currentUser && 
        <div>
            <div className={styles.profileContainer}>
                <div className={styles.profileInfo}>
                    <table className={styles.usertable}>
                        <tbody>
                            <tr>
                                <td>Username</td>
                                <td>{currentUser.username}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{currentUser.email}</td>
                            </tr>
                            <tr>
                                <td>Password</td>
                                <td>********</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles.logout}>
                <Button onClick={handleLogout}>Logout</Button>
                <Button onClick={handleDelete}>Delete Account</Button>
            </div>
        </div>
    );
}

export default ProfilePage;