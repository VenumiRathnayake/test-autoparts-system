import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaCog,
  FaHistory,
  FaSignOutAlt,
  FaHome,
  FaPlus,
  FaList,
  FaNewspaper,
  FaTags,
  FaShoppingBag
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { authHelper } from "../../services/api";
import "../../styles/Components.css";

const VendorNavbar = () => {
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.user-menu')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  // Effect to check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      if (authHelper.isLoggedIn()) {
        const email = authHelper.getUserEmail();
        console.log('User is logged in, email:', email);
        if (email) {
          setUserEmail(email);
        }
      } else {
        console.log('User is not logged in');
        setUserEmail(null);
      }
    };

    // Check initially
    checkAuthStatus();

    // Listen for storage changes (when login/logout happens)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check when the component mounts and when location changes
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleUserDropdown = () => {
    console.log('Toggling user dropdown, current state:', isUserDropdownOpen);
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  const closeUserDropdown = () => setIsUserDropdownOpen(false);

  const handleLogout = () => {
    authHelper.logout();
    setUserEmail(null);
    closeUserDropdown();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      closeMenu();
    }
  };

  return (
    <nav className={`header-nav vendor-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="layout-shell nav-container">
        <NavLink to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-text">
            {process.env.REACT_APP_BRAND_NAME || "AutoParts"} - Vendor Panel
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          <div className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              end
              onClick={closeMenu}
            >
              <FaHome />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/vendor/add-parts"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaPlus />
              <span>Add Parts</span>
            </NavLink>

            <NavLink
              to="/vendor/manage-parts"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaList />
              <span>Manage Parts</span>
            </NavLink>

            <NavLink
              to="/vendor/request-category"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaTags />
              <span>Request Category</span>
            </NavLink>

            <NavLink
              to="/vendor/orders"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaShoppingBag />
              <span>Orders</span>
            </NavLink>

            <NavLink
              to="/parts"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaCog />
              <span>Browse Parts</span>
            </NavLink>

            <NavLink
              to="/education"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaNewspaper />
              <span>Education</span>
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <FaUser />
              <span>Contact</span>
            </NavLink>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              placeholder="Search parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FaSearch />
            </button>
          </form>

          {/* User Menu */}
          <div className="nav-user">
            {userEmail ? (
              <div className="user-menu">
                <button className="user-button" onClick={toggleUserDropdown}>
                  <FaUser />
                  <span>{userEmail}</span>
                </button>

                {isUserDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                    padding: '0.5rem 0',
                    width: '200px',
                    zIndex: 1000,
                    border: '1px solid #e9ecef',
                    display: 'block'
                  }}>
                    <NavLink
                      to="/cart"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        color: '#2c3e50',
                        cursor: 'pointer',
                        transition: 'background 0.3s',
                        fontSize: '0.9rem',
                        textDecoration: 'none'
                      }}
                      onClick={closeUserDropdown}
                    >
                      <FaShoppingCart />
                      <span>Cart ({cartItems.length})</span>
                    </NavLink>
                    <button 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        color: '#e74c3c',
                        cursor: 'pointer',
                        transition: 'background 0.3s',
                        fontSize: '0.9rem',
                        borderTop: '1px solid #ecf0f1',
                        marginTop: '5px',
                        paddingTop: '10px',
                        fontWeight: '600'
                      }}
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/account" className="login-button">
                <FaUser />
                <span>Login</span>
              </NavLink>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          <NavLink
            to="/"
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            <FaHome />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/vendor/add-parts"
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            <FaPlus />
            <span>Add Parts</span>
          </NavLink>
            <NavLink
              to="/vendor/manage-parts"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              <FaList />
              <span>Manage Parts</span>
            </NavLink>

            <NavLink
              to="/vendor/request-category"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              <FaTags />
              <span>Request Category</span>
            </NavLink>

            <NavLink
              to="/vendor/orders"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              <FaShoppingBag />
              <span>Orders</span>
            </NavLink>
          <NavLink
            to="/parts"
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            <FaCog />
            <span>Browse Parts</span>
          </NavLink>
          <NavLink
            to="/education"
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            <FaNewspaper />
            <span>Education</span>
          </NavLink>
          <NavLink
            to="/contact"
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            <FaUser />
            <span>Contact</span>
          </NavLink>
          {userEmail && (
            <>
              <NavLink
                to="/cart"
                className="mobile-nav-link"
                onClick={closeMenu}
              >
                <FaShoppingCart />
                <span>Cart ({cartItems.length})</span>
              </NavLink>
              <button className="mobile-nav-link logout-button" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default VendorNavbar;
