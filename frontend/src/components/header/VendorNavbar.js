import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaTags,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { authHelper } from "../../services/api";
import "../../styles/Components.css";

const VendorNavbar = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = () => {
      if (authHelper.isLoggedIn()) {
        const email = authHelper.getUserEmail();
        setUserEmail(email || null);
      } else {
        setUserEmail(null);
      }
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [location]);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    authHelper.logout();
    setUserEmail(null);
    closeMenu();
  };

  return (
    <nav className="header-nav vendor-nav">
      <div className="vendor-nav__mobile-bar">
        <span className="vendor-nav__mobile-title">Vendor Dashboard</span>

        <button
          className={`mobile-menu-button ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle vendor navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`vendor-nav__panel ${isMenuOpen ? "open" : ""}`}>
        <div className="vendor-nav__brand-block">
          <span className="vendor-nav__title">Vendor Dashboard</span>
          <button
            className="vendor-nav__close"
            onClick={closeMenu}
            aria-label="Close vendor navigation"
          >
            <FaTimes />
          </button>
        </div>

        <div className="vendor-nav__links">
          <NavLink
            to="/vendor/add-parts"
            className={({ isActive }) =>
              `vendor-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaBoxOpen />
            <span>Add Parts</span>
          </NavLink>

          <NavLink
            to="/vendor/manage-parts"
            className={({ isActive }) =>
              `vendor-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaClipboardList />
            <span>Manage Parts</span>
          </NavLink>

          <NavLink
            to="/vendor/request-category"
            className={({ isActive }) =>
              `vendor-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaTags />
            <span>Request Category</span>
          </NavLink>

          <NavLink
            to="/vendor/orders"
            className={({ isActive }) =>
              `vendor-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaClipboardList />
            <span>Orders</span>
          </NavLink>
        </div>

        <div className="vendor-nav__footer">
          {userEmail && (
            <div className="vendor-nav__user">
              <FaUser />
              <span>{userEmail}</span>
            </div>
          )}

          <button className="vendor-nav__logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default VendorNavbar;
