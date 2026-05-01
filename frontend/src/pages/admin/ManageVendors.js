import React, { useState, useEffect } from "react";
import { vendorAPI } from "../../services/api";
import { authHelper } from "../../services/api";

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, approved, declined
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVendors();
  }, [filter]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filter === "all") {
        response = await vendorAPI.getAll();
      } else {
        response = await vendorAPI.getVendorsByStatus(filter);
      }
      
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setMessage("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId) => {
    try {
      const adminEmail = authHelper.getUserEmail() || "Admin";
      await vendorAPI.approveVendor(vendorId, adminEmail);
      setMessage("Vendor approved successfully!");
      fetchVendors();
    } catch (error) {
      console.error("Error approving vendor:", error);
      setMessage("Failed to approve vendor");
    }
  };

  const handleDecline = async (vendorId) => {
    if (window.confirm("Are you sure you want to decline this vendor?")) {
      try {
        const adminEmail = authHelper.getUserEmail() || "Admin";
        await vendorAPI.declineVendor(vendorId, adminEmail);
        setMessage("Vendor declined successfully!");
        fetchVendors();
      } catch (error) {
        console.error("Error declining vendor:", error);
        setMessage("Failed to decline vendor");
      }
    }
  };

  const handleDelete = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) {
      try {
        await vendorAPI.deleteVendor(vendorId);
        setMessage("Vendor deleted successfully!");
        fetchVendors();
      } catch (error) {
        console.error("Error deleting vendor:", error);
        setMessage("Failed to delete vendor");
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

  const filteredVendors = vendors.filter(vendor =>
    vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-manage-vendors container mt-5">
        <div className="text-center">
          <p>Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manage-vendors container mt-5">
      <h2>Manage Vendors</h2>
      
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              All ({vendors.length})
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
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Vendors List */}
      <div className="row">
        {filteredVendors.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <p>No vendors found.</p>
            </div>
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <div key={vendor._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{vendor.businessName}</h5>
                  {getStatusBadge(vendor.status)}
                </div>
                <div className="card-body">
                  <p className="card-text">
                    <strong>Owner:</strong> {vendor.ownerName}<br />
                    <strong>Email:</strong> {vendor.email}<br />
                    <strong>Mobile:</strong> {vendor.mobileNumber}<br />
                    <strong>Location:</strong> {vendor.outletLocation}<br />
                    <strong>Registration:</strong> {vendor.companyRegistrationNumber}
                  </p>
                  
                  {vendor.approvedAt && (
                    <p className="card-text">
                      <small className="text-muted">
                        {vendor.status === 'approved' ? 'Approved' : 'Declined'} on: {new Date(vendor.approvedAt).toLocaleDateString()}
                        {vendor.approvedBy && ` by ${vendor.approvedBy}`}
                      </small>
                    </p>
                  )}
                </div>
                <div className="card-footer">
                  <div className="d-flex gap-2 flex-wrap">
                    {vendor.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(vendor._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDecline(vendor._id)}
                        >
                          Decline
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(vendor._id)}
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
    </div>
  );
};

export default ManageVendors;
