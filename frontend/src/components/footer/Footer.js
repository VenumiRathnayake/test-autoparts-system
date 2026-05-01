import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaPinterestP,
} from "react-icons/fa";
import { FaEnvelope, FaLocationDot } from "react-icons/fa6";
import "../../styles/Components.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="layout-shell footer-layout">
        <div className="footer-brand">
          <span className="footer-eyebrow">AutoParts Connect</span>
          <h2>Search smarter, compare faster, and source parts with confidence.</h2>
          <p>
            A vehicle-first marketplace for discovering spare parts, trusted
            vendors, and practical maintenance guides in one place.
          </p>
          <Link to="/parts" className="btn btn-primary">
            Browse Parts
          </Link>
        </div>

        <div className="footer-links-group">
          <h3>Explore</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/parts">Parts</Link>
            </li>
            <li>
              <Link to="/education">Educational</Link>
            </li>
            <li>
              <Link to="/vendor-register">Become a Vendor</Link>
            </li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h3>Support</h3>
          <ul>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/account">My Account</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/history">Purchase History</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact-panel">
          <h3>Contact</h3>
          <div className="footer-contact-item">
            <FaPhone />
            <a href="tel:+94770000000">+94 77 000 0000</a>
          </div>
          <div className="footer-contact-item">
            <FaEnvelope />
            <a href="mailto:support@autopartsconnect.com">
              support@autopartsconnect.com
            </a>
          </div>
          <div className="footer-contact-item">
            <FaLocationDot />
            <span>Colombo, Sri Lanka</span>
          </div>

          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="https://pinterest.com" aria-label="Pinterest">
              <FaPinterestP />
            </a>
          </div>
        </div>
      </div>

      <div className="layout-shell footer-bottom">
        <p>© 2026 AutoParts Connect. Built for faster parts discovery.</p>
        <div className="footer-bottom-links">
          <Link to="/parts">Parts</Link>
          <Link to="/education">Guides</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
