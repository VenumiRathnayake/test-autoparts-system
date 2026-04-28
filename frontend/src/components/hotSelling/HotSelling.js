// components/hotSelling/HotSelling.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/Components.css";
import { partsAPI } from "../../services/api";

const HotSelling = () => {
  const [hotProducts, setHotProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await partsAPI.getTop();
        setHotProducts(res.data || []);
      } catch (e) {
        setError("Failed to load hot selling parts");
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  return (
    <section className="hot-selling section bg-light">
      <div className="container">
        <div className="section-header">
          <h2>Hot Selling Parts</h2>
          <p>Most popular parts our customers are buying</p>
        </div>
        
        {loading ? (
          <div className="products-grid"><div>Loading...</div></div>
        ) : error ? (
          <div className="products-grid"><div>{error}</div></div>
        ) : (
          <div className="products-grid">
            {hotProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.image.startsWith('http') ? product.image : `${process.env.PUBLIC_URL}${product.image}`} 
                    alt={product.name} 
                    className="img-fluid"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      e.target.src = `${process.env.PUBLIC_URL}/assets/images/hero-1.jpg`;
                    }}
                  />
                  <span className={`product-condition ${product.status}`}>
                    {product.status}
                  </span>
                </div>
                
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="product-vendor">Sold by: {product.vendor?.businessName || ""}</p>
                  
                  <div className="product-price">
                    <span className="price">LKR {Number(product.price).toLocaleString()}</span>
                    <Link to={`/parts/${product._id}`} className="btn btn-primary btn-sm">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="view-all-container">
          <Link to="/parts" className="btn btn-outline">
            View All Parts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HotSelling;