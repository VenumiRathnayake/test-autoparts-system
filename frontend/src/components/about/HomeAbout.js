import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Components.css";

const HomeAbout = () => {
  return (
    <section className="home-about section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Why Choose Our Spare Parts?</h2>
            <p>
              We specialize in providing high-quality spare parts for German and
              American vehicles. Our platform connects you with trusted vendors
              offering both brand new and reconditioned parts.
            </p>

            <div className="about-features">
              <div className="feature">
                <h4>Wide Selection</h4>
                <p>
                  Find parts for various makes and models from our extensive
                  catalog
                </p>
              </div>
              <div className="feature">
                <h4>Quality Assurance</h4>
                <p>All parts are verified for quality and compatibility</p>
              </div>
              <div className="feature">
                <h4>Competitive Pricing</h4>
                <p>Compare prices from multiple vendors to get the best deal</p>
              </div>
            </div>

            <Link to="/about" className="btn btn-secondary">
              Learn More About Us
            </Link>
          </div>

          <div className="about-image">
            <img
              src="/assets/images/about-us.jpeg"
              alt="About our spare parts business"
              className="about-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
