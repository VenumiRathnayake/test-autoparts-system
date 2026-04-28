import React from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/Components.css";

const ShopCard = ({ product, part }) => {
  const { addToCart } = useCart();
  
  // Use either product or part prop
  const item = product || part;
  
  // Debug log to see what data we're receiving
  console.log('ShopCard received item:', item);
  
  // Check if item exists
  if (!item) {
    return <div className="product-card">Product not found</div>;
  }

  // Handle both mock data and backend data structures
  const isBackendData = item.vendor && typeof item.vendor === 'object';
  
  // Extract vendor name - could be string (mock) or object (backend)
  const vendorName = isBackendData ? item.vendor.businessName || 'Unknown Vendor' : item.vendor || 'Unknown Vendor';
  
  // Default values for missing fields
  const rating = item.rating || 4.0;
  const reviews = item.reviews || 0;
  const condition = item.condition || 'new';
  const vehicle = item.vehicle || item.category || 'General';

  // Handle add to cart
  const handleAddToCart = () => {
    // Check if part is available (not sold)
    if (item.status === 'sold') {
      alert('This part is no longer available for purchase.');
      return;
    }

    const cartItem = {
      ...item,
      vendorName: vendorName,
      condition: condition,
      vehicle: vehicle,
      rating: rating,
      reviews: reviews
    };
    addToCart(cartItem);
    
    // Show success message
    const button = document.querySelector(`[data-item-id="${item._id || item.id}"]`);
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Added!';
      button.classList.add('btn-success');
      button.classList.remove('btn-primary');
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        button.disabled = false;
      }, 2000);
    }
  };
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">
            ★
          </span>
        ))}
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {item.image ? (
          <img 
            src={item.image.startsWith('http') ? item.image : `${process.env.PUBLIC_URL}${item.image}`} 
            alt={item.name} 
            className="img-fluid"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div className="image-placeholder" style={{ display: item.image ? 'none' : 'block' }}>
          <span>{item.name}</span>
        </div>
        <span
          className={`product-condition ${condition
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {condition}
        </span>
      </div>

              <div className="product-details">
        <h3>{item.name || 'Part Name Not Available'}</h3>
        <p className="product-vehicle">{vehicle}</p>
        <p className="product-vendor">Sold by: {vendorName}</p>

        <div className="product-rating">
          <StarRating rating={rating} />
          <span className="review-count">({reviews} reviews)</span>
        </div>

        <div className="product-price">
          <span className="price">Rs. {item.price}</span>
          {item.status === 'sold' ? (
            <button 
              className="btn btn-secondary btn-sm" 
              disabled
            >
              Sold Out
            </button>
          ) : (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={handleAddToCart}
              data-item-id={item._id || item.id}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
