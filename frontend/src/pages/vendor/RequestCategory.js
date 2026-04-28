import React, { useState, useEffect } from "react";
import { categoryRequestAPI } from "../../services/api";
import { authHelper } from "../../services/api";

const RequestCategory = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("new"); // "new" or "history"

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const vendorId = authHelper.getUserId();
      if (vendorId) {
        const response = await categoryRequestAPI.getByVendor(vendorId);
        setRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categoryName.trim()) {
      setMessage("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const vendorId = authHelper.getUserId();
      
      const requestData = {
        ...formData,
        vendorId: vendorId
      };

      await categoryRequestAPI.create(requestData);
      setMessage("Category request submitted successfully!");
      setFormData({ categoryName: "", description: "" });
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Error submitting request:", error);
      setMessage(error.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
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

  return (
    <div className="vendor-request-category container mt-5">
      <h2>Category Request</h2>
      
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "new" ? "active" : ""}`}
            onClick={() => setActiveTab("new")}
          >
            New Request
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Request History
          </button>
        </li>
      </ul>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {activeTab === "new" && (
        <div className="card">
          <div className="card-header">
            <h5>Request New Category</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter category name (e.g., BMW, Toyota, Honda)"
                  required
                />
                <div className="form-text">
                  Enter the name of the category you want to request (e.g., car brand name)
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Describe why you need this category or any additional information..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="card">
          <div className="card-header">
            <h5>Request History</h5>
          </div>
          <div className="card-body">
            {requests.length === 0 ? (
              <p className="text-muted">No requests found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Admin Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request._id}>
                        <td>{request.categoryName}</td>
                        <td>{request.description || "No description"}</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                        <td>
                          {request.adminResponse || "No response yet"}
                          {request.processedBy && (
                            <small className="d-block text-muted">
                              by {request.processedBy}
                            </small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCategory;
