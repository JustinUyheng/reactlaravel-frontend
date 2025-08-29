// Orders.jsx
import React, { useEffect, useState } from 'react';
import './CaorStyle/Order.css'; // Your existing CSS for orders
import { assets } from '../assets/assets'; // Ensure this path and assets.reserve are correct

const Orders = () => {
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    const historyData = localStorage.getItem('orderHistory');
    if (historyData) {
      try {
        const parsedData = JSON.parse(historyData);
        // Sort by timestamp descending (newest first)
        parsedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAllTransactions(parsedData);
      } catch (error) {
        console.error("Failed to parse order history from localStorage:", error);
        setAllTransactions([]);
      }
    }
  }, []);

  const removeTransaction = (transactionIdToRemove) => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      const updatedHistory = allTransactions.filter(transaction => transaction.id !== transactionIdToRemove);
      setAllTransactions(updatedHistory);
      localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
    }
  };

  const renderTransactionItem = (transaction) => {
    if (!transaction || !Array.isArray(transaction.items) || transaction.items.length === 0) {
      return null;
    }

    const names = transaction.items.map(item => `${item.name} (x${item.quantity || 1})`).join(', ');
    const totalItemsCount = transaction.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const itemsTotalPrice = transaction.items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
      return sum + (price * quantity);
    }, 0);

    const feeAmount = typeof transaction.fee === 'number' ? transaction.fee : 0;
    const finalPrice = itemsTotalPrice + feeAmount; // Total for this specific transaction (order or reservation)

    const date = transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : 'Date not available';
    const status = transaction.status || (transaction.type === 'order' ? 'Ready for pickup' : 'Preparing for pickup');

    // Determine icon based on transaction type
    const iconSrc = transaction.type === 'reservation' ? assets.reserve : assets.box;
    const iconAlt = transaction.type === 'reservation' ? "Reservation Icon" : "Order Icon";
    // Placeholder if actual image fails to load or isn't defined in assets
    const placeholderIconContent = transaction.type === 'reservation' ? "🗓️" : "📦";


    return (
      <div className="order-box" key={transaction.id}>
        <div className="order-icon">
          {assets && iconSrc ? (
            <img src={iconSrc} alt={iconAlt} />
          ) : (
            <div className="placeholder-icon">{placeholderIconContent}</div>
          )}
        </div>
        <div className="order-details">
          <p style={{ fontWeight: 'bold' }}>{names || 'No items listed'}</p>
          {transaction.userInfo && (
            <p style={{ fontSize: '0.9em', color: '#555' }}>
              Customer: {transaction.userInfo.fullName} ({transaction.userInfo.email}, {transaction.userInfo.contactNumber})
            </p>
          )}
          {transaction.pickupInfo && (
            <p style={{ fontSize: '0.9em', color: '#555' }}>
              Pickup: {transaction.pickupInfo.pickupDate} at {transaction.pickupInfo.pickupTime}
            </p>
          )}
          <p style={{ fontSize: '0.9em', color: '#555' }}>Payment: {transaction.paymentMethod || 'N/A'}</p>
          {transaction.paymentMethod === 'gcash' && transaction.paymentDetails && (
            <p style={{ fontSize: '0.9em', color: '#555' }}>
              Gcash Acc: {transaction.paymentDetails.accountName}, No: {transaction.paymentDetails.gcashNumber}
            </p>
          )}
          <small>Date Processed: {date}</small>
        </div>
        <div className="order-price">₱ {finalPrice.toFixed(2)}</div>
        <div className="order-count">Items: {totalItemsCount}</div>
        <div className="order-status"><span>*{status}</span></div>
        <div className="order-actions">
          <button
            onClick={() => removeTransaction(transaction.id)}
            className="delete-order-btn"
            aria-label={`Delete this ${transaction.type}`}
          >
            ✖
          </button>
        </div>
      </div>
    );
  };

  const orders = allTransactions.filter(t => t.type === 'order');
  const reservations = allTransactions.filter(t => t.type === 'reservation');

  return (
    <div className="order-wrapper">
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        orders.map(order => renderTransactionItem(order))
      ) : (
        <p>No confirmed orders yet.</p>
      )}

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>My Reservations</h2>
      {reservations.length > 0 ? (
        reservations.map(reservation => renderTransactionItem(reservation))
      ) : (
        <p>No confirmed reservations yet.</p>
      )}
    </div>
  );
};

export default Orders;