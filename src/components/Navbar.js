import React, { useState, useEffect } from 'react';
import '../CSS/Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../media/RezepeLogo.png';  // Import the logo image

const Navbar = () => {
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
  const isRootPage = location.pathname === '/'; // Check if the current path is root page

  return (
    <>
      {/* Desktop and Mobile Navigation */}
      <div className="navbar">
        <img
          src={logo}  // Use the imported image
          alt="ReZePe Logo"
          onClick={handleLogoClick}
          className="logo"  // Apply the logo class for styling
        />
        <ul>
          {/* Show "Create Recipe" link only on desktop */}
          {isHomePage && !isMobile && (
            <li><Link to="/create">Create Recipe</Link></li>
          )}
          {/* Show plus icon only on mobile and not on the root page */}
          {isMobile && !isRootPage && (
            <li><Link to="/create"><span className="plus-icon">+</span></Link></li>
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
    </>
  );
};

export default Navbar;
