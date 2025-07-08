// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Parichay</Link>
      <div className="nav-links">
        <Link to="/login">Logout</Link>
        <Link to="/profile">profile</Link>
         <Link to="/booking">Booking</Link>
        <Link to="/messages">messages</Link>
      </div>
    </nav>
  );
};

export default Navbar;
