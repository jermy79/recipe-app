import React, { useState, useEffect } from 'react';
import '../CSS/Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  // Page-based navbar rules
  const isCreatePage = location.pathname === '/create';
  const isRecipePage = location.pathname.startsWith('/recipe/');

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`navbar ${isMobile ? 'hidden' : ''}`}>
        <h1 onClick={handleLogoClick} className="logo">RecipeApp</h1> {/* Logo always visible */}
        <ul>
          {isCreatePage ? (
            <li><button onClick={handleLogout}>Log Out</button></li> // Only Log Out
          ) : isRecipePage ? (
            <>
              <li><Link to="/create">Create Recipe</Link></li> {/* Show Create Recipe */}
              <li><button onClick={handleLogout}>Log Out</button></li>
            </>
          ) : (
            <>
              <li><Link to="/create">Create Recipe</Link></li>
              <li><button onClick={handleLogout}>Log Out</button></li>
            </>
          )}
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
          <li><h1 onClick={handleLogoClick} className="logo">RecipeApp</h1></li> {/* Logo in mobile menu */}
          {isCreatePage ? (
            <li><button onClick={() => { handleLogout(); toggleMenu(); }}>Log Out</button></li>
          ) : isRecipePage ? (
            <>
              <li><Link to="/create" onClick={toggleMenu}>Create Recipe</Link></li>
              <li><button onClick={() => { handleLogout(); toggleMenu(); }}>Log Out</button></li>
            </>
          ) : (
            <>
              <li><Link to="/create" onClick={toggleMenu}>Create Recipe</Link></li>
              <li><button onClick={() => { handleLogout(); toggleMenu(); }}>Log Out</button></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
