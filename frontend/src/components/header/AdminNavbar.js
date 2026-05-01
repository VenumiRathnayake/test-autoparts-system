import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaClipboardList,
  FaPlus,
  FaSignOutAlt,
  FaTags,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { authHelper } from "../../services/api";
import "../../styles/Components.css";

const AdminNavbar = () => {
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
    <nav className="header-nav admin-nav">
      <div className="admin-nav__mobile-bar">
        <span className="admin-nav__mobile-title">Admin Dashboard</span>

        <button
          className={`mobile-menu-button ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle admin navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`admin-nav__panel ${isMenuOpen ? "open" : ""}`}>
        <div className="admin-nav__brand-block">
          <span className="admin-nav__title">Admin Dashboard</span>
          <button
            className="admin-nav__close"
            onClick={closeMenu}
            aria-label="Close admin navigation"
          >
            <FaTimes />
          </button>
        </div>

        <div className="admin-nav__links">
          <NavLink
            to="/admin/add-parts"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaPlus />
            <span>Add Parts</span>
          </NavLink>

          <NavLink
            to="/admin/manage-parts"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaClipboardList />
            <span>Manage Parts</span>
          </NavLink>

          <NavLink
            to="/admin/add-articles"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaPlus />
            <span>Add Articles</span>
          </NavLink>

          <NavLink
            to="/admin/manage-articles"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaClipboardList />
            <span>Manage Articles</span>
          </NavLink>

          <NavLink
            to="/admin/add-categories"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaPlus />
            <span>Add Categories</span>
          </NavLink>

          <NavLink
            to="/admin/manage-categories"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaTags />
            <span>Manage Categories</span>
          </NavLink>

          <NavLink
            to="/admin/manage-vendors"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaUser />
            <span>Manage Vendors</span>
          </NavLink>

          <NavLink
            to="/admin/manage-category-requests"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <FaTags />
            <span>Category Requests</span>
          </NavLink>
        </div>

        <div className="admin-nav__footer">
          {userEmail && (
            <div className="admin-nav__user">
              <FaUser />
              <span>{userEmail}</span>
            </div>
          )}

          <button className="admin-nav__logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
