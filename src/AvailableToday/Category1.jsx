// Category1.jsx
import React from 'react';
import './CategoryStyle/category1.css';
import { assets } from "../assets/assets";
import { Link } from 'react-router-dom'; // Import Link

const Category1 = () => {
  const categories = [
    { id: 'store-buffet', label: 'Buffet', image: assets.budget, link: '/france-bistro-buffets' },
    { id: 'store-budgetmeals', label: 'Budget Meals', image: assets.buffets, link: '/france-bistro-budget-meals' },
    { id: 'store-budgetsnacks', label: 'Budget Snacks', image: assets.budgetmealss, link: '/france-bistro-budget-snacks' },
    { id: 'store-snacks', label: 'Snacks', image: assets.snacks, link: '/france-bistro-snacks' },
  ];

  return (
    <div className="store1-page-container">
      <h3 className="breadcrumb">
        <span className="faspecc">France Bistro</span> &gt; Cafeteria
      </h3>

      <div className="store1-category-grid">
        {categories.map((item) => (
          // Use Link component here
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

export default Category1;