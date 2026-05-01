import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Components.css";

const Banner = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [
    "/assets/images/hero-1.jpg",
    "/assets/images/hero-2.jpg",
    "/assets/images/hero-3.jpg",
    "/assets/images/hero-4.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-banner">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Find Quality Spare Parts for Your Vehicle</h1>
            <p>
              Discover genuine parts for German and American vehicles at
              competitive prices
            </p>
            <div className="hero-buttons">
              <Link to="/parts" className="btn btn-primary btn-lg">
                Browse Parts
              </Link>
              <Link to="/education" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img
              src={heroImages[currentImage]}
              alt="Car parts and accessories"
              className="hero-img"
            />
            <div className="image-indicators">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${
                    index === currentImage ? "active" : ""
                  }`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <div className="feature-icon">🔧</div>
            <h3>Quality Parts</h3>
            <p>Genuine and reconditioned options</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🚗</div>
            <h3>Vehicle Specific</h3>
            <p>German & American vehicles</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📦</div>
            <h3>Easy Pickup</h3>
            <p>Multiple vendor locations</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
