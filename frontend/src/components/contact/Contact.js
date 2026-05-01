import React from "react";

const Contact = () => {
  return (
    <form className="contact-form">
      <div className="form-row">
        <div className="mb-3 text-start left">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-control"
            placeholder="Enter your first name"
          />
        </div>
        <div className="mb-3 text-start right">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-control"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="mb-3 text-start left">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-3 text-start right">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="form-control"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      <div className="mb-4 text-start">
        <label htmlFor="message" className="form-label">
          What do you have in mind
        </label>
        <textarea
          id="message"
          name="message"
          className="form-control"
          placeholder="Enter your message"
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Send Message
      </button>
    </form>
  );
};

export default Contact;
