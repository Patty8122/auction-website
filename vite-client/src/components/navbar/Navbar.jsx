import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { Button } from '@/components/ui';
import styles from './Navbar.module.css';
import { useUser } from '@/hooks/user/useUser';

const Navbar = () => {

    const { currentUser, logout, isLoading: isUserLoading } = useUser();

    return (
        <div className={styles.navbar}>
            <div className={styles.navLinks}>
                <NavLink to="/explore" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Explore</NavLink>
                <NavLink to="/buy" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Buy</NavLink>
                <NavLink to="/sell" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Sell</NavLink>
            </div>
            <div className={styles.rightSection}>
                <NavLink to="/cart">
                    <Button className={styles.iconButton}>
                        <FaShoppingCart />
                    </Button>
                </NavLink>
                {currentUser ? (
                    <NavLink to="/profile" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Hello, {currentUser.username}</NavLink>
                ) : (
                    <></>
                )}
                
            
            </div>
        </div>
    );
};

export default Navbar;
