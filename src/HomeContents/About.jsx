import React from 'react';
import './style/About.css';
import { assets } from '../assets/assets';

const Abouts = () => {
  return (
    <div className="about-us-container">
      <h2 className="about-title">About Us</h2>

      <div className="about-section yellow-bg">
        <div className="about-text">
          Welcome to USTP Food Corner, your ultimate guide to campus dining! We make it easy for students to explore food stalls, check out available menus, and discover the best eats around USTP.
        </div>
        <img src={assets.cafe} alt="Dining Area" className="about-image" />
      </div>

      <div className="about-section white-bg">
        <div className="about-full-width-text">
          For just ₱19.00 per semester, you get full access to store listings and menu details—helping you plan your meals without the guesswork!
        </div>
      </div>

      <div className="about-section yellow-bg">
        <img src={assets.pods} alt="Delicious Food" className="about-image round" />
        <div className="about-text">
          Whether you're looking for a quick snack or a hearty meal, USTP Food Corner keeps you connected to the best food choices on campus.
        </div>
      </div>

      <div className="about-section white-bg">
        <div className="about-footer-text">
          Great food. Zero hassle. Only at USTP Food Corner!
        </div>
      </div>
    </div>

  );
};

export default Abouts;