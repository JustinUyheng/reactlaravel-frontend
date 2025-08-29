import React from 'react';
import './VenStyle/VendorStores.css';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const allStores = [
  { image: assets.food_1, title: 'France Bistro', route: '/vendor-france-bistro' },
  { image: assets.food_2, title: 'FASPeCC', route: '/vendor-faspecc' },
  { image: assets.food_3, title: 'France Bistro', route: '/vendor-france-bistro' },
  { image: assets.food_4, title: 'France Bistro', route: '/vendor-faspecc' },
  { image: assets.food_5, title: 'FASPeCC', route: '/vendor-france-bistro' },
  { image: assets.food_6, title: 'France Bistro', route: '/vendor-faspecc' },
];

const VendorStores = () => {
  const navigate = useNavigate();
  const storeData = allStores;

  return (
    <div className="stores-container" id="stores">

      <div className="breadcrumb">USTP &gt; Cafeteria</div>

      <div className="stores-tabs">
        <span
          className="tab active"
        >
          All Stores
        </span>
      </div>

      <div className="store-grid">
        {storeData.map((store, index) => (
          <div
            key={index}
            className="store-card"
            onClick={() => navigate(store.route)}
          >
            <img
              src={store.image}
              alt={store.title}
              className="store-image"
            />
            <div className="store-title">{store.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorStores;