import React, { useState, useEffect } from 'react';
import '../CSS/Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the user is logged in on component mount
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken); // Set isLoggedIn to true if authToken exists
  }, []);

  // Handle window resize for mobile detection
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false); // Update login state
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  // Check if current path is /home
  const isHomePage = location.pathname === '/home';

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`navbar ${isMobile ? 'hidden' : ''}`}>
        <h1 onClick={handleLogoClick} className="logo">RecipeApp</h1>
        <ul>
          {isHomePage && (
            <li><Link to="/create">Create Recipe</Link></li>
          )}
          <li>
            {isLoggedIn ? (
              <button onClick={handleLogout}>Log Out</button>
            ) : (
              <Link to="/login">Log In</Link>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Hamburger Button */}
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
          <li><h1 onClick={handleLogoClick} className="logo">RecipeApp</h1></li>
          {isHomePage && (
            <li><Link to="/create" onClick={toggleMenu}>Create Recipe</Link></li>
          )}
          <li>
            {isLoggedIn ? (
              <button onClick={() => { handleLogout(); toggleMenu(); }}>Log Out</button>
            ) : (
              <Link to="/login" onClick={toggleMenu}>Log In</Link>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
