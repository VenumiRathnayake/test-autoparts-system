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
  FaTags
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { authHelper } from "../../services/api";
import "../../styles/Components.css";

const AdminNavbar = () => {
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Effect to check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      if (authHelper.isLoggedIn()) {
        const email = authHelper.getUserEmail();
        if (email) {
          setUserEmail(email);
        }
      } else {
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

  const handleLogout = () => {
    authHelper.logout();
    setUserEmail(null);
    closeMenu();
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
    <nav className={`header-nav admin-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <NavLink to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-text">
            {process.env.REACT_APP_BRAND_NAME || "AutoParts"} - Admin Panel
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
            >
              <FaHome /> Home
            </NavLink>
            
            {/* Parts Management */}
            <div className="nav-dropdown">
              <button className="nav-dropdown-btn">
                <FaPlus /> Parts
              </button>
              <div className="dropdown-content">
                <NavLink to="/admin/add-parts" className="dropdown-item">
                  <FaPlus /> Add Parts
                </NavLink>
                <NavLink to="/admin/manage-parts" className="dropdown-item">
                  <FaList /> Manage Parts
                </NavLink>
              </div>
            </div>

            {/* Articles Management */}
            <div className="nav-dropdown">
              <button className="nav-dropdown-btn">
                <FaNewspaper /> Articles
              </button>
              <div className="dropdown-content">
                <NavLink to="/admin/add-articles" className="dropdown-item">
                  <FaPlus /> Add Articles
                </NavLink>
                <NavLink to="/admin/manage-articles" className="dropdown-item">
                  <FaList /> Manage Articles
                </NavLink>
              </div>
            </div>

            {/* Categories Management */}
            <div className="nav-dropdown">
              <button className="nav-dropdown-btn">
                <FaTags /> Categories
              </button>
              <div className="dropdown-content">
                <NavLink to="/admin/add-categories" className="dropdown-item">
                  <FaPlus /> Add Categories
                </NavLink>
                <NavLink to="/admin/manage-categories" className="dropdown-item">
                  <FaList /> Manage Categories
                </NavLink>
              </div>
            </div>

            <div className="nav-dropdown">
              <button className="nav-dropdown-btn">
                <FaUser /> Vendors
              </button>
              <div className="dropdown-content">
                <NavLink to="/admin/manage-vendors" className="dropdown-item">
                  <FaList /> Manage Vendors
                </NavLink>
                <NavLink to="/admin/manage-category-requests" className="dropdown-item">
                  <FaTags /> Category Requests
                </NavLink>
              </div>
            </div>
          </div>

          <div className="nav-actions">
            <form className="search-form" onSubmit={handleSearch}>
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

            <NavLink to="/cart" className="cart-link">
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </NavLink>

            {userEmail ? (
              <div className="user-dropdown">
                <button className="user-button">
                  <FaUser />
                  <span className="user-email">{userEmail}</span>
                </button>
                <div className="dropdown-content">
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <NavLink to="/account" className="auth-link">
                Login
              </NavLink>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className={`mobile-menu-button ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav-links">
            <NavLink to="/" className="mobile-nav-link" onClick={closeMenu} end>
              <FaHome /> Home
            </NavLink>
            
            {/* Mobile Parts Management */}
            <div className="mobile-section">
              <h4 className="mobile-section-title">Parts Management</h4>
              <NavLink to="/admin/add-parts" className="mobile-nav-link" onClick={closeMenu}>
                <FaPlus /> Add Parts
              </NavLink>
              <NavLink to="/admin/manage-parts" className="mobile-nav-link" onClick={closeMenu}>
                <FaList /> Manage Parts
              </NavLink>
            </div>

            {/* Mobile Articles Management */}
            <div className="mobile-section">
              <h4 className="mobile-section-title">Articles Management</h4>
              <NavLink to="/admin/add-articles" className="mobile-nav-link" onClick={closeMenu}>
                <FaPlus /> Add Articles
              </NavLink>
              <NavLink to="/admin/manage-articles" className="mobile-nav-link" onClick={closeMenu}>
                <FaList /> Manage Articles
              </NavLink>
            </div>

            {/* Mobile Categories Management */}
            <div className="mobile-section">
              <h4 className="mobile-section-title">Categories Management</h4>
              <NavLink to="/admin/add-categories" className="mobile-nav-link" onClick={closeMenu}>
                <FaPlus /> Add Categories
              </NavLink>
              <NavLink to="/admin/manage-categories" className="mobile-nav-link" onClick={closeMenu}>
                <FaList /> Manage Categories
              </NavLink>
            </div>

            {/* Mobile Vendor Management */}
            <div className="mobile-section">
              <h4 className="mobile-section-title">Vendor Management</h4>
              <NavLink to="/admin/manage-vendors" className="mobile-nav-link" onClick={closeMenu}>
                <FaList /> Manage Vendors
              </NavLink>
              <NavLink to="/admin/manage-category-requests" className="mobile-nav-link" onClick={closeMenu}>
                <FaTags /> Category Requests
              </NavLink>
            </div>
          </div>

          <div className="mobile-search">
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
              />
              <button type="submit" className="mobile-search-button">
                <FaSearch />
              </button>
            </form>
          </div>

          <div className="mobile-auth">
            {userEmail ? (
              <>
                <div className="mobile-user-info">
                  <FaUser />
                  <span className="mobile-user-email">{userEmail}</span>
                </div>
                <button className="mobile-logout-button" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/account"
                className="mobile-login-link"
                onClick={closeMenu}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;