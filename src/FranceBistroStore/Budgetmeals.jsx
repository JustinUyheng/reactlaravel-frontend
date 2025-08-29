import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./frabstyle/Budgetmeals.css";
import { assets } from "../assets/assets"; // Assuming assets.edit and assets.bin are here
import { Link } from "react-router-dom";

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

const Budgetmeals = () => {
  const [activePrice, setActivePrice] = useState(80);
  const navigate = useNavigate(); // Not used in this snippet, but good to keep if needed elsewhere
  const currentSets = activePrice === 80 ? SETS_80 : SETS_150;

  // Placeholder functions for edit and delete actions
  const handleEdit = (setId) => {
    console.log("Edit set:", setId);
    // Navigate to an edit page or open a modal
  };

  const handleDelete = (setId) => {
    console.log("Delete set:", setId);
    // Implement delete logic, possibly with a confirmation
  };

  return (
    <div className="budget-container">
      <div className="breadcrumb-with-records">
        <h3 className="breadcrumb">
          <span className="faspecc">France Bistro</span> &gt; Budget Meals
        </h3>
        <Link to="/vendor-add-items" className="buffet-records-link"> {/* Changed class to match CSS */}
          Records
        </Link>
      </div>

      <div className="budget-tabs-bar">
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
                  <p className="budget-menu-item-text" key={i}>
                    {line}
                  </p>
                ))}
              </div>
              <div className="card-actions">
                <img
                  src={assets.edit}
                  alt="Edit"
                  className="action-icon"
                  onClick={() => handleEdit(set.id)}
                />
                <img
                  src={assets.bin}
                  alt="Delete"
                  className="action-icon"
                  onClick={() => handleDelete(set.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budgetmeals;