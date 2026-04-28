import React, { useState } from "react";
import { userAPI } from "../services/api";
import "../styles/Pages.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await userAPI.register({ name, email, password });
      console.log("User registered:", response.data);
      setSuccess(true);

      // Redirect to login page after successful registration
      setTimeout(() => {
        window.location.href = "/account";
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Register Here...</h1>
        <p>Create your account by filling in the details below.</p>

        <form className="w-100" onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
          {success && (
            <div className="alert alert-success text-start" role="alert">
              Account created successfully! Redirecting...
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <a href="/account" className="text-primary">
                Login
              </a>
            </p>
          </div>
          <div className="text-center mt-4">
            <p>
              Don’t have an vendor account?{" "}
              <a href="/vendor-register" className="text-primary">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
