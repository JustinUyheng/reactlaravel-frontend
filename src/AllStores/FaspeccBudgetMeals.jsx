import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllStyles/FaspeccBudgetMeals.css"; // Ensure this path is correct
import { assets } from "../assets/assets"; // Ensure this path is correct
import { useCart } from '../CartandOrder/userCart.js'; // Ensure this path is correct
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SETS_80 = [
  {
    id: "A",
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_6],
    items: ["Fried Chicken", "Bihon", "Rice", "Bottled Water 350ml"]
  },
  {
    id: "B",
    images: [assets.food_4, assets.food_5, assets.food_6, assets.food_6],
    items: ["Fried Fish", "Pinakbet", "Rice", "Bottled Water 350ml"]
  }
];

const SETS_150 = [
  {
    id: "C",
    images: [assets.food_2, assets.food_4, assets.food_1, assets.food_6],
    items: ["Chicken Teriyaki", "Fried Spring Roll", "Rice", "Bottled Water 350ml"]
  },
  {
    id: "D",
    images: [assets.food_5, assets.food_3, assets.food_6, assets.food_6],
    items: ["Daing", "Sauteed Veggies", "Rice", "Bottled Water 350ml"]
  }
];

const FaspeccBudgetMeals = () => {
  const [activePrice, setActivePrice] = useState(80);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const currentSets = activePrice === 80 ? SETS_80 : SETS_150;

  const handleAdd = (itemDetails, type) => {
    addToCart(itemDetails, type); // type will be 'reserve'
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

    const itemsOfType = updatedCart.reserve; // Directly use reserve
    const totalItems = itemsOfType.reduce((sum, cartItem) => sum + (cartItem.quantity || 0), 0);
    toast.success(`Successfully added to Reserve! You have ${totalItems} item(s) in your reservation list.`);
  };

  const handleSetAction = (set, type) => { // type will be 'reserve'
    const itemDetails = {
      id: `set-${set.id}-${activePrice}`,
      name: `SET ${set.id} (${activePrice}/pax)`,
      price: parseFloat(activePrice),
      images: set.images,
      image: set.images && set.images.length > 0 ? set.images[0] : (assets.defaultFoodImage || undefined),
      menu: set.items,
      category: 'Budget Meal Set'
    };
    handleAdd(itemDetails, type);
  };

  return (
    <div className="fbm-page-container">
      <h3 className="breadcrumb">
        <span className="fbm-brand-name">FASPeCC</span> &gt; Budget Meals
      </h3>

      <div className="fbm-controls-bar">
        <div className="fbm-price-tabs">
          {[80, 150].map((price) => (
            <span
              key={price}
              className={`fbm-price-tab ${price === activePrice ? "active" : ""}`}
              onClick={() => setActivePrice(price)}
            >
              {price}/pax
            </span>
          ))}
        </div>
        <div className="fbm-action-icons">
          <img src={assets.clipboard} alt="Orders" title="Go to Orders" onClick={() => navigate('/orders')} />
          <img src={assets.bag} alt="Cart" title="Go to Cart" onClick={() => navigate('/cart')} />
        </div>
      </div>

      <div className="fbm-sets-grid">
        {currentSets.map((set) => (
          <div key={set.id} className="fbm-set-card">
            <div className="fbm-set-card-images">
              {set.images && set.images.slice(0, 4).map((src, i) => (
                <img key={i} src={src || (assets.defaultFoodImage || undefined)} alt={`Set ${set.id} pic ${i + 1}`} />
              ))}
            </div>
            <div className="fbm-set-card-details">
              <div>
                <p className="fbm-set-card-title">SET {set.id}</p>
                {set.items && set.items.map((line, i) => (
                  <p className="fbm-set-card-menu-item" key={i}>{line}</p>
                ))}
              </div>
              <div className="fbm-set-card-actions">
                <button onClick={() => handleSetAction(set, 'reserve')}>Reserve</button>
                {/* Order button is definitively removed here */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaspeccBudgetMeals;