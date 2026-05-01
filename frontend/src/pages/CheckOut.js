import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShippingFormModal from "../components/shipping/ShippingFormModal";
import { useCart } from "../context/CartContext";
import { partsAPI, orderAPI, authHelper } from "../services/api";
import "../styles/Pages.css";

const CheckoutPage = () => {
  const [showModal, setShowModal] = useState(true);
  const [shippingDetails, setShippingDetails] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price),
    0
  );

  const handleShippingSubmit = (details) => {
    setShippingDetails(details);
    setShowModal(false);
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError("");

      // Check if user is logged in
      const userId = authHelper.getUserId();
      if (!userId) {
        throw new Error("You must be logged in to complete the purchase");
      }

      // Extract part IDs from cart items
      const partIds = cartItems
        .filter(item => item._id) // Only include items with _id (backend parts)
        .map(item => item._id);

      if (partIds.length === 0) {
        throw new Error("No valid parts found in cart");
      }

      // Prepare order data
      const orderItems = cartItems
        .filter(item => item._id)
        .map(item => ({
          part: item._id,
          quantity: 1,
          price: parseFloat(item.price)
        }));

      const orderData = {
        user: userId,
        items: orderItems,
        shippingDetails: shippingDetails,
        totalAmount: totalPrice
      };

      console.log('Order data being sent:', orderData);

      // Create order record
      const orderResponse = await orderAPI.create(orderData);

      // Mark all parts as sold in the database
      await partsAPI.markMultipleAsSold(partIds);

      // Clear the cart
      clearCart();

      // Show success message with order number and redirect
      alert(`Purchase successful! Order #${orderResponse.data.orderNumber} has been created. The parts have been marked as sold and removed from inventory.`);
      navigate("/history");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to complete the purchase. Please try again.");
      console.error("Checkout error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {/* Shipping Modal */}
      <ShippingFormModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSubmit={handleShippingSubmit}
      />

      {/* Show checkout details after shipping is submitted */}
      {shippingDetails && (
        <div className="checkout-details">
          <div className="row">
            <div className="col-md-6">
              <h3>Shipping Information</h3>
              <div className="shipping-info p-3 border rounded">
                <p><strong>Name:</strong> {shippingDetails.name}</p>
                <p><strong>Address:</strong> {shippingDetails.address}</p>
                <p><strong>Phone:</strong> {shippingDetails.phone}</p>
                <p><strong>Email:</strong> {shippingDetails.email}</p>
              </div>
            </div>
            
            <div className="col-md-6">
              <h3>Order Summary</h3>
              <div className="order-summary p-3 border rounded">
                <div className="order-items">
                  {cartItems.map((item, index) => (
                    <div key={item.id || index} className="order-item d-flex justify-content-between mb-2">
                      <span>{item.name}</span>
                      <span>Rs.{item.price}</span>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-primary">Rs.{totalPrice.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}

          <div className="mt-4">
            <button
              className="btn btn-primary w-100"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Purchase"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
