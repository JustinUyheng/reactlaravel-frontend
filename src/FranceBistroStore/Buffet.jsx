import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './frabstyle/Buffet.css'; // Assuming this path is correct
import { assets } from "../assets/assets"; // Assuming this path is correct

// ... (options300, options350, drinks arrays remain the same) ...
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
    menu: ['Sweet & Sour Pork', 'Pancit Canton', 'Shanghai Rolls', 'Rice', 'Drinks of your choice'],
    images: [assets.food_2, assets.food_3, assets.food_4, assets.food_1],
  },
  {
    id: 'buffet300-opt3',
    title: 'OPTION 3',
    menu: ['Chicken Adobo', 'Mixed Veggies', 'Bihon Guisado', 'Rice', 'Drinks of your choice'],
    images: [assets.food_3, assets.food_4, assets.food_1, assets.food_2],
  },
  {
    id: 'buffet300-opt4',
    title: 'OPTION 4',
    menu: ['Fried Chicken', 'Chopsuey', 'Spaghetti', 'Rice', 'Drinks of your choice'],
    images: [assets.food_4, assets.food_1, assets.food_2, assets.food_3],
  },
  {
    id: 'buffet300-opt5',
    title: 'OPTION 5',
    menu: ['Menudo', 'Macaroni Salad', 'Lumpia', 'Rice', 'Drinks of your choice'],
    images: [assets.food_1, assets.food_3, assets.food_2, assets.food_4],
  },
  {
    id: 'buffet300-opt6',
    title: 'OPTION 6',
    menu: ['Chicken Curry', 'Bicol Express', 'Kare-Kare', 'Rice', 'Drinks of your choice'],
    images: [assets.food_2, assets.food_4, assets.food_1, assets.food_3],
  },
];

const options350 = [
  {
    id: 'buffet350-opt1',
    title: 'OPTION 1',
    menu: ['Buttered Chicken Deluxe', 'Fish Escabeche Special', 'Four Seasons Deluxe', 'Garlic Rice', 'Premium Drinks'],
    images: [assets.food_1, assets.food_2, assets.food_3, assets.food_4],
  },
  {
    id: 'buffet350-opt2',
    title: 'OPTION 2',
    menu: ['Beef Caldereta', 'Carbonara', 'Fresh Lumpia', 'Garlic Rice', 'Premium Drinks'],
    images: [assets.food_2, assets.food_3, assets.food_4, assets.food_1],
  },
  {
    id: 'buffet350-opt3',
    title: 'OPTION 3',
    menu: ['Pork BBQ', 'Pasta Alfredo', 'Vegetable Salad', 'Garlic Rice', 'Premium Drinks'],
    images: [assets.food_3, assets.food_4, assets.food_1, assets.food_2],
  },
  {
    id: 'buffet350-opt4',
    title: 'OPTION 4',
    menu: ['Grilled Liempo', 'Lasagna', 'Fruit Salad', 'Garlic Rice', 'Premium Drinks'],
    images: [assets.food_4, assets.food_1, assets.food_2, assets.food_3],
  },
  {
    id: 'buffet350-opt5',
    title: 'OPTION 5',
    menu: ['Lechon Kawali', 'Baked Macaroni', 'Coleslaw', 'Garlic Rice', 'Premium Drinks'],
    images: [assets.food_1, assets.food_3, assets.food_2, assets.food_4],
  },
  {
    id: 'buffet350-opt6',
    title: 'OPTION 6',
    menu: ['Crispy Pata', 'Chicken Alfredo', 'Mango Float', 'Garlic Rice', 'Premium Drinks'],
    images: [assets.food_2, assets.food_4, assets.food_1, assets.food_3],
  },
];

const drinks = [
  { id: 'drink-iced-tea', name: 'Iced Tea', price: 20, image: assets.drink_1 },
  { id: 'drink-soft-drinks', name: 'Soft Drinks', price: 25, image: assets.drink_2 },
  { id: 'drink-minute-maid', name: 'Minute Maid', price: 30, image: assets.drink_3 },
  { id: 'drink-water-500ml', name: 'Water 500ml', price: 15, image: assets.drink_4 },
];


const Buffet = () => {
  const [activeSet, setActiveSet] = useState('300');
  const navigate = useNavigate();

  const currentOptions = activeSet === '300' ? options300 : options350;

  return (
    <div className="buffet-container">

      <div className="buffet-header-row">
        <div className="buffet-path">
          <span className="faspecc">France Bistro</span> &gt; Buffet
        </div>
        <Link to="/vendor-add-items" className="buffet-records-link">Records</Link>
      </div>

      <div className="buffet-tabs">
        <span
          className={`buffet-tab ${activeSet === '300' ? 'active' : ''}`}
          onClick={() => setActiveSet('300')}
        >
          300/pax
        </span>
        <span
          className={`buffet-tab ${activeSet === '350' ? 'active' : ''}`}
          onClick={() => setActiveSet('350')}
        >
          350/pax
        </span>
      </div>

      {(activeSet === '300' || activeSet === '350') && (
        <div className="options-grid">
          {currentOptions.map((opt) => (
            <div className="option-card" key={opt.id}>
              <div className="option-images">
                {opt.images.map((src, i) => (
                  <img key={i} src={src} alt={`${opt.title}-${i}`} />
                ))}
              </div>
              <div className="option-content"> {/* Renamed for clarity and to wrap details and icons */}
                <div className="option-details">
                  <div className="option-title">{opt.title}</div>
                  {opt.menu.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
                <div className="card-actions">
                  <img src={assets.edit} alt="Edit" className="action-icon" />
                  <img src={assets.bin} alt="Delete" className="action-icon" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="drinks-section">
        <div className="drinks-title">CHOICES OF DRINKS</div>
        <div className="drinks-grid">
          {drinks.map((drink) => (
            <div className="drink-card" key={drink.id}>
              <img src={drink.image} alt={drink.name} className="drink-image" /> {/* Added class for specific styling if needed */}
              <div className="drink-info">
                <div className="drink-name">{drink.name}</div>
                <div className="drink-price">₱{drink.price}</div>
              </div>
              <div className="card-actions">
                <img src={assets.edit} alt="Edit" className="action-icon" />
                <img src={assets.bin} alt="Delete" className="action-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-bottom-spacer"></div>
    </div>
  );
};

export default Buffet;