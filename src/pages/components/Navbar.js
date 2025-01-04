import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';  
import paytmLogo from './img.png';
import "./Navbar.css";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, setUser } = useContext(UserContext); 

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleLogout = () => {
    setUser(null); // Clear user from context
    localStorage.clear(); // Clear user-related local storage (optional)
    window.location.href = "/"; 
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Hamburger Menu */}
        <div
          className={`menu-icon ${showMenu ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
          
        </div>
        {showMenu && (
          <div className="dropdown-menu">
            <ul>
            <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/transactions">Transaction Page</Link>
              </li>
              <li>
                <Link to="/about">About Section</Link>
              </li>
            </ul>
          </div>
        )}
        <Link to="/profile">
        <img src={paytmLogo} alt="Paytm Logo" className="paytm-logo" />
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <button className="sign-in-btn" onClick={handleLogout}>
            <img
              src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png"
              alt="User Icon"
              className="user-icon"
            />
            Log Out
          </button>
          
        ) : (
            <Link to="/login">
            <button className="sign-in-btn">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png"
                alt="User Icon"
                className="user-icon"
              />
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
