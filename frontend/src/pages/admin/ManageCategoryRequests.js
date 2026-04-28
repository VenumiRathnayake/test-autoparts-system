import React, { useState, useEffect } from "react";
import { categoryRequestAPI } from "../../services/api";
import { authHelper } from "../../services/api";

const ManageCategoryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, approved, declined
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await categoryRequestAPI.getAll(filter === "all" ? null : filter);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setMessage("Failed to load category requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const adminEmail = authHelper.getUserEmail() || "Admin";
      await categoryRequestAPI.approve(requestId, adminResponse, adminEmail);
      setMessage("Category request approved successfully!");
      setSelectedRequest(null);
      setAdminResponse("");
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      setMessage("Failed to approve request");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const adminEmail = authHelper.getUserEmail() || "Admin";
      await categoryRequestAPI.decline(requestId, adminResponse, adminEmail);
      setMessage("Category request declined successfully!");
      setSelectedRequest(null);
      setAdminResponse("");
      fetchRequests();
    } catch (error) {
      console.error("Error declining request:", error);
      setMessage("Failed to decline request");
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await categoryRequestAPI.delete(requestId);
        setMessage("Category request deleted successfully!");
        fetchRequests();
      } catch (error) {
        console.error("Error deleting request:", error);
        setMessage("Failed to delete request");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge bg-warning",
      approved: "badge bg-success",
      declined: "badge bg-danger"
    };
    
    const statusText = {
      pending: "Pending",
      approved: "Approved",
      declined: "Declined"
    };

    return (
      <span className={statusClasses[status]}>
        {statusText[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-manage-category-requests container mt-5">
        <div className="text-center">
          <p>Loading category requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manage-category-requests container mt-5">
      <h2>Manage Category Requests</h2>
      
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              All ({requests.length})
            </button>
            <button
              type="button"
              className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              type="button"
              className={`btn ${filter === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
            <button
              type="button"
              className={`btn ${filter === 'declined' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilter('declined')}
            >
              Declined
            </button>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="row">
        {requests.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <p>No category requests found.</p>
            </div>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{request.categoryName}</h5>
                  {getStatusBadge(request.status)}
                </div>
                <div className="card-body">
                  <p className="card-text">
                    <strong>Vendor:</strong> {request.vendor?.businessName}<br />
                    <strong>Owner:</strong> {request.vendor?.ownerName}<br />
                    <strong>Email:</strong> {request.vendor?.email}<br />
                    <strong>Location:</strong> {request.vendor?.location}<br />
                    <strong>Description:</strong> {request.description || "No description"}
                  </p>
                  
                  {request.processedAt && (
                    <p className="card-text">
                      <small className="text-muted">
                        {request.status === 'approved' ? 'Approved' : 'Declined'} on: {new Date(request.processedAt).toLocaleDateString()}
                        {request.processedBy && ` by ${request.processedBy}`}
                      </small>
                    </p>
                  )}
                  
                  {request.adminResponse && (
                    <p className="card-text">
                      <strong>Admin Response:</strong> {request.adminResponse}
                    </p>
                  )}
                </div>
                <div className="card-footer">
                  <div className="d-flex gap-2 flex-wrap">
                    {request.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          Decline
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(request._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Approve/Decline */}
      {selectedRequest && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedRequest.status === 'pending' ? 'Process Request' : 'Request Details'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setSelectedRequest(null);
                    setAdminResponse("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Category:</strong> {selectedRequest.categoryName}</p>
                <p><strong>Vendor:</strong> {selectedRequest.vendor?.businessName}</p>
                <p><strong>Description:</strong> {selectedRequest.description || "No description"}</p>
                
                {selectedRequest.status === 'pending' && (
                  <div className="mb-3">
                    <label className="form-label">Admin Response (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Enter your response to the vendor..."
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleApprove(selectedRequest._id)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDecline(selectedRequest._id)}
                    >
                      Decline
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedRequest(null);
                    setAdminResponse("");
                  }}
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

export default ManageCategoryRequests;
