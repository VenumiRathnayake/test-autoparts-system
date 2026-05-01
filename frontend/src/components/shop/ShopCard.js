import React from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/Components.css";

const ShopCard = ({ product, part }) => {
  const { addToCart } = useCart();
  const item = product || part;

  if (!item) {
    return <div className="product-card">Product not found</div>;
  }

  const isBackendData = item.vendor && typeof item.vendor === "object";
  const vendorName = isBackendData
    ? item.vendor.businessName || "Unknown Vendor"
    : item.vendor || "Unknown Vendor";
  const rating = item.rating || 4.0;
  const reviews = item.reviews || 0;
  const condition = item.condition || "new";
  const vehicle = item.vehicle || item.category || "General";

  const handleAddToCart = () => {
    if (item.status === "sold") {
      alert("This part is no longer available for purchase.");
      return;
    }

    const cartItem = {
      ...item,
      vendorName,
      condition,
      vehicle,
      rating,
      reviews,
    };

    addToCart(cartItem);

    const button = document.querySelector(
      `[data-item-id="${item._id || item.id}"]`
    );

    if (button) {
      const originalText = button.textContent;
      button.textContent = "Added!";
      button.classList.add("btn-success");
      button.classList.remove("btn-primary");
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("btn-success");
        button.classList.add("btn-primary");
        button.disabled = false;
      }, 2000);
    }
  };

  const StarRating = ({ value }) => {
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="star full">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="star empty">
            ★
          </span>
        ))}
        <span className="rating-value">{value.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {item.image ? (
          <img
            src={
              item.image.startsWith("http")
                ? item.image
                : `${process.env.PUBLIC_URL}${item.image}`
            }
            alt={item.name}
            className="img-fluid"
            onError={(event) => {
              event.target.style.display = "none";
              event.target.nextSibling.style.display = "block";
            }}
          />
        ) : null}

        <div
          className="image-placeholder"
          style={{ display: item.image ? "none" : "block" }}
        >
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
        <div className="product-card__eyebrow">Ready to Order</div>
        <h3>{item.name || "Part Name Not Available"}</h3>
        <p className="product-vehicle">{vehicle}</p>
        <p className="product-vendor">Sold by: {vendorName}</p>

        <div className="product-rating">
          <StarRating value={rating} />
          <span className="review-count">({reviews} reviews)</span>
        </div>

        <div className="product-price">
          <span className="price">Rs. {item.price}</span>
          {item.status === "sold" ? (
            <button className="btn btn-secondary btn-sm" disabled>
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
