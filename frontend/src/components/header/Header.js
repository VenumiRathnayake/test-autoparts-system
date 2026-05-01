import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaHistory,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { authHelper } from "../../services/api";
import "../../styles/Components.css";

const Header = () => {
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <nav className={`header-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="layout-shell nav-container">
        <NavLink to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-text">
            {process.env.REACT_APP_BRAND_NAME || "AutoParts"}
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/parts"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Parts
          </NavLink>
          <NavLink
            to="/education"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Educational
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Contact Us
          </NavLink>
        </div>

        <div className="nav-actions">
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
                <NavLink to="/history" className="dropdown-item" onClick={closeMenu}>
                  <FaHistory className="me-2" />
                  <span>Purchase History</span>
                </NavLink>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
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
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink
              to="/parts"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Parts
            </NavLink>
            <NavLink
              to="/education"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Educational
            </NavLink>
            <NavLink
              to="/contact"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Contact Us
            </NavLink>
          </div>

          <div className="mobile-auth">
            {userEmail ? (
              <>
                <div className="mobile-user-info">
                  <FaUser />
                  <span className="mobile-user-email">{userEmail}</span>
                </div>
                <button className="mobile-logout-button" onClick={handleLogout}>
                  Logout
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

export default Header;
