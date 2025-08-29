import React from 'react';
import './AllStyles/FaspeccCategory.css';
import { assets } from "../assets/assets"; // Make sure this path is correct

const FaspeccCategory = () => {
  const categories = [
    { id: 'faspecc-buffet', label: 'Buffet', image: assets.budget, link: '/choice-faspecc-buffet' },
    { id: 'faspecc-budgetmeals', label: 'Budget Meals', image: assets.buffets, link: '/choice-faspecc-budget-meals' },
    { id: 'faspecc-budgetsnacks', label: 'Budget Snacks', image: assets.budgetmealss, link: '/choice-faspecc-budget-snacks' },
    { id: 'faspecc-snacks', label: 'Snacks', image: assets.snacks, link: '/choice-faspecc-snacks' },
  ];

  return (
    <div className="faspecc-category-page-container">
      <h3 className="breadcrumb">
        <span className="faspecc-brand-name">FASPeCC</span> &gt; Cafeteria
      </h3>
      <div className="faspecc-category-grid">
        {categories.map((item) => (
          <a href={item.link} key={item.id} className="faspecc-category-card">
            <img src={item.image} alt={item.label} className="faspecc-category-img" />
            <div className="faspecc-category-label">{item.label}</div>
          </a>
        ))}
      </div>
      <div className="faspecc-category-caption">
        <h2>Your Favorite Bites,</h2>
        <p>Just a Click Away!</p>
      </div>
    </div>
  );
};

export default FaspeccCategory;