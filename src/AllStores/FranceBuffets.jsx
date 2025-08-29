// FranceBuffets.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllStyles/FranceBuffets.css'; // Updated CSS import path
import { assets } from "../assets/assets"; // Ensure this path is correct
import { useCart } from '../CartandOrder/userCart.js'; // Ensure this path is correct
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const options300 = [
  {
    id: 'fb-buffet300-opt1', // Updated ID
    title: 'OPTION 1',
    menu: ['Buttered Chicken', 'Fish Escabeche', 'Four Seasons', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'fb-buffet300-opt2', // Updated ID
    title: 'OPTION 2',
    menu: ['Pork Humba', 'Fish Fillet', 'Pinakbet', 'Rice', 'Drinks of your choice'],
    images: [assets.food_5, assets.food_6, assets.food_7, assets.food_8],
  },
  {
    id: 'fb-buffet300-opt3', // Updated ID
    title: 'OPTION 3',
    menu: ['Beef Steak', 'Chicken Cordon Bleu', 'Chopseuy', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'fb-buffet300-opt4', // Updated ID
    title: 'OPTION 4',
    menu: ['Grilled Porkchop', 'Calamares', 'Four Seasons', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'fb-buffet300-opt5', // Updated ID
    title: 'OPTION 5',
    menu: ['Beef Steak', 'Fish Fillet', 'Four Seasons', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'fb-buffet300-opt6', // Updated ID
    title: 'OPTION 6',
    menu: ['Chicken Bisaya Adobo', 'Calamares', 'Hot and Spicy Spare Ribs', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
];

const options350 = [
  {
    id: 'fb-buffet350-opt1', // Updated ID
    title: 'OPTION 1 (350)',
    menu: ['Buttered Chicken Deluxe', 'Fish Escabeche Special', 'Four Seasons Deluxe', 'Garlic Rice', 'Premium Drinks'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'fb-buffet350-opt2', title: 'OPTION 2', menu: ['Pork Humba Supreme', 'Fish Fillet with Tartar', 'Pinakbet with Lechon Kawali', 'Java Rice', 'Premium Drinks'], images: [assets.food_5, assets.food_6, assets.food_7, assets.food_8], // Updated ID
  },
  {
    id: 'fb-buffet350-opt3', title: 'OPTION 3', menu: ['Beef Steak Tagalog', 'Chicken Cordon Bleu Supreme', 'Chopseuy Special', 'Plain Rice', 'Premium Drinks'], images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4], // Updated ID
  },
  {
    id: 'fb-buffet350-opt4', title: 'OPTION 4', menu: ['Grilled Porkchop with Gravy', 'Crispy Calamares', 'Four Seasons Salad', 'Steamed Rice', 'Premium Drinks'], images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4], // Updated ID
  },
  {
    id: 'fb-buffet350-opt5', title: 'OPTION 5', menu: ['Beef Steak Ranchero', 'Fish Fillet in Lemon Butter', 'Mixed Green Salad', 'Dinner Rolls', 'Premium Drinks'], images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4], // Updated ID
  },
  {
    id: 'fb-buffet350-opt6', title: 'OPTION 6', menu: ['Chicken Bisaya Adobo Flakes', 'Spicy Calamares', 'Hot and Spicy Spare Ribs Glazed', 'Kimchi Rice', 'Premium Drinks'], images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4], // Updated ID
  },
];

const drinks = [
  { id: 'fb-drink-iced-tea', name: 'Iced Tea', price: 20, image: assets.drink_1 }, // Updated ID
  { id: 'fb-drink-soft-drinks', name: 'Soft Drinks', price: 25, image: assets.drink_2 }, // Updated ID
  { id: 'fb-drink-minute-maid', name: 'Minute Maid', price: 30, image: assets.drink_3 }, // Updated ID
  { id: 'fb-drink-water-500ml', name: 'Water 500ml', price: 15, image: assets.drink_4 }, // Updated ID
];

const FranceBuffets = () => { // Renamed component
  const [activeSet, setActiveSet] = useState('300');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const currentOptions = activeSet === '300' ? options300 : options350;

  const handleAdd = (itemDetails, type) => { // type will always be 'reserve' here
    addToCart(itemDetails, type);
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

    const itemsOfType = type === 'order' ? updatedCart.order : updatedCart.reserve; // Will use updatedCart.reserve
    const totalItems = itemsOfType.reduce((sum, cartItem) => sum + (cartItem.quantity || 0), 0);
    toast.success(`Successfully added to Reserve! You have ${totalItems} item(s) in your reservation list.`);
  };

  const handleBuffetAction = (buffetOption, actionType) => { // actionType is 'reserve'
    const itemDetails = {
      id: buffetOption.id,
      name: `${buffetOption.title} (${activeSet}/pax)`,
      price: parseFloat(activeSet),
      images: buffetOption.images,
      image: buffetOption.images && buffetOption.images.length > 0 ? buffetOption.images[0] : undefined,
      menu: buffetOption.menu,
      category: 'Buffet Set'
    };
    handleAdd(itemDetails, actionType);
  };

  const handleDrinkAction = (drinkItem, actionType) => { // actionType is 'reserve'
    const itemDetails = {
      id: drinkItem.id,
      name: drinkItem.name,
      price: drinkItem.price,
      image: drinkItem.image,
      category: 'Drink'
    };
    handleAdd(itemDetails, actionType);
  };

  return (
    <div className="fb-buffet-page-wrapper"> {/* New ClassName */}
      <div className="fb-buffet-content-area"> {/* New ClassName */}
        <h3 className="fb-buffet-breadcrumb"> {/* New ClassName */}
          <span className="fb-buffet-brand-name">France Bistro</span> &gt; Buffet {/* Updated Text & New ClassName */}
        </h3>

        <div className="fb-buffet-controls-bar"> {/* New ClassName */}
          <div className="fb-buffet-price-tabs"> {/* New ClassName */}
            <span
              className={`fb-buffet-price-tab ${activeSet === '300' ? 'active' : ''}`} /* New ClassName */
              onClick={() => setActiveSet('300')}
            >
              300/pax
            </span>
            <span
              className={`fb-buffet-price-tab ${activeSet === '350' ? 'active' : ''}`} /* New ClassName */
              onClick={() => setActiveSet('350')}
            >
              350/pax
            </span>
          </div>
          <div className="fb-buffet-action-icons"> {/* New ClassName */}
            <img src={assets.clipboard} alt="Orders" title="Go to Orders" onClick={() => navigate('/orders')} /> {/* Order Icon Retained */}
            <img src={assets.bag} alt="Cart" title="Go to Cart" onClick={() => navigate('/cart')} />
          </div>
        </div>

        <div className="fb-buffet-options-grid"> {/* New ClassName */}
          {currentOptions.map((opt) => (
            <div className="fb-buffet-option-card" key={opt.id}> {/* New ClassName */}
              <div className="fb-buffet-option-card-images"> {/* New ClassName */}
                {opt.images && opt.images.slice(0, 4).map((imgSrc, i) => (
                  <img key={i} src={imgSrc} alt={`${opt.title} pic ${i + 1}`} />
                ))}
              </div>
              <div className="fb-buffet-option-card-details"> {/* New ClassName */}
                <div>
                  <p className="fb-buffet-option-card-title">{opt.title}</p> {/* New ClassName */}
                  {opt.menu && opt.menu.map((item, idx) => (
                    <p className="fb-buffet-option-card-menu-item" key={idx}>{item}</p> /* New ClassName */
                  ))}
                </div>
                <div className="fb-buffet-option-card-actions"> {/* New ClassName */}
                  <button onClick={() => handleBuffetAction(opt, 'reserve')}>Reserve</button>
                  {/* Order button removed */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fb-buffet-drinks-title">CHOICES OF DRINKS</div> {/* New ClassName */}
        <div className="fb-buffet-drinks-grid"> {/* New ClassName */}
          {drinks.map((drink) => (
            <div className="fb-buffet-drink-card" key={drink.id}> {/* New ClassName */}
              <img src={drink.image} alt={drink.name} className="fb-buffet-drink-card-img" /> {/* New ClassName */}
              <div className="fb-buffet-drink-card-info"> {/* New ClassName */}
                <p className="fb-buffet-drink-card-name">{drink.name}</p> {/* New ClassName */}
                <p className="fb-buffet-drink-card-price">₱{drink.price}</p> {/* New ClassName */}
              </div>
              <div className="fb-buffet-drink-card-actions"> {/* New ClassName */}
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

export default FranceBuffets;