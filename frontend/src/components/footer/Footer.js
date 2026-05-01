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
        <div className="footer-contact-panel">
          <h3>Contact Details</h3>
          <div className="footer-contact-item">
            <FaPhone />
            <div>
              <a href="tel:+94770000000">+94 77 000 0000</a>
              <a href="tel:+94771111111">+94 77 000 0000</a>
            </div>
          </div>
          <div className="footer-contact-item">
            <FaEnvelope />
            <div>
              <a href="mailto:info@autoparts.lk">info@autoparts.lk</a>
              <a href="mailto:support@autoparts.lk">support@autoparts.lk</a>
            </div>
          </div>
          <div className="footer-contact-item footer-contact-item--address">
            <FaLocationDot />
            <span>76, Wadduwa, Kalutara, Sri Lanka</span>
          </div>
        </div>

        <div className="footer-message">
          <h2>
            Find the right <span>part</span>
            <br />
            From the right <span>supplier</span>
          </h2>
        </div>

        <div className="footer-links-group footer-links-group--useful">
          <h3>Useful Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/parts">Parts</Link>
            </li>
            <li>
              <Link to="/education">Educational</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

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
        <p>&copy; 2026 AutoParts Connect. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
