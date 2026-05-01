import React, { useState } from "react";
import "../../styles/Components.css";

const ShippingFormModal = ({ show, handleClose, handleSubmit }) => {
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(shippingDetails); // Pass the details to parent component or API
    handleClose(); // Close the modal after submission
  };

  return (
    show && (
      <div className="shipping-form-model">
        <div className="modal show d-block shipping-modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shipping-modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Shipping Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="shipping-name">Full Name</label>
                    <input
                      id="shipping-name"
                      className="form-control"
                      type="text"
                      name="name"
                      value={shippingDetails.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="shipping-address">Shipping Address</label>
                    <input
                      id="shipping-address"
                      className="form-control"
                      type="text"
                      name="address"
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="shipping-phone">Phone Number</label>
                    <input
                      id="shipping-phone"
                      className="form-control"
                      type="text"
                      name="phone"
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="shipping-email">Email Address</label>
                    <input
                      id="shipping-email"
                      className="form-control"
                      type="email"
                      name="email"
                      value={shippingDetails.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <button className="btn btn-primary w-100" type="submit">
                    Proceed to Payment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ShippingFormModal;
