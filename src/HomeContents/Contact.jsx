import React from 'react';
import './style/Contact.css';
import { assets } from '../assets/assets';


const Contact = () => {
  return (
    <div className="contact-container" id='contact-us'>
      <h2 className="contact-title">Contact Us</h2>
      <img src={assets.drone} alt="USTP Campus" className="contact-banner" />

      <div className="contact-info">
        <div className="contact-card">
          <img src={assets.place} className="contact-icon" />
          <p>Come explore the best food spots on campus!</p>
          <span className="highlight">USTP Cafeteria/CEA building, 2nd floor</span>
        </div>

        <div className="contact-card">
          <img src={assets.phone} className="contact-icon" />
          <p>Got questions?<br />Give us a ring!</p>
          <span className="highlight">09164326190</span>
        </div>

        <div className="contact-card">
          <img src={assets.email} className="contact-icon" />
          <p>Drop us a message!</p>
          <span className="highlight">crausus.christinee@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;