import React from "react";
import Contact from "../components/contact/Contact";

const ContactUs = () => {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <h1>Get in Touch</h1>
        <p>
          We'd love to hear from you! Please fill out the form below and let us
          know how we can assist you.
        </p>
        <Contact />
      </div>
    </div>
  );
};

export default ContactUs;
