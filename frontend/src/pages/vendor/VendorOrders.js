import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI, authHelper } from "../../services/api";
import { 
  FaShoppingBag, 
  FaEye, 
  FaCalendarAlt, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaTruck,
  FaBox
} from "react-icons/fa";
import "../../styles/Pages.css";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const vendorId = authHelper.getUserId();
        
        if (!vendorId) {
          setError("You must be logged in to view orders");
          navigate("/account");
          return;
        }

        const response = await orderAPI.getByVendor(vendorId);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await orderAPI.updateStatus(orderId, newStatus);
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Update selected order if it's the same one
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
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
    const statusConfig = {
      pending: { class: 'badge-warning', icon: FaBox, text: 'Pending' },
      processing: { class: 'badge-info', icon: FaCheck, text: 'Processing' },
      shipped: { class: 'badge-primary', icon: FaTruck, text: 'Shipped' },
      delivered: { class: 'badge-success', icon: FaCheck, text: 'Delivered' },
      cancelled: { class: 'badge-danger', icon: FaTimes, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`badge ${config.class}`}>
        <IconComponent className="me-1" />
        {config.text}
      </span>
    );
  };

  const getStatusActions = (order) => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          <button
            key="accept"
            className="btn btn-success btn-sm me-2"
            onClick={() => handleStatusUpdate(order._id, 'processing')}
            disabled={updatingStatus}
          >
            <FaCheck className="me-1" />
            Accept Order
          </button>
        );
        actions.push(
          <button
            key="cancel"
            className="btn btn-danger btn-sm"
            onClick={() => handleStatusUpdate(order._id, 'cancelled')}
            disabled={updatingStatus}
          >
            <FaTimes className="me-1" />
            Cancel
          </button>
        );
        break;
      case 'processing':
        actions.push(
          <button
            key="ship"
            className="btn btn-primary btn-sm me-2"
            onClick={() => handleStatusUpdate(order._id, 'shipped')}
            disabled={updatingStatus}
          >
            <FaTruck className="me-1" />
            Mark as Shipped
          </button>
        );
        break;
      case 'shipped':
        actions.push(
          <button
            key="deliver"
            className="btn btn-success btn-sm"
            onClick={() => handleStatusUpdate(order._id, 'delivered')}
            disabled={updatingStatus}
          >
            <FaCheck className="me-1" />
            Mark as Delivered
          </button>
        );
        break;
      default:
        // No actions for delivered or cancelled orders
        break;
    }
    
    return actions;
  };

  const getVendorItems = (order) => {
    const vendorId = authHelper.getUserId();
    return order.items.filter(item => 
      item.part.vendor._id === vendorId
    );
  };

  const getVendorTotal = (order) => {
    const vendorItems = getVendorItems(order);
    return vendorItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
              <p className="mt-3">Loading your orders...</p>
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
              <FaShoppingBag className="me-2" />
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
            <FaShoppingBag className="me-3 text-primary" size={32} />
            <div>
              <h2 className="mb-0">Order Management</h2>
              <p className="text-muted mb-0">Manage orders for your parts</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-5">
              <FaShoppingBag size={64} className="text-muted mb-3" />
              <h4 className="text-muted">No Orders Found</h4>
              <p className="text-muted">You don't have any orders yet.</p>
            </div>
          ) : (
            <div className="row">
              {orders.map((order) => {
                const vendorItems = getVendorItems(order);
                const vendorTotal = getVendorTotal(order);
                
                if (vendorItems.length === 0) return null; // Skip orders with no vendor items
                
                return (
                  <div key={order._id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm order-card">
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
                          <h6 className="mb-2">Customer: {order.user.name}</h6>
                          <p className="mb-1 text-muted">{order.user.email}</p>
                        </div>

                        <div className="mb-3">
                          <h6 className="mb-2">Your Items ({vendorItems.length})</h6>
                          <div className="order-items-preview">
                            {vendorItems.slice(0, 2).map((item, index) => (
                              <div key={index} className="d-flex align-items-center mb-2">
                                <img 
                                  src={item.part.image} 
                                  alt={item.part.name}
                                  className="me-2"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div className="flex-grow-1">
                                  <small className="d-block fw-bold">{item.part.name}</small>
                                  <small className="text-muted">Qty: {item.quantity} × LKR {item.price.toFixed(2)}</small>
                                </div>
                              </div>
                            ))}
                            {vendorItems.length > 2 && (
                              <small className="text-muted">+{vendorItems.length - 2} more items</small>
                            )}
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <strong className="text-primary">LKR {vendorTotal.toFixed(2)}</strong>
                          </div>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <FaEye className="me-1" />
                            View Details
                          </button>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                          {getStatusActions(order)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content order-details-modal">
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
                    <h6 className="mb-3">Customer Information</h6>
                    <div className="customer-details">
                      <p className="mb-2">
                        <FaUser className="me-2 text-muted" />
                        <strong>{selectedOrder.user.name}</strong>
                      </p>
                      <p className="mb-2">
                        <FaEnvelope className="me-2 text-muted" />
                        {selectedOrder.user.email}
                      </p>
                    </div>

                    <h6 className="mb-3 mt-4">Shipping Information</h6>
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
                        <strong>Your Total:</strong> LKR {getVendorTotal(selectedOrder).toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4">
                      <h6 className="mb-3">Status Actions</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {getStatusActions(selectedOrder)}
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                <h6 className="mb-3">Your Items in This Order</h6>
                <div className="order-items-detail">
                  {getVendorItems(selectedOrder).map((item, index) => (
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

export default VendorOrders;
