import React, { useState, useEffect } from 'react';
import '../CSS/Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../media/RezepeLogo.png';

const Navbar = ({ onSearchChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);
  }, []);

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
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Pass search query up to parent component
    onSearchChange(query);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const isHomePage = location.pathname === '/home';
  const isRootPage = location.pathname === '/';

  return (
    <div className="navbar">
      <img
        src={logo}
        alt="ReZePe Logo"
        onClick={handleLogoClick}
        className="logo"
      />
      <ul>
        {isHomePage && !isMobile && (
          <li><Link to="/create">Create Recipe</Link></li>
        )}
        {isMobile && !isRootPage && (
          <li><Link to="/create"><span className="plus-icon">+</span></Link></li>
        )}
        {isHomePage && (
          <li className="searchBar">
            <form onSubmit={handleSearch} className={isSearchOpen ? "searchForm open" : "searchForm"}>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
              )}
              <button type="button" onClick={toggleSearch}>
                {isSearchOpen ? "✖" : "🔍"}
              </button>
            </form>
          </li>
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
  );
};

export default Navbar;