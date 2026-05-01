import React, { useState } from "react";
import { BiLogoApple, BiLogoGoogle, BiStore, BiUser } from "react-icons/bi";
import { userAPI, vendorAPI, authHelper } from "../services/api";
import "../styles/Pages.css";

const Login = () => {
  const [activeTab, setActiveTab] = useState("user"); // Default to user tab
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check for admin login
    if (email === "admin@admin.com" && password === "admin") {
      authHelper.setAuthData("admin-token", "admin", "admin", email);
      window.location.href = "/admin/add-parts";
      return;
    }

    try {
      if (activeTab === "user") {
        // User login
        const response = await userAPI.login({ email, password });
        const { token, user } = response.data;
        authHelper.setAuthData(token, "user", user._id, email);
        window.location.href = "/";
      } else if (activeTab === "vendor") {
        // Vendor login
        const vendorResponse = await vendorAPI.login({ email, password });
        const { token, vendor } = vendorResponse.data;
        authHelper.setAuthData(token, "vendor", vendor._id, email);
        window.location.href = "/vendor/add-parts";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(""); // Clear error when switching tabs
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login Here...</h1>
        <p>Enter your credentials to access your account.</p>

        {/* Tab Navigation */}
        <div className="login-tabs mb-4">
          <div className="nav nav-tabs" id="loginTabs" role="tablist">
            <button
              className={`nav-link ${activeTab === "user" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("user")}
            >
              <BiUser className="me-2" />
              User
            </button>
            <button
              className={`nav-link ${activeTab === "vendor" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("vendor")}
            >
              <BiStore className="me-2" />
              Vendor
            </button>
          </div>
        </div>

        <form className="w-100" onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 text-start">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger text-start" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">
            {activeTab === "user" ? "User Login" : "Vendor Login"}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-outline-danger me-2 w-50">
              <BiLogoGoogle className="me-2" /> Sign in with Google
            </button>
            <button type="button" className="btn btn-outline-dark ms-2 w-50">
              <BiLogoApple className="me-2" /> Sign in with Apple
            </button>
          </div>

          <div className="text-center mt-4">
            {activeTab === "user" ? (
              <p>
                Don't have a user account?{" "}
                <a href="/register" className="text-primary">
                  Sign Up
                </a>
              </p>
            ) : (
              <p>
                Don't have a vendor account?{" "}
                <a href="/vendor-register" className="text-primary">
                  Sign Up
                </a>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
