// FranceSnacks.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllStyles/FranceSnacks.css'; // Your existing CSS for FranceSnacks
import { assets } from "../assets/assets"; // Assuming assets path is correct
import { useCart } from '../CartandOrder/userCart.js'; // Assuming useCart path is correct
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

const FranceSnacks = () => {
  const [activeTab, setActiveTab] = useState('Meals');
  const navigate = useNavigate();
  const dataToShow = activeTab === 'Meals' ? mealsData : drinksData;
  const { addToCart } = useCart();

  const handleAddReserve = (item) => {
    const type = 'reserve';
    addToCart(item, type);
    const updatedCart = JSON.parse(localStorage.getItem('shoppingCart'));
    const totalItems = (updatedCart && updatedCart[type])
      ? updatedCart[type].reduce((sum, cartItem) => sum + cartItem.quantity, 0)
      : 0;
    toast.success(`Successfully added to Reserve! You have ${totalItems} item(s) in your reserve list.`);
  };

  return (
    <div className="fr-snack-container">

      <div className="fr-snack-breadcrumb-trail">
        <h3 className="fr-snack-breadcrumb-text">
          <span className="fr-snack-bistro-name">France Bistro</span> &gt; Snacks
        </h3>
      </div>

      <div className="fr-snack-navigation-bar">
        <div className="fr-snack-category-tabs">
          <span
            className={`fr-snack-category-tab ${activeTab === 'Meals' ? 'fr-snack-tab-active' : ''}`}
            onClick={() => setActiveTab('Meals')}
          >
            Meals
          </span>
          <span
            className={`fr-snack-category-tab ${activeTab === 'Drinks' ? 'fr-snack-tab-active' : ''}`}
            onClick={() => setActiveTab('Drinks')}
          >
            Drinks
          </span>
        </div>
        <div className="fr-snack-action-icons">
          {/* Order icon restored below */}
          <img
            src={assets.clipboard} /* Assuming assets.clipboard is your order icon */
            alt="Orders"
            title="Go to Orders"
            onClick={() => navigate('/orders')}
          />
          <img
            src={assets.bag} /* Assuming assets.bag is your cart/reserve icon */
            alt="Cart/Reserve"
            title="Go to Cart/Reserve"
            onClick={() => navigate('/cart')}
          />
        </div>
      </div>

      <div className="fr-snack-item-layout">
        {dataToShow.map((item, index) => (
          <div className="fr-snack-item-card" key={index}>
            <img src={item.image} alt={item.name} className="fr-snack-item-image" />
            <div className="fr-snack-item-details">
              <p className="fr-snack-item-name">{item.name}</p>
              <p className="fr-snack-item-price">₱ {item.price}</p>
              <div className="fr-snack-action-buttons">
                <button onClick={() => handleAddReserve(item)}>Reserve</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FranceSnacks;