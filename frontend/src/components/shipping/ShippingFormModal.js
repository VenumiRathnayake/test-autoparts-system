import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
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
    <div className="shipping-form-model">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Shipping Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={shippingDetails.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Proceed to Payment
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ShippingFormModal;
