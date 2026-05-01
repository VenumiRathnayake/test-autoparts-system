import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaClipboardList,
  FaCircleCheck,
  FaGaugeHigh,
  FaLock,
  FaMoneyBillWave,
  FaScrewdriverWrench,
  FaShieldHalved,
  FaTruckFast,
} from "react-icons/fa6";
import { articlesAPI, partsAPI } from "../services/api";
import "../styles/Pages.css";

const processSteps = [
  {
    icon: <FaClipboardList />,
    title: "Choose Your Vehicle",
    description: "Browse by brand, model, year, and fuel type to narrow down exact-fit parts.",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Compare Parts",
    description: "Review stock, pricing, and condition before you commit to a purchase.",
  },
  {
    icon: <FaTruckFast />,
    title: "Purchase With Confidence",
    description: "Order from verified suppliers and track the parts you need in one place.",
  },
];

const trustPoints = [
  { icon: <FaCircleCheck />, label: "Verified Vendors" },
  { icon: <FaGaugeHigh />, label: "Transparent Pricing" },
  { icon: <FaScrewdriverWrench />, label: "New & Reconditioned Parts" },
  { icon: <FaTruckFast />, label: "Time-Saving Search" },
  { icon: <FaLock />, label: "Secure Platform" },
];

const supplierBenefits = [
  "Get verified and build trust with buyers faster",
  "Manage inventory from your own dashboard",
  "Track new orders and fulfillment progress",
  "Reach customers searching for specific vehicle parts",
];

const resolveImage = (imagePath, fallback) => {
  if (!imagePath) return fallback;
  if (imagePath.startsWith("http")) return imagePath;
  return `${process.env.PUBLIC_URL}${imagePath}`;
};

const Home = () => {
  const [latestParts, setLatestParts] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [partsResponse, articleResponse] = await Promise.all([
          partsAPI.getAll(),
          articlesAPI.getAll(),
        ]);

        const sortedParts = [...partsResponse.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((part) => ({
            ...part,
            image: resolveImage(
              part.image,
              "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=1200&q=80"
            ),
          }));

        const sortedArticles = [...articleResponse.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((article) => ({
            ...article,
            image_url: resolveImage(
              article.image_url,
              "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80"
            ),
          }));

        setLatestParts(sortedParts);
        setArticles(sortedArticles);
      } catch (error) {
        console.error("Failed to load home page content", error);
      }
    };

    loadHomeData();
  }, []);

  const heroPart = latestParts[0];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-shell">
          <div className="home-hero__content">
            <span className="home-eyebrow">Find The Right Auto Parts</span>
            <h1>
              Find the Right Auto Parts Compare Prices Instantly
            </h1>
            <p>
              Search compatible vehicle categories, browse trusted vendors, and
              move from discovery to checkout in a cleaner flow.
            </p>
            <div className="home-hero__actions">
              <Link to="/parts" className="home-btn home-btn--primary">
                Browse Vehicles
              </Link>
              <Link to="/vendor-register" className="home-btn home-btn--ghost">
                Become a Vendor
              </Link>
            </div>
            <ul className="home-hero__stats">
              <li>
                <strong>Vehicle-first</strong>
                <span>Search flow</span>
              </li>
              <li>
                <strong>Verified</strong>
                <span>Supplier onboarding</span>
              </li>
              <li>
                <strong>Fast</strong>
                <span>Part discovery</span>
              </li>
            </ul>
          </div>

          <div className="home-hero__visual">
            <div className="hero-vehicle-card">
              <div className="hero-vehicle-card__glow" />
              <img
                src={
                  heroPart?.image ||
                  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80"
                }
                alt={heroPart?.name || "Featured auto part"}
              />
              <div className="hero-vehicle-card__meta">
                <span>Featured Part</span>
                <h3>{heroPart?.name || "Auto Parts Marketplace"}</h3>
                <p>{heroPart?.category || "Browse available spare parts by category"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell">
          <div className="home-section__heading">
            <span>How It Works</span>
            <h2>How AutoParts Connect Works</h2>
            <p>Three simple steps to match vehicles with the right spare parts.</p>
          </div>

          <div className="process-grid">
            {processSteps.map((step) => (
              <article key={step.title} className="process-card">
                <div className="process-card__icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--tight">
        <div className="home-shell">
          <div className="home-section__heading">
            <span>Why Choose Us</span>
            <h2>Built To Make Spare Parts Search Less Stressful</h2>
          </div>

          <div className="trust-grid">
            {trustPoints.map((point) => (
              <div key={point.label} className="trust-chip">
                {point.icon}
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell">
          <div className="home-section__heading">
            <span>Latest Parts</span>
            <h2>Newest Spare Parts Added To The Platform</h2>
            <p>These cards now come from the real parts data instead of sample vehicle cards.</p>
          </div>

          <div className="vehicle-grid">
            {latestParts.map((part) => (
              <article key={part._id} className="vehicle-card">
                <div className="vehicle-card__image">
                  <img src={part.image} alt={part.name} />
                </div>
                <div className="vehicle-card__body">
                  <h3>{part.name}</h3>
                  <p>{part.brand}</p>
                  <span>
                    {part.category} . Rs. {part.price}
                  </span>
                </div>
                <Link to="/parts" className="home-btn home-btn--primary vehicle-card__link">
                  Browse Parts
                </Link>
              </article>
            ))}
          </div>

          {latestParts.length === 0 && (
            <p className="home-empty-state">No parts available yet.</p>
          )}
        </div>
      </section>

      <section className="supplier-section">
        <div className="home-shell supplier-section__grid">
          <div className="supplier-section__image">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80"
              alt="Spare parts supplier"
            />
          </div>

          <div className="supplier-section__content">
            <span>For Suppliers</span>
            <h2>Are You A Spare Parts Supplier?</h2>
            <p>
              Join the platform, manage inventory, and connect with buyers
              searching for exact-fit parts for their vehicles.
            </p>
            <ul className="supplier-benefits">
              {supplierBenefits.map((benefit) => (
                <li key={benefit}>
                  <FaShieldHalved />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link to="/vendor-register" className="home-btn home-btn--primary">
              Register As Vendor
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-section--guides">
        <div className="home-shell">
          <div className="home-section__heading">
            <span>Auto Care Tips</span>
            <h2>Auto Care Tips & Guides</h2>
            <p>Showing the latest 3 real education articles from your system.</p>
          </div>

          <div className="guides-grid">
            {articles.map((article) => (
              <article key={article._id} className="guide-card">
                <div className="guide-card__image">
                  <img src={article.image_url} alt={article.title} />
                </div>
                <div className="guide-card__body">
                  <h3>{article.title}</h3>
                  <p>{article.shortDescription}</p>
                </div>
                <Link
                  to={`/education/${article._id}`}
                  className="home-btn home-btn--secondary guide-card__link"
                >
                  Read More <FaArrowRight />
                </Link>
              </article>
            ))}
          </div>

          {articles.length === 0 && (
            <p className="home-empty-state">No education articles available yet.</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
