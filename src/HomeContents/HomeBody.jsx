// HomeBody.jsx
import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import "./style/HomeBody.css";

const Body = () => (
  <div className='header'>
    <div className="header-contents">
      <h2>Good Food, Great Vibes—</h2>
      <h2>Right Here at USTP!</h2>
      <h3>Skip the ‘ano meron diyan?’ </h3>
      <h3>moment—get full menu access!</h3>
      <h3>A well-fed student is a happy student!</h3>
    </div>
  </div>
);

const FavoriteBites = () => (
  <div className="container">
    <div className="favoritebites">
      <h3>Your Favorite Bites,</h3>
      <p>Just a Click Away!</p>
    </div>
  </div>
);

const DailyDeals = () => (
  <div className="food-display">
    <h4 className='daily'>Daily Deals on USTP Food Corner</h4>
    <div className="food-display-list">
      {[{ img: assets.chickenfillet, name: "Chicken fillet with rice" },
      { img: assets.kutsinta, name: "Kutsinta" },
      { img: assets.budgetmeal, name: "Budget Meal" },
      { img: assets.minutemaid, name: "Minute Maid" }
      ].map((item, i) => (
        <div className="deals-grid" key={i}>
          <img className='profile-picture' src={item.img} alt={item.name} />
          <p className='name'>{item.name}</p>
        </div>
      ))}
    </div>
  </div>
);

const Bottom = () => (
  <div className="bottom">
    <h1 className='flavor'>You bring the flavor, we handle the detail!</h1>
    <div className="continue2-content">
      <div className='contents'>
        <h2 className='first'>List your store or shop on USTP Food Corner</h2>
        <p className='second'>
          Would you like thousands of new customers/students to enjoy your amazing food and drinks? So would we!
        </p>
        <p className='third'>It's simple. We list your menu and products online, help you boost your sales - all in a heartbeat!</p>
        <p className='fourth'>Interested? Let’s start our partnership today!</p>
        <Link to="/get-started"><button className="button">Get Started</button></Link>
      </div>
    </div>
  </div>
);

const HomeBody = () => {
  return (
    <>
      <Body />
      <FavoriteBites />
      <DailyDeals />
      <Bottom />

      {/* Footer directly placed here without using a const */}
      <footer className="footer">
        <p>© 2025 USTP Food Corner. All rights reserved.</p>
      </footer>
    </>
  );
};

export default HomeBody;
