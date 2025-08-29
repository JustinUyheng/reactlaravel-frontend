import React from 'react';
import './storestyle/store1.css';
import { assets } from "../assets/assets";

const store1 = () => {
  const categories = [
    { id: 'store-buffet', label: 'Buffet', image: assets.budget, link: '/buffetss' },
    { id: 'store-budgetmeals', label: 'Budget Meals', image: assets.buffets, link: '/budget-mealss' },
    { id: 'store-budgetsnacks', label: 'Budget Snacks', image: assets.budgetmealss, link: '/budget-snackss' },
    { id: 'store-snacks', label: 'Snacks', image: assets.snacks, link: '/snackss' },

  ];

  return (
    <div className="store1-page-container">

      <h3 className="breadcrumb">
        <span className="faspecc">France Bistro</span> &gt; Cafeteria
      </h3>

      <div className="store1-category-grid">
        {categories.map((item) => (
          <a href={item.link} key={item.id} className="store1-category-card">
            <img src={item.image} alt={item.label} className="store1-category-img" />
            <div className="store1-category-label">{item.label}</div>
          </a>
        ))}
      </div>

      <div className="store1-caption">
        <h2>Your Favorite Bites,</h2>
        <p>Just a Click Away!</p>
      </div>
    </div>
  );
};

export default store1;