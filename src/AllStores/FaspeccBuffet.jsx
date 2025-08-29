import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllStyles/FaspeccBuffet.css'; // Ensure this path is correct
import { assets } from "../assets/assets"; // Ensure this path is correct
import { useCart } from '../CartandOrder/userCart.js'; // Ensure this path is correct
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const options300 = [
  {
    id: 'buffet300-opt1',
    title: 'OPTION 1',
    menu: ['Buttered Chicken', 'Fish Escabeche', 'Four Seasons', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet300-opt2',
    title: 'OPTION 2',
    menu: ['Pork Humba', 'Fish Fillet', 'Pinakbet', 'Rice', 'Drinks of your choice'],
    images: [assets.food_5, assets.food_6, assets.food_7, assets.food_8],
  },
  {
    id: 'buffet300-opt3',
    title: 'OPTION 3',
    menu: ['Beef Steak', 'Chicken Cordon Bleu', 'Chopseuy', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet300-opt4',
    title: 'OPTION 4',
    menu: ['Grilled Porkchop', 'Calamares', 'Four Seasons', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet300-opt5',
    title: 'OPTION 5',
    menu: ['Beef Steak', 'Fish Fillet', 'Four Seasons', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet300-opt6',
    title: 'OPTION 6',
    menu: ['Chicken Bisaya Adobo', 'Calamares', 'Hot and Spicy Spare Ribs', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
];

const options350 = [
  {
    id: 'buffet350-opt1',
    title: 'OPTION 1 (350)',
    menu: ['Buttered Chicken Deluxe', 'Fish Escabeche Special', 'Four Seasons Deluxe', 'Garlic Rice', 'Premium Drinks'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
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
  { id: 'drink-iced-tea', name: 'Iced Tea', price: 20, image: assets.drink_1 },
  { id: 'drink-soft-drinks', name: 'Soft Drinks', price: 25, image: assets.drink_2 },
  { id: 'drink-minute-maid', name: 'Minute Maid', price: 30, image: assets.drink_3 },
  { id: 'drink-water-500ml', name: 'Water 500ml', price: 15, image: assets.drink_4 },
];

const FaspeccBuffet = () => {
  const [activeSet, setActiveSet] = useState('300');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const currentOptions = activeSet === '300' ? options300 : options350;

  // The 'type' parameter in handleAdd is now only 'reserve' effectively for this component
  const handleAdd = (itemDetails, type) => {
    addToCart(itemDetails, type); // 'type' will be 'reserve'
    let updatedCart = { order: [], reserve: [] };
    try {
      const storedCart = localStorage.getItem('shoppingCart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        updatedCart.order = Array.isArray(parsedCart.order) ? parsedCart.order : [];
        updatedCart.reserve = Array.isArray(parsedCart.reserve) ? parsedCart.reserve : [];
      }
    } catch (error) {
      console.error("Error parsing shoppingCart from localStorage:", error);
    }

    // Since only 'reserve' is used, this logic simplifies, but kept general for now
    const itemsOfType = type === 'order' ? updatedCart.order : updatedCart.reserve;
    const totalItems = itemsOfType.reduce((sum, cartItem) => sum + (cartItem.quantity || 0), 0);
    toast.success(`Successfully added to Reserve! You have ${totalItems} item(s) in your reservation list.`);
  };

  const handleBuffetAction = (buffetOption, type) => { // 'type' will always be 'reserve'
    const itemDetails = {
      id: buffetOption.id,
      name: `${buffetOption.title} (${activeSet}/pax)`,
      price: parseFloat(activeSet),
      images: buffetOption.images,
      image: buffetOption.images && buffetOption.images.length > 0 ? buffetOption.images[0] : undefined,
      menu: buffetOption.menu,
      category: 'Buffet Set'
    };
    handleAdd(itemDetails, type);
  };

  const handleDrinkAction = (drinkItem, type) => { // 'type' will always be 'reserve'
    const itemDetails = {
      id: drinkItem.id,
      name: drinkItem.name,
      price: drinkItem.price,
      image: drinkItem.image,
      category: 'Drink'
    };
    handleAdd(itemDetails, type);
  };

  return (
    <div className="buffetss-page-wrapper">
      <div className="buffetss-content-area">
        <h3 className="breadcrumb">
          <span className="buffetss-brand-name">FASPeCC</span> &gt; Buffet
        </h3>

        <div className="buffetss-controls-bar">
          <div className="buffetss-price-tabs">
            <span
              className={`buffetss-price-tab ${activeSet === '300' ? 'active' : ''}`}
              onClick={() => setActiveSet('300')}
            >
              300/pax
            </span>
            <span
              className={`buffetss-price-tab ${activeSet === '350' ? 'active' : ''}`}
              onClick={() => setActiveSet('350')}
            >
              350/pax
            </span>
          </div>
          <div className="buffetss-action-icons">
            <img src={assets.clipboard} alt="Orders" title="Go to Orders" onClick={() => navigate('/orders')} />
            <img src={assets.bag} alt="Cart" title="Go to Cart" onClick={() => navigate('/cart')} />
          </div>
        </div>

        <div className="buffetss-options-grid">
          {currentOptions.map((opt) => (
            <div className="buffetss-option-card" key={opt.id}>
              <div className="buffetss-option-card-images">
                {opt.images && opt.images.slice(0, 4).map((imgSrc, i) => (
                  <img key={i} src={imgSrc} alt={`${opt.title} pic ${i + 1}`} />
                ))}
              </div>
              <div className="buffetss-option-card-details">
                <div>
                  <p className="buffetss-option-card-title">{opt.title}</p>
                  {opt.menu && opt.menu.map((item, idx) => (
                    <p className="buffetss-option-card-menu-item" key={idx}>{item}</p>
                  ))}
                </div>
                <div className="buffetss-option-card-actions">
                  <button onClick={() => handleBuffetAction(opt, 'reserve')}>Reserve</button>
                  {/* Order button removed */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="buffetss-drinks-title">CHOICES OF DRINKS</div>
        <div className="buffetss-drinks-grid">
          {drinks.map((drink) => (
            <div className="buffetss-drink-card" key={drink.id}>
              <img src={drink.image} alt={drink.name} className="buffetss-drink-card-img" />
              <div className="buffetss-drink-card-info">
                <p className="buffetss-drink-card-name">{drink.name}</p>
                <p className="buffetss-drink-card-price">₱{drink.price}</p>
              </div>
              <div className="buffetss-drink-card-actions">
                <button onClick={() => handleDrinkAction(drink, 'reserve')}>Reserve</button>
                {/* Order button removed */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaspeccBuffet;