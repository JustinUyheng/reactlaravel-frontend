// FranceBistroCategory.jsx
import React from 'react';
import './AllStyles/FranceCategory.css'; // Updated CSS import
import { assets } from "../assets/assets"; // Make sure this path is correct

const FranceCategory = () => { // Renamed component
  const categories = [
    { id: 'france-bistro-buffet', label: 'Buffet', image: assets.budget, link: '/choice-france-bistro-buffet' },
    { id: 'france-bistro-budgetmeals', label: 'Budget Meals', image: assets.buffets, link: '/choice-france-bistro-budget-meals' },
    { id: 'france-bistro-budgetsnacks', label: 'Budget Snacks', image: assets.budgetmealss, link: '/choice-france-bistro-budget-snacks' },
    { id: 'france-bistro-snacks', label: 'Snacks', image: assets.snacks, link: '/choice-france-bistro-snacks' },
  ];

  return (
    <div className="france-bistro-cat-page-container"> {/* New className */}
      <h3 className="france-bistro-cat-breadcrumb"> {/* New className */}
        <span className="france-bistro-cat-brand-name">France Bistro</span> &gt; Cafeteria {/* Updated text & New className */}
      </h3>
      <div className="france-bistro-cat-grid"> {/* New className */}
        {categories.map((item) => (
          <a href={item.link} key={item.id} className="france-bistro-cat-card"> {/* New className */}
            <img src={item.image} alt={item.label} className="france-bistro-cat-img" /> {/* New className */}
            <div className="france-bistro-cat-label">{item.label}</div> {/* New className */}
          </a>
        ))}
      </div>
      <div className="france-bistro-cat-caption"> {/* New className */}
        <h2>Your Favorite Bites,</h2>
        <p>Just a Click Away!</p>
      </div>
    </div>
  );
};

export default FranceCategory;