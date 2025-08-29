// ./Admin/AdminReservation.jsx
import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets'; // Adjust if necessary
import './DashStyle/Dashboard.css';     // Adjust if necessary

// Define status options available for Reservations in the admin panel
const RESERVATION_STATUS_OPTIONS = ['Preparing for pickup', 'Ready for pickup', 'Picked-up', 'Cancelled'];

const AdminReservation = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const historyJSON = localStorage.getItem('orderHistory');
    let processedReservations = [];
    if (historyJSON) {
      try {
        const parsedHistory = JSON.parse(historyJSON);
        if (Array.isArray(parsedHistory)) {
          processedReservations = parsedHistory
            .filter(transaction => transaction.type === 'reservation') // Filter for reservations
            .map((res) => {
              const itemsTotal = (res.items || []).reduce(
                (sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 1),
                0
              );
              const resFee = parseFloat(res.fee) || 0;
              const displayTotalAmount = itemsTotal + resFee;
              const itemNames = (res.items || [])
                .map(item => `${item.name} (x${item.quantity || 1})`)
                .join(', ');
              const currentStatus = res.status || RESERVATION_STATUS_OPTIONS[0];

              return {
                id: res.id,
                customerImage: assets.user_placeholder || 'https://placehold.co/36x36/e9ecef/333?text=U',
                customerUsername: res.userInfo?.fullName || 'N/A',
                customerContact: res.userInfo?.contactNumber || 'N/A',
                customerEmail: res.userInfo?.email || 'N/A',
                totalAmount: displayTotalAmount,
                itemsDisplay: itemNames || 'N/A',
                pickupTime: res.pickupInfo?.pickupTime || 'N/A',
                pickupDate: res.pickupInfo?.pickupDate || 'N/A',
                status: currentStatus,
                timestamp: res.timestamp,
              };
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
      } catch (error) {
        console.error("Failed to parse order history for AdminReservations:", error);
        processedReservations = [];
      }
    }
    setReservations(processedReservations);
  }, []);

  const handleReservationStatusChange = (reservationId, newStatus) => {
    setReservations(prevReservations =>
      prevReservations.map(res =>
        res.id === reservationId ? { ...res, status: newStatus } : res
      )
    );

    const historyRaw = localStorage.getItem('orderHistory');
    if (historyRaw) {
      try {
        let historyParsed = JSON.parse(historyRaw);
        if (Array.isArray(historyParsed)) {
          const resIndexInStorage = historyParsed.findIndex(
            histRes => histRes.id === reservationId && histRes.type === 'reservation'
          );

          if (resIndexInStorage !== -1) {
            historyParsed[resIndexInStorage].status = newStatus;
            localStorage.setItem('orderHistory', JSON.stringify(historyParsed));
          } else {
            console.warn(`Admin: Reservation ID ${reservationId} not found for update.`);
          }
        }
      } catch (error) {
        console.error("Admin: Error updating reservation status in localStorage:", error);
      }
    }
  };

  return (
    <div className="reservations-tab-container">
      {reservations.length > 0 ? (
        <div className="accounts-table-layout">
          <div className="accounts-table-header reservations-table-header">
            <div className="header-item username-col">CUSTOMER</div>
            <div className="header-item idemail-col">CONTACT</div>
            <div className="header-item total-amount-col">TOTAL</div>
            {/* Ensure this flex matches the data cell's flex for consistent width */}
            <div className="header-item product-name-col" style={{ flex: "2 0 0px" }}>ITEMS RESERVED</div>
            <div className="header-item time-pickup-col">PICKUP</div>
            <div className="header-item status-col">STATUS</div>
            <div className="header-item action-col" style={{ flex: "0 0 200px", justifyContent: "center" }}>ACTION</div>
          </div>
          <div className="accounts-table-body">
            {reservations.map((res) => (
              <div key={res.id} className="account-row reservation-row">
                <div className="account-cell username-col" data-label="Customer:">
                  <img src={res.customerImage} alt={res.customerUsername} className="account-user-image" />
                  <span>{res.customerUsername}</span>
                </div>
                <div className="account-cell idemail-col" data-label="Contact:">
                  <span>{res.customerEmail}</span>
                  <span className="email-subtext">Ph: {res.customerContact}</span>
                </div>
                <div className="account-cell total-amount-col" data-label="Total:">
                  ₱{typeof res.totalAmount === 'number' ? res.totalAmount.toFixed(2) : 'N/A'}
                </div>
                {/* Apply consistent flex here for the data cell to match header */}
                <div className="account-cell product-name-col" data-label="Items Reserved:" style={{ flex: "2 0 0px", whiteSpace: "normal", wordBreak: "break-word" }}>
                  {res.itemsDisplay}
                </div>
                <div className="account-cell time-pickup-col" data-label="Pickup:">
                  {res.pickupDate} <br /> {res.pickupTime}
                </div>
                <div className="account-cell status-col" data-label="Status:">
                  <span className={`order-status-badge status-${res.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {res.status}
                  </span>
                </div>
                <div className="account-cell action-col" data-label="Action:">
                  <select
                    value={res.status}
                    onChange={(e) => handleReservationStatusChange(res.id, e.target.value)}
                    className="order-status-dropdown"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '170px' }}
                  >
                    {RESERVATION_STATUS_OPTIONS.map(statusValue => (
                      <option key={statusValue} value={statusValue}>{statusValue}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (<p className="no-accounts-message">No reservations to display.</p>)}
    </div>
  );
};

export default AdminReservation;