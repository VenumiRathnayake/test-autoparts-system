import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowTrendUp,
  FaCarSide,
  FaChartColumn,
  FaCircleCheck,
  FaClipboardCheck,
  FaMagnifyingGlass,
  FaMoneyBillWave,
  FaShieldHalved,
  FaStore,
  FaUsers,
} from "react-icons/fa6";
import "../styles/Pages.css";

const offerItems = [
  {
    icon: <FaMagnifyingGlass />,
    title: "Smart Vehicle-Based Search",
    description:
      "Find compatible parts based on vehicle model, year, and fuel type.",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Price Comparison",
    description: "Compare prices from multiple suppliers in one place.",
  },
  {
    icon: <FaCircleCheck />,
    title: "New & Reconditioned Options",
    description:
      "Choose between brand-new and reconditioned parts with confidence.",
  },
  {
    icon: <FaChartColumn />,
    title: "Vendor Dashboard",
    description:
      "Suppliers can manage inventory and monitor activity from one dashboard.",
  },
  {
    icon: <FaShieldHalved />,
    title: "Secure & Role-Based Access",
    description:
      "Customer, Vendor, and Admin modules keep operations controlled and clear.",
  },
];

const chooseItems = [
  {
    title: "Transparent Pricing",
    description:
      "Compare prices from multiple suppliers in one place before you make a decision.",
  },
  {
    title: "New & Reconditioned Options",
    description:
      "Choose between brand-new and cost-effective reconditioned parts based on your needs.",
  },
  {
    title: "Verified Vendors",
    description:
      "All vendors go through a manual approval process to improve reliability and trust.",
  },
  {
    title: "Secure Role-Based System",
    description:
      "Separate access for Customers, Vendors, and Admin keeps the platform organized.",
  },
  {
    title: "Vehicle-Based Compatibility",
    description:
      "Find parts tailored to your vehicle's make, model, year, and fuel type.",
  },
  {
    title: "Performance & Inventory Insights",
    description:
      "Vendors can track orders and inventory activity for better business decisions.",
  },
];

const processItems = [
  {
    icon: <FaCarSide />,
    title: "Select Your Vehicle",
    description:
      "Browse available vehicles or search by brand, year, and fuel type to find compatible parts.",
  },
  {
    icon: <FaUsers />,
    title: "Compare Parts & Suppliers",
    description:
      "View part availability, compare prices, and review supplier options in one place.",
  },
  {
    icon: <FaClipboardCheck />,
    title: "Arrange Pickup",
    description:
      "Choose your preferred supplier and continue with a cleaner purchase flow.",
  },
];

const heroPoints = [
  "Verified suppliers and transparent pricing",
  "Vehicle-based search with compatible part matching",
  "Customer, Vendor, and Admin workflows in one platform",
];

const AboutUs = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-shell about-hero__content">
          <div className="about-hero__copy">
            <span className="about-hero__eyebrow">About AutoParts Connect</span>
            <h1>
              Connecting Vehicle Owners with
              <span> Trusted Spare Parts Suppliers</span>
            </h1>
            <p>
              AutoParts Connect is an online marketplace designed to simplify
              the way vehicle owners find, compare, and source spare parts from
              reliable suppliers.
            </p>

            <div className="about-hero__actions">
              <Link to="/parts" className="home-btn home-btn--primary">
                Browse Parts
              </Link>
              <Link to="/vendor-register" className="home-btn home-btn--ghost">
                Become a Vendor
              </Link>
            </div>
          </div>

          <div className="about-hero__panel">
            <div className="about-hero__panel-label">Why It Matters</div>
            <h2>Built to make spare parts discovery clearer and faster.</h2>
            <ul className="about-hero__points">
              {heroPoints.map((point) => (
                <li key={point}>
                  <FaCircleCheck />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="about-shell">
          <div className="about-section-heading">
            <h2>AutoParts Connect Story</h2>
          </div>

          <div className="about-story__grid">
            <div className="about-story__image">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
                alt="AutoParts Connect story"
              />
            </div>

            <div className="about-story__copy">
              <p>
                AutoParts Connect was created to bridge the gap between vehicle
                owners searching for reliable spare parts and suppliers looking
                to reach the right customers.
              </p>
              <p>
                Many vehicle owners struggle to find compatible parts, compare
                prices, or verify supplier credibility. At the same time, spare
                part suppliers often need a simpler digital way to showcase and
                manage their inventory.
              </p>
              <p>
                Our platform brings both sides together in one secure,
                transparent, and efficient marketplace.
              </p>
            </div>
          </div>

          <div className="about-dual-cards">
            <article className="about-highlight-card about-highlight-card--gold">
              <FaStore />
              <h3>Our Mission</h3>
              <p>
                To create a transparent and accessible digital marketplace that
                simplifies spare part discovery, comparison, and purchasing for
                vehicle owners.
              </p>
            </article>

            <article className="about-highlight-card about-highlight-card--dark">
              <FaArrowTrendUp />
              <h3>Our Vision</h3>
              <p>
                To become a trusted and scalable automotive marketplace that
                supports suppliers and serves vehicle owners with accuracy,
                reliability, and efficiency.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-offer">
        <div className="about-shell">
          <div className="about-section-heading">
            <h2>What AutoParts Connect Offer</h2>
          </div>

          <div className="about-offer__grid">
            <div className="about-offer__list">
              {offerItems.map((item) => (
                <article key={item.title} className="about-offer__item">
                  <div className="about-offer__icon">{item.icon}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="about-offer__image">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
                alt="Auto parts marketplace"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-choose">
        <div className="about-shell">
          <div className="about-section-heading">
            <h2>Why Choose AutoParts Connect</h2>
          </div>

          <div className="about-choose__grid">
            {chooseItems.map((item) => (
              <article key={item.title} className="about-choose__item">
                <div className="about-choose__check">
                  <FaCircleCheck />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-process">
        <div className="about-shell">
          <div className="about-section-heading">
            <h2>How AutoParts Connect Works</h2>
            <p>A simple and transparent process for both customers and suppliers.</p>
          </div>

          <div className="about-process__grid">
            {processItems.map((item, index) => (
              <article key={item.title} className="about-process-card">
                <div className="about-process-card__badge">0{index + 1}</div>
                <div className="about-process-card__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
