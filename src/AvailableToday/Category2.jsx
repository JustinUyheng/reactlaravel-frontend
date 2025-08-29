import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryStyle/category2.css';
import { assets } from "../assets/assets";

const Category2 = () => {
  const categories = [
    { id: 'store-buffet', label: 'Buffet', image: assets.budget, link: '/faspecc-budget-buffet' },
    { id: 'store-budgetmeals', label: 'Budget Meals', image: assets.buffets, link: '/faspecc-budget-meals' },
    { id: 'store-budgetsnacks', label: 'Budget Snacks', image: assets.budgetmealss, link: '/faspecc-budget-snacks' },
    { id: 'store-snacks', label: 'Snacks', image: assets.snacks, link: '/faspecc-snacks' },
  ];

  return (
    <div className="store1-page-container">
      <h3 className="breadcrumb">
        <span className="faspecc">FASPeCC</span> &gt; Cafeteria
      </h3>

      <div className="store1-category-grid">
        {categories.map((item) => (
          // Use Link component for navigation
          <Link to={item.link} key={item.id} className="store1-category-card">
            <img src={item.image} alt={item.label} className="store1-category-img" />
            <div className="store1-category-label">{item.label}</div>
          </Link>
        ))}
      </div>

      <div className="store1-caption">
        <h2>Your Favorite Bites,</h2>
        <p>Just a Click Away!</p>
      </div>
    </div>
  );
};

export default Category2;