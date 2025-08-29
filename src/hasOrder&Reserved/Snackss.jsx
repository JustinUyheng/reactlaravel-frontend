// Snackss.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './hasstyle/Snackss.css';
import { assets } from "../assets/assets";
import { useCart } from '../CartandOrder/userCart.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mealsData = [
  { name: 'Beef patty burger', price: 25, image: assets.food_1 },
  { name: 'Chicken fillet burger', price: 40, image: assets.food_2 },
  { name: 'Chicken fillet with rice', price: 50, image: assets.food_3 },
  { name: 'Spam Rice Toppings', price: 55, image: assets.food_4 },
  { name: 'chicken longganisa hamongado rice toppings', price: 50, image: assets.food_5 },
  { name: 'Soriso with Rice', price: 55, image: assets.food_6 },
  { name: 'Siomai', price: 20, image: assets.food_7 },
  { name: 'Siopao', price: 25, image: assets.food_8 },
];

const drinksData = [
  { name: 'Mountain Dew', price: 20, image: assets.drink_1 },
  { name: 'Coke', price: 25, image: assets.drink_2 },
  { name: 'Cali', price: 25, image: assets.drink_3 },
  { name: 'Bottled Water', price: 15, image: assets.drink_4 },
];

const Snackss = () => {
  const [activeTab, setActiveTab] = useState('Meals');
  const navigate = useNavigate();
  const dataToShow = activeTab === 'Meals' ? mealsData : drinksData;
  const { addToCart, cart } = useCart();

  const handleAdd = (item, type) => {
    addToCart(item, type);
    const updatedCart = JSON.parse(localStorage.getItem('shoppingCart'));
    const totalItems = updatedCart[type].reduce((sum, item) => sum + item.quantity, 0);
    toast.success(`Successfully added to ${type === 'order' ? 'Order' : 'Reserve'}! You have ${totalItems} item(s) in your ${type}.`);
  };

  return (
    <div className="snacks-container">

      <div className="breadcrumb-line">
        <h3 className="breadcrumb">
          <span className="faspecc">France Bistro</span> &gt; Snacks
        </h3>
      </div>

      <div className="tabs-bar">
        <div className="tabs">
          <span className={`tab ${activeTab === 'Meals' ? 'active' : ''}`} onClick={() => setActiveTab('Meals')}>
            Meals
          </span>
          <span className={`tab ${activeTab === 'Drinks' ? 'active' : ''}`} onClick={() => setActiveTab('Drinks')}>
            Drinks
          </span>
        </div>
        <div className="icon-buttons">
          <img src={assets.clipboard} alt="Orders" title="Go to Orders" onClick={() => navigate('/orders')} />
          <img src={assets.bag} alt="Cart" title="Go to Cart" onClick={() => navigate('/cart')} />
        </div>
      </div>

      <div className="snack-grid">
        {dataToShow.map((item, index) => (
          <div className="snack-card" key={index}>
            <img src={item.image} alt={item.name} className="snack-img" />
            <div className="snack-info">
              <p className="snack-name">{item.name}</p>
              <p className="snack-price">₱ {item.price}</p>
              <div className="button-row">
                <button onClick={() => handleAdd(item, 'reserve')}>Reserve</button>
                <button onClick={() => handleAdd(item, 'order')}>Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Snackss;
