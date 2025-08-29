import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './hasstyle/Buffetss.css';
import { assets } from "../assets/assets";
import { useCart } from '../CartandOrder/userCart.js'; // ADDED
import { toast } from 'react-toastify';                 // ADDED
import 'react-toastify/dist/ReactToastify.css';      // ADDED

// Data with added unique 'id' fields
const options300 = [
  {
    id: 'buffet300-opt1', // ADDED ID
    title: 'OPTION 1',
    menu: ['Buttered Chicken', 'Fish Escabeche', 'Four Seasons', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet300-opt2', // ADDED ID
    title: 'OPTION 2',
    menu: ['Pork Humba', 'Fish Fillet', 'Pinakbet', 'Rice', 'Drinks of your choice'],
    images: [assets.food_5, assets.food_6, assets.food_7, assets.food_8],
  },
  {
    id: 'buffet300-opt3', // ADDED ID
    title: 'OPTION 3',
    menu: ['Beef Steak', 'Chicken Cordon Bleu', 'Chopseuy', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet300-opt4', // ADDED ID
    title: 'OPTION 4',
    menu: ['Grilled Porkchop', 'Calamares', 'Four Seasons', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet300-opt5', // ADDED ID
    title: 'OPTION 5',
    menu: ['Beef Steak', 'Fish Fillet', 'Four Seasons', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet300-opt6', // ADDED ID
    title: 'OPTION 6',
    menu: ['Chicken Bisaya Adobo', 'Calamares', 'Hot and Spicy Spare Ribs', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
];

const options350 = [
  {
    id: 'buffet350-opt1', // ADDED ID
    title: 'OPTION 1 (350)',
    menu: ['Buttered Chicken Deluxe', 'Fish Escabeche Special', 'Four Seasons Deluxe', 'Garlic Rice', 'Premium Drinks'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  // ... Add unique IDs to other options350 items similarly ...
  {
    id: 'buffet350-opt2', title: 'OPTION 2', menu: ['Pork Humba Supreme', 'Fish Fillet with Tartar', 'Pinakbet with Lechon Kawali', 'Java Rice', 'Premium Drinks'], images: [assets.food_5, assets.food_6, assets.food_7, assets.food_8],
  },
  {
    id: 'buffet350-opt3', title: 'OPTION 3', menu: ['Beef Steak Tagalog', 'Chicken Cordon Bleu Supreme', 'Chopseuy Special', 'Plain Rice', 'Premium Drinks'], images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet350-opt4', title: 'OPTION 4', menu: ['Grilled Porkchop with Gravy', 'Crispy Calamares', 'Four Seasons Salad', 'Steamed Rice', 'Premium Drinks'], images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet350-opt5', title: 'OPTION 5', menu: ['Beef Steak Ranchero', 'Fish Fillet in Lemon Butter', 'Mixed Green Salad', 'Dinner Rolls', 'Premium Drinks'], images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet350-opt6', title: 'OPTION 6', menu: ['Chicken Bisaya Adobo Flakes', 'Spicy Calamares', 'Hot and Spicy Spare Ribs Glazed', 'Kimchi Rice', 'Premium Drinks'], images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
];

const drinks = [
  { id: 'drink-iced-tea', name: 'Iced Tea', price: 20, image: assets.drink_1 }, // ADDED ID
  { id: 'drink-soft-drinks', name: 'Soft Drinks', price: 25, image: assets.drink_2 }, // ADDED ID
  { id: 'drink-minute-maid', name: 'Minute Maid', price: 30, image: assets.drink_3 }, // ADDED ID
  { id: 'drink-water-500ml', name: 'Water 500ml', price: 15, image: assets.drink_4 }, // ADDED ID
];

const Buffetss = () => {
  const [activeSet, setActiveSet] = useState('300');
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ADDED
  const currentOptions = activeSet === '300' ? options300 : options350;

  // ADDED handleAdd function (mirrors Snackss.jsx)
  const handleAdd = (itemDetails, type) => {
    addToCart(itemDetails, type);
    const updatedCart = JSON.parse(localStorage.getItem('shoppingCart')) || { order: [], reserve: [] };
    const itemsOfType = updatedCart[type] || [];
    const totalItems = itemsOfType.reduce((sum, cartItem) => sum + (cartItem.quantity || 0), 0);
    toast.success(`Successfully added to ${type === 'order' ? 'Order' : 'Reserve'}! You have ${totalItems} item(s) in your ${type}.`);
  };

  // UPDATED handler for buffet options
  const handleBuffetAction = (buffetOption, type) => {
    const itemDetails = {
      id: buffetOption.id, // Use the predefined unique ID from data
      name: `${buffetOption.title} (${activeSet}/pax)`,
      price: parseFloat(activeSet),
      images: buffetOption.images, // For multi-image display in cart/order if needed
      image: buffetOption.images[0], // Primary image for cart display consistency with snacks
      menu: buffetOption.menu,
      category: 'Buffet Set'
    };
    handleAdd(itemDetails, type);
  };

  // UPDATED handler for drinks
  const handleDrinkAction = (drinkItem, type) => {
    const itemDetails = {
      id: drinkItem.id, // Use the predefined unique ID
      name: drinkItem.name,
      price: drinkItem.price,
      image: drinkItem.image,
      category: 'Drink'
    };
    handleAdd(itemDetails, type);
  };

  return (
    <div className="buffet-container-wrapper">

      <div className="buffet-content-main">
        {/* Breadcrumb structure as provided in your last message for Buffetss.jsx */}
        <h3 className="breadcrumb">
          <span className="faspecc">France Bistro</span> &gt; Buffet
        </h3>

        <div className="buffet-tabs-actions-bar">
          <div className="buffet-price-selector-tabs">
            <span
              className={`buffet-price-selector-tab ${activeSet === '300' ? 'active' : ''}`}
              onClick={() => setActiveSet('300')}
            >
              300/pax
            </span>
            <span
              className={`buffet-price-selector-tab ${activeSet === '350' ? 'active' : ''}`}
              onClick={() => setActiveSet('350')}
            >
              350/pax
            </span>
          </div>
          <div className="buffet-page-action-icons">
            <img src={assets.clipboard} alt="Orders" title="Go to Orders" onClick={() => navigate('/orders')} />
            <img src={assets.bag} alt="Cart" title="Go to Cart" onClick={() => navigate('/cart')} />
          </div>
        </div>

        <div className="buffet-options-display-grid">
          {currentOptions.map((opt) => ( // Using opt.id for key
            <div className="buffet-set-card" key={opt.id}> {/* Use unique ID for key */}
              <div className="buffet-set-images">
                {opt.images.slice(0, 4).map((imgSrc, i) => (
                  <img key={i} src={imgSrc} alt={`${opt.title} pic ${i + 1}`} />
                ))}
              </div>
              <div className="buffet-set-details">
                <div>
                  <p className="buffet-set-title">{opt.title}</p>
                  {opt.menu.map((item, idx) => (
                    <p className="buffet-menu-item-text" key={idx}>{item}</p>
                  ))}
                </div>
                <div className="buffet-button-row">
                  {/* UPDATED onClick to use new handlers */}
                  <button onClick={() => handleBuffetAction(opt, 'reserve')}>Reserve</button>
                  <button onClick={() => handleBuffetAction(opt, 'order')}>Order</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="buffet-drinks-section-title">CHOICES OF DRINKS</div>
        <div className="buffet-drinks-display-grid">
          {drinks.map((drink) => ( // Using drink.id for key
            <div className="buffet-drink-item-card" key={drink.id}> {/* Use unique ID for key */}
              <img src={drink.image} alt={drink.name} className="buffet-drink-item-card-img" />
              <div className="buffet-drink-item-card-info">
                <p className="buffet-drink-item-card-name">{drink.name}</p>
                <p className="buffet-drink-item-card-price">₱{drink.price}</p>
              </div>
              <div className="buffet-drink-button-row">
                {/* UPDATED onClick to use new handlers */}
                <button onClick={() => handleDrinkAction(drink, 'reserve')}>Reserve</button>
                <button onClick={() => handleDrinkAction(drink, 'order')}>Order</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buffetss;