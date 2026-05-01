import React, { useState } from "react";
import { vendorAPI } from "../services/api";
import "../styles/Pages.css";

const VendorRegister = () => {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [companyRegNo, setCompanyRegNo] = useState("");
  const [outletLocation, setOutletLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const vendorData = {
      businessName,
      ownerName,
      email,
      mobileNumber: mobile,
      companyRegistrationNumber: companyRegNo,
      outletLocation,
      password,
    };

    try {
      const response = await vendorAPI.register(vendorData);
      setSuccess("Vendor registered successfully!");
      setError("");
      
      // Redirect to login page after registration
      setTimeout(() => {
        window.location.href = "/account";
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Vendor Registration</h1>
        <p>Enter your business details to register as a vendor.</p>

        <form className="w-100" onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Business Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Owner Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter owner name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Company Registration Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter company registration number"
              value={companyRegNo}
              onChange={(e) => setCompanyRegNo(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Outlet Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter outlet location"
              value={outletLocation}
              onChange={(e) => setOutletLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 text-start">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger text-start" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success text-start" role="alert">
              {success}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">
            Register Vendor
          </button>

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-primary">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorRegister;
