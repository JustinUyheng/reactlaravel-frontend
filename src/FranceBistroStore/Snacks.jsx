import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './frabstyle/Snacks.css'; // Ensure this path is correct
import { assets } from "../assets/assets"; // Ensure this path is correct and assets.edit, assets.bin are defined

const mealsData = [
  { id: 'meal-1', name: 'Beef patty burger', price: 25, image: assets.food_1 },
  { id: 'meal-2', name: 'Chicken fillet burger', price: 40, image: assets.food_2 },
  { id: 'meal-3', name: 'Chicken fillet with rice', price: 50, image: assets.food_3 },
  { id: 'meal-4', name: 'Spam Rice Toppings', price: 55, image: assets.food_4 },
  { id: 'meal-5', name: 'chicken longganisa hamongado rice toppings', price: 50, image: assets.food_5 },
  { id: 'meal-6', name: 'Soriso with Rice', price: 55, image: assets.food_6 },
  { id: 'meal-7', name: 'Siomai', price: 20, image: assets.food_7 },
  { id: 'meal-8', name: 'Siopao', price: 25, image: assets.food_8 },
];

const drinksData = [
  { id: 'drink-1', name: 'Mountain Dew', price: 20, image: assets.drink_1 }, // Assuming assets.drink_1 to assets.drink_4 are defined
  { id: 'drink-2', name: 'Coke', price: 25, image: assets.drink_2 },
  { id: 'drink-3', name: 'Cali', price: 25, image: assets.drink_3 },
  { id: 'drink-4', name: 'Bottled Water', price: 15, image: assets.drink_4 },
];

const Snacks = () => {
  const [activeTab, setActiveTab] = useState('Meals');
  const dataToShow = activeTab === 'Meals' ? mealsData : drinksData;

  return (
    <div className="snacks-container">

      <div className="breadcrumb-line">
        <h3 className="breadcrumb">
          <span className="faspecc">France Bistro</span> &gt; Snacks
        </h3>
        <Link to="/vendor-add-items" className="record-link">Records</Link>
      </div>

      <div className="tabs-bar">
        <div className="tabs">
          <span
            className={`tab ${activeTab === 'Meals' ? 'active' : ''}`}
            onClick={() => setActiveTab('Meals')}
          >
            Meals
          </span>
          <span
            className={`tab ${activeTab === 'Drinks' ? 'active' : ''}`}
            onClick={() => setActiveTab('Drinks')}
          >
            Drinks
          </span>
        </div>
      </div>

      <div className="snack-grid">
        {dataToShow.map((item) => (
          <div className="snack-card" key={item.id}> {/* Using unique item.id as key */}
            <img src={item.image} alt={item.name} className="snack-img" />
            <div className="snack-info">
              <p className="snack-name">{item.name}</p>
              <p className="snack-price">₱ {item.price}</p>
            </div>
            <div className="card-actions">
              <img src={assets.edit} alt="Edit" className="action-icon" />
              <img src={assets.bin} alt="Delete" className="action-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Snacks;