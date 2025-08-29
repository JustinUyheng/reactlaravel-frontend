import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./fasstyle/fasBudgetSnacks.css";
import { assets } from "../assets/assets";
import { useCart } from '../CartandOrder/userCart.js';
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

const FasBudgetmeals = () => {
  const [activePrice, setActivePrice] = useState(80);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const currentSets = activePrice === 80 ? SETS_80 : SETS_150;

  const handleAdd = (itemDetails, type) => {
    addToCart(itemDetails, type);
    const updatedCart = JSON.parse(localStorage.getItem('shoppingCart')) || { order: [], reserve: [] };
    const itemsOfType = updatedCart[type] || [];
    const totalItems = itemsOfType.reduce((sum, cartItem) => sum + (cartItem.quantity || 0), 0);
    toast.success(`Successfully added to ${type === 'order' ? 'Order' : 'Reserve'}! You have ${totalItems} item(s) in your ${type}.`);
  };

  const handleSetAction = (set, type) => {
    const itemDetails = {
      id: `set-${set.id}-${activePrice}`, // Unique ID including price tier
      name: `SET ${set.id} (${activePrice}/pax)`,
      price: parseFloat(activePrice),
      images: set.images, // For multi-image display in cart/order if needed
      image: set.images[0], // Primary image for cart display
      menu: set.items, // Use 'menu' for consistency if cart expects it, or 'items'
      category: 'Budget Meal Set'
    };
    handleAdd(itemDetails, type);
  };

  return (
    <div className="budget-container">

      <h3 className="breadcrumb">
        <span className="faspecc">FASPeCC</span> &gt; Budget Meals
      </h3>

      <div className="budget-tabs-and-icons-bar">
        <div className="price-tabs">
          {[80, 150].map((price) => (
            <span
              key={price}
              className={`price-tab ${price === activePrice ? "active" : ""}`}
              onClick={() => setActivePrice(price)}
            >
              {price}/pax
            </span>
          ))}
        </div>
        <div className="budget-action-icons">
          <img src={assets.clipboard} alt="Orders" title="Go to Orders" onClick={() => navigate('/orders')} />
          <img src={assets.bag} alt="Cart" title="Go to Cart" onClick={() => navigate('/cart')} />
        </div>
      </div>

      <div className="sets-grid">
        {currentSets.map((set) => (
          <div key={set.id} className="set-card">
            <div className="set-images">
              {set.images.slice(0, 4).map((src, i) => (
                <img key={i} src={src} alt={`Set ${set.id} pic ${i + 1}`} />
              ))}
            </div>
            <div className="set-details">
              <div>
                <p className="set-title">SET {set.id}</p>
                {set.items.map((line, i) => (
                  <p className="budget-menu-item-text" key={i}>{line}</p>
                ))}
              </div>
              <div className="budget-button-row">
                {/* onClick to use handlers */}
                <button onClick={() => handleSetAction(set, 'reserve')}>Reserve</button>
                <button onClick={() => handleSetAction(set, 'order')}>Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FasBudgetmeals;