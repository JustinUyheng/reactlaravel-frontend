// ./Admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets'; // Adjust if necessary
import './DashStyle/Dashboard.css';     // Adjust if necessary

// Define status options available for Orders in the admin panel
const ORDER_STATUSES_OPTIONS = ['Preparing for pickup', 'Ready for pickup', 'Item picked up', 'Cancelled', 'Delivered'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const historyJSON = localStorage.getItem('orderHistory');
    let processedOrders = [];
    if (historyJSON) {
      try {
        const parsedHistory = JSON.parse(historyJSON);
        if (Array.isArray(parsedHistory)) {
          processedOrders = parsedHistory
            .filter(transaction => transaction.type === 'order') // Filter for orders
            .map((order) => {
              const itemsTotal = (order.items || []).reduce(
                (sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 1),
                0
              );
              const orderFee = parseFloat(order.fee) || 0;
              const displayTotalAmount = itemsTotal + orderFee;
              const itemNames = (order.items || [])
                .map(item => `${item.name} (x${item.quantity || 1})`)
                .join(', ');
              const currentStatus = order.status || ORDER_STATUSES_OPTIONS[0];

              return {
                id: order.id,
                customerImage: assets.user_placeholder || 'https://placehold.co/36x36/e9ecef/333?text=U',
                customerUsername: order.userInfo?.fullName || 'N/A',
                customerContact: order.userInfo?.contactNumber || 'N/A', // Changed from customerIdNumber for clarity
                customerEmail: order.userInfo?.email || 'N/A',
                totalAmount: displayTotalAmount,
                productName: itemNames || 'N/A',
                status: currentStatus,
                pickupTime: order.pickupInfo?.pickupTime || 'N/A',
                pickupDate: order.pickupInfo?.pickupDate || 'N/A',
                timestamp: order.timestamp,
              };
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
      } catch (error) {
        console.error("Failed to parse order history for AdminOrders:", error);
        processedOrders = [];
      }
    }
    setOrders(processedOrders);
  }, []);

  const handleOrderStatusChange = (orderIdToUpdate, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderIdToUpdate ? { ...order, status: newStatus } : order
      )
    );

    const historyRaw = localStorage.getItem('orderHistory');
    if (historyRaw) {
      try {
        let historyParsed = JSON.parse(historyRaw);
        if (Array.isArray(historyParsed)) {
          const orderIndexInStorage = historyParsed.findIndex(
            histOrder => histOrder.id === orderIdToUpdate && histOrder.type === 'order'
          );

          if (orderIndexInStorage !== -1) {
            historyParsed[orderIndexInStorage].status = newStatus;
            localStorage.setItem('orderHistory', JSON.stringify(historyParsed));
          } else {
            console.warn(`Admin: Order with ID ${orderIdToUpdate} not found in localStorage for update.`);
          }
        }
      } catch (error) {
        console.error("Admin: Error updating order status in localStorage:", error);
      }
    }
  };

  return (
    <div className="orders-tab-container">
      {orders.length > 0 ? (
        <div className="accounts-table-layout">
          <div className="accounts-table-header orders-table-header">
            <div className="header-item username-col">CUSTOMER</div>
            <div className="header-item idemail-col">CONTACT</div>
            <div className="header-item total-amount-col">TOTAL</div>
            {/* Ensure this flex matches the data cell's flex for consistent width */}
            <div className="header-item product-name-col" style={{ flex: "2 0 0px" }}>ITEMS</div>
            <div className="header-item time-pickup-col">PICKUP</div>
            <div className="header-item status-col">STATUS</div>
            <div className="header-item action-col" style={{ flex: "0 0 200px", justifyContent: "center" }}>ACTION</div>
          </div>
          <div className="accounts-table-body">
            {orders.map((order) => (
              <div key={order.id} className="account-row order-row">
                <div className="account-cell username-col" data-label="Customer:">
                  <img src={order.customerImage} alt={order.customerUsername} className="account-user-image" />
                  <span>{order.customerUsername}</span>
                </div>
                <div className="account-cell idemail-col" data-label="Contact:">
                  <span>{order.customerEmail}</span>
                  <span className="email-subtext">Ph: {order.customerContact}</span>
                </div>
                <div className="account-cell total-amount-col" data-label="Total:">
                  ₱{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : 'N/A'}
                </div>
                {/* Apply consistent flex here for the data cell to match header */}
                <div className="account-cell product-name-col" data-label="Items:" style={{ flex: "2 0 0px", whiteSpace: "normal", wordBreak: "break-word" }}>
                  {order.productName}
                </div>
                <div className="account-cell time-pickup-col" data-label="Pickup:">
                  {order.pickupDate} <br /> {order.pickupTime}
                </div>
                <div className="account-cell status-col" data-label="Status:">
                  <span className={`order-status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.status}
                  </span>
                </div>
                <div className="account-cell action-col" data-label="Action:">
                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                    className="order-status-dropdown"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '170px' }}
                  >
                    {ORDER_STATUSES_OPTIONS.map(statusValue => (
                      <option key={statusValue} value={statusValue}>{statusValue}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (<p className="no-accounts-message">No orders to display.</p>)}
    </div>
  );
};

export default AdminOrders;