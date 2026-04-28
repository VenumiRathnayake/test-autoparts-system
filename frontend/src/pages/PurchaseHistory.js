import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI, authHelper } from "../services/api";
import { FaHistory, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser } from "react-icons/fa";
import "../styles/Pages.css";

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userId = authHelper.getUserId();
        
        if (!userId) {
          setError("You must be logged in to view purchase history");
          navigate("/account");
          return;
        }

        const response = await orderAPI.getByUser(userId);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch purchase history");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };

    return (
      <span className={`badge ${statusClasses[status] || 'badge-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your purchase history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <FaHistory className="me-2" />
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <FaHistory className="me-3 text-primary" size={32} />
            <div>
              <h2 className="mb-0">Purchase History</h2>
              <p className="text-muted mb-0">View all your past orders and purchases</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-5">
              <FaHistory size={64} className="text-muted mb-3" />
              <h4 className="text-muted">No Orders Found</h4>
              <p className="text-muted">You haven't made any purchases yet.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/parts")}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="row">
              {orders.map((order) => (
                <div key={order._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Order #{order.orderNumber}</h6>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <small className="text-muted d-flex align-items-center">
                          <FaCalendarAlt className="me-2" />
                          {formatDate(order.createdAt)}
                        </small>
                      </div>
                      
                      <div className="mb-3">
                        <h6 className="mb-2">Items ({order.items.length})</h6>
                        <div className="order-items-preview">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                              <img 
                                src={item.part.image} 
                                alt={item.part.name}
                                className="me-2"
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                              <div className="flex-grow-1">
                                <small className="d-block fw-bold">{item.part.name}</small>
                                <small className="text-muted">LKR {item.price.toFixed(2)}</small>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <small className="text-muted">+{order.items.length - 2} more items</small>
                          )}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong className="text-primary">LKR {order.totalAmount.toFixed(2)}</strong>
                        </div>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <FaEye className="me-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Order #{selectedOrder.orderNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="mb-3">Shipping Information</h6>
                    <div className="shipping-details">
                      <p className="mb-2">
                        <FaUser className="me-2 text-muted" />
                        <strong>{selectedOrder.shippingDetails.name}</strong>
                      </p>
                      <p className="mb-2">
                        <FaMapMarkerAlt className="me-2 text-muted" />
                        {selectedOrder.shippingDetails.address}
                      </p>
                      <p className="mb-2">
                        <FaPhone className="me-2 text-muted" />
                        {selectedOrder.shippingDetails.phone}
                      </p>
                      <p className="mb-2">
                        <FaEnvelope className="me-2 text-muted" />
                        {selectedOrder.shippingDetails.email}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3">Order Information</h6>
                    <div className="order-info">
                      <p className="mb-2">
                        <FaCalendarAlt className="me-2 text-muted" />
                        <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                      </p>
                      <p className="mb-2">
                        <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}
                      </p>
                      <p className="mb-2">
                        <strong>Total Amount:</strong> LKR {selectedOrder.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <hr />

                <h6 className="mb-3">Order Items</h6>
                <div className="order-items-detail">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="d-flex align-items-center mb-3 p-3 border rounded">
                      <img 
                        src={item.part.image} 
                        alt={item.part.name}
                        className="me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.part.name}</h6>
                        <p className="mb-1 text-muted">{item.part.brand}</p>
                        <p className="mb-1 text-muted">Category: {item.part.category}</p>
                        <p className="mb-0 text-muted">Vendor: {item.part.vendor.businessName}</p>
                      </div>
                      <div className="text-end">
                        <p className="mb-1">Quantity: {item.quantity}</p>
                        <p className="mb-0 fw-bold text-primary">LKR {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
