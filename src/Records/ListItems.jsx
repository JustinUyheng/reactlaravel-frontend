// ./Records/ListItems.jsx
import React from 'react';
import './RecStyle/ListItems.css'; // CSS for this component
import { assets } from '../assets/assets'; // Adjust path if necessary

// Define RemoveIcon here or import from a shared icons file
const RemoveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ListItems = ({ itemsList, handleRemoveItem }) => {
  return (
    <div className="listitems-container">
      <h3 className="listitems-title">All Foods List</h3>
      <div className="listitems-table-wrapper">
        <table className="listitems-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {itemsList.length === 0 ? (
              <tr>
                <td colSpan="5" className="listitems-no-items">
                  No items added yet. Add items from the 'Add Items' tab.
                </td>
              </tr>
            ) : (
              itemsList.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      // Use item.image; fallback to a placeholder if item.image is undefined or empty
                      src={item.image || (assets && assets.placeholder) || 'https://placehold.co/50x50/e9ecef/333?text=No+Image'}
                      alt={item.name || 'Food item'}
                      className="listitems-item-image"
                      onError={(e) => {
                        // Fallback if the primary image fails to load
                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                        e.target.src = (assets && assets.placeholder) || 'https://placehold.co/50x50/e9ecef/333?text=Error';
                      }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>Php {item.price}</td>
                  <td>
                    <button
                      className="listitems-remove-button"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove Item"
                    >
                      <RemoveIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListItems;
