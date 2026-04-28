import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Pages.css";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="cart-page container">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Your Shopping Cart</h2>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h4>Your cart is empty!</h4>
              <p>Add some parts to get started.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/parts")}
              >
                Browse Parts
              </button>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-8">
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item mb-3 p-3 border rounded">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          {item.image ? (
                            <img 
                              src={item.image.startsWith('http') ? item.image : `${process.env.PUBLIC_URL}${item.image}`} 
                              alt={item.name} 
                              className="img-fluid rounded"
                              style={{ maxHeight: '80px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '80px' }}>
                              <span className="text-muted">{item.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="text-muted mb-1">Brand: {item.brand || 'N/A'}</p>
                          <p className="text-muted mb-1">Vendor: {item.vendorName || 'N/A'}</p>
                          <p className="text-muted mb-0">Condition: {item.condition || 'N/A'}</p>
                        </div>
                        <div className="col-md-2 text-center">
                          <span className="fw-bold text-primary">Rs.{item.price}</span>
                        </div>
                        <div className="col-md-2 text-center">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="cart-summary p-3 border rounded">
                  <h5 className="mb-3">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Items ({cartItems.length}):</span>
                    <span>Rs.{total.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong className="text-primary">Rs.{total.toFixed(2)}</strong>
                  </div>
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => navigate("/parts")}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
