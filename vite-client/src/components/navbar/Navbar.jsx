import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Button } from '@/components/ui';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.navLinks}>
                <NavLink to="/explore" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Explore</NavLink>
                <NavLink to="/buy" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Buy</NavLink>
                <NavLink to="/sell" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Sell</NavLink>
            </div>
            <div className={styles.rightSection}>
                <Button className={styles.iconButton}>
                    <AiOutlineShoppingCart />
                </Button>
                <NavLink to="/profile" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Profile</NavLink>
            </div>
        </div>
    );
};

export default Navbar;
