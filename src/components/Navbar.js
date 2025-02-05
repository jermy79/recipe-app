import React, { useState, useEffect } from 'react';
import '../CSS/Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size and update state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation (Bottom Right) */}
      <div className={`navbar ${isMobile ? 'hidden' : ''}`}>
        <h1>RecipeApp</h1>
        <ul>
          <li><Link to="/login">Log In</Link></li>
        </ul>
      </div>

      {/* Mobile Hamburger Button (Top Right) */}
      {isMobile && (
        <button 
          className="hamburger-btn" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      )}

      {/* Mobile Fullscreen Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button 
          className="close-btn" 
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          ×
        </button>
        <ul>
          <li><Link to="/login" onClick={toggleMenu}>Home</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;