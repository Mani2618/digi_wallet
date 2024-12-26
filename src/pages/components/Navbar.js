import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);  // Manage menu open/close state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Toggle menu visibility
  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  // Check if the user is logged in on initial render
  useEffect(() => {
    const token = localStorage.getItem('userToken'); // Check for user token
    setIsLoggedIn(!!token); // Update login state based on the token
    console.log('Token in localStorage:', token);
    console.log('isLoggedIn state:', !!token);
  }, []); // Re-run only once initially
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Remove user token from localStorage
    setIsLoggedIn(false);  // Update state to reflect logout
  };

  return (
    <nav className="navbar">
      <h1>PayTM Wallet</h1>
      
      {/* Hamburger button */}
      <button className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Menu links */}
      <div className={`menu-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>

        {/* Conditionally render Login/Logout based on the login state */}
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        )}
        
        <Link to="/transactions">Transactions</Link>
      </div>
    </nav>
  );
};

export default Navbar;
