// ./Records/Orderss.jsx
import React from 'react';
import './RecStyle/Orderss.css'; // CSS for this component
import { assets } from '../assets/assets'; // Adjust path if necessary

// Helper function (can be moved to a utils.js if used elsewhere)
const countOrderItems = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
};

const Orderss = ({ orders, orderStatuses, handleStatusChange }) => {
  return (
    <div className="admin-orders-container">
      <h3 className="admin-orders-title">Order Page</h3>
      {orders.length === 0 ? (
        <p className="admin-orders-no-orders">No orders received yet.</p>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => {
            // Calculate total items and price for this specific order
            const orderSubTotal = (order.items || []).reduce((sum, item) => {
              const price = parseFloat(item.price) || 0;
              const quantity = parseInt(item.quantity, 10) || 1;
              return sum + (price * quantity);
            }, 0);
            const orderFee = parseFloat(order.fee) || 0;
            const orderDisplayTotalPrice = orderSubTotal + orderFee;
            const totalDisplayItems = countOrderItems(order.items);

            const itemsString = Array.isArray(order.items) && order.items.length > 0
              ? order.items.map(item => `${item.name || 'Unknown Item'} x${item.quantity || 1}`).join(', ')
              : 'No items in order';

            return (
              <div key={order.id || `order-${Math.random()}`} className="admin-order-card">
                <div className="admin-order-icon">
                  <img
                    src={(assets && assets.box) || 'https://placehold.co/35x35/e9ecef/333?text=Box'}
                    alt="Order Parcel Icon"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/35x35/e9ecef/333?text=Error';
                    }}
                  />
                </div>
                <div className="admin-order-main-details">
                  <p className="admin-order-items">{itemsString}</p>
                  {order.customer && (
                    <div className="admin-order-customer">
                      <p className="customer-name">{order.customer.name || 'N/A'}</p>
                      <p className="customer-location">{order.customer.location || 'N/A'}</p>
                      <p className="customer-id">{order.customer.id || 'N/A'}</p>
                    </div>
                  )}
                </div>
                <div className="admin-order-summary">
                  <p className="admin-order-item-count">Items: {totalDisplayItems}</p>
                  <p className="admin-order-total-price">₱ {orderDisplayTotalPrice.toFixed(2)}</p>
                </div>
                <div className="admin-order-status">
                  <select
                    value={order.status || 'Food Processing'} // Default to 'Food Processing' if status is undefined
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select status-${(order.status || 'Food Processing').toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orderss;
