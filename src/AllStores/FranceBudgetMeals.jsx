// FranceBudgetMeals.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllStyles/FranceBudgetMeals.css"; // Updated CSS import path
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

const FranceBudgetMeals = () => { // Renamed component
  const [activePrice, setActivePrice] = useState(80);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Assuming useCart might be a Zustand store or similar for .getState()
  const currentSets = activePrice === 80 ? SETS_80 : SETS_150;

  const handleAdd = (itemDetails, type) => { // type will be 'reserve'
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

    const itemsOfType = updatedCart.reserve; // Directly use reserve
    const totalItems = itemsOfType.reduce((sum, cartItem) => sum + (cartItem.quantity || 0), 0);
    toast.success(`Successfully added to Reserve! You have ${totalItems} item(s) in your reservation list.`);
  };

  const handleSetAction = (set, actionType) => { // actionType will be 'reserve'
    const itemDetails = {
      id: `set-${set.id}-${activePrice}`,
      name: `SET ${set.id} (${activePrice}/pax)`,
      price: parseFloat(activePrice),
      images: set.images,
      image: set.images && set.images.length > 0 ? set.images[0] : (assets.defaultFoodImage || undefined),
      menu: set.items,
      category: 'Budget Meal Set'
    };
    handleAdd(itemDetails, actionType);
  };

  return (
    <div className="fr-bml-page-container"> {/* New ClassName */}
      <h3 className="fr-bml-breadcrumb"> {/* New ClassName */}
        <span className="fr-bml-brand-name">France Bistro</span> &gt; Budget Meals {/* Updated Text & New ClassName */}
      </h3>

      <div className="fr-bml-controls-bar"> {/* New ClassName */}
        <div className="fr-bml-price-tabs"> {/* New ClassName */}
          {[80, 150].map((price) => (
            <span
              key={price}
              className={`fr-bml-price-tab ${price === activePrice ? "active" : ""}`} /* New ClassName */
              onClick={() => setActivePrice(price)}
            >
              {price}/pax
            </span>
          ))}
        </div>
        <div className="fr-bml-action-icons"> {/* New ClassName */}
          <img src={assets.clipboard} alt="Orders" title="Go to Orders" onClick={() => navigate('/orders')} />
          <img src={assets.bag} alt="Cart" title="Go to Cart" onClick={() => navigate('/cart')} />
        </div>
      </div>

      <div className="fr-bml-sets-grid"> {/* New ClassName */}
        {currentSets.map((set) => (
          <div key={set.id} className="fr-bml-set-card"> {/* New ClassName */}
            <div className="fr-bml-set-card-images"> {/* New ClassName */}
              {set.images && set.images.slice(0, 4).map((src, i) => (
                <img key={i} src={src || (assets.defaultFoodImage || undefined)} alt={`Set ${set.id} pic ${i + 1}`} />
              ))}
            </div>
            <div className="fr-bml-set-card-details"> {/* New ClassName */}
              <div>
                <p className="fr-bml-set-card-title">SET {set.id}</p> {/* New ClassName */}
                {set.items && set.items.map((line, i) => (
                  <p className="fr-bml-set-card-menu-item" key={i}>{line}</p> /* New ClassName */
                ))}
              </div>
              <div className="fr-bml-set-card-actions"> {/* New ClassName */}
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

export default FranceBudgetMeals;