// PlaceOrder.jsx
import React, { useState } from 'react';
import './CaorStyle/PlaceOrder.css';
import { useCart } from './userCart'; // Ensure this path is correct
import { useLocation, useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { processTransaction } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const { checkoutData } = location.state || {};

  // GCash specific form fields - will be empty if not filled by user
  const [accountName, setAccountName] = useState('');
  const [gcashEmail, setGcashEmail] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');


  if (!checkoutData) {
    // It's still good practice to ensure checkoutData itself exists
    navigate('/checkout');
    return <p>Loading checkout details... Please return to checkout.</p>;
  }

  // Destructure. userInfo and pickupInfo might be incomplete if not filled in Checkout.
  const { subtotal, serviceFee, total, cart: currentCart, userInfo, pickupInfo } = checkoutData;

  const handlePay = () => {
    // Validations for userInfo, pickupInfo, accountName, and gcashNumber have been removed as requested.
    // processTransaction will be called even if these fields are empty.
    // This means 'orderHistory' might store transactions with incomplete info.

    // Construct gcashDetails, which might contain empty strings if not filled.
    const gcashDetails = { accountName, email: gcashEmail, gcashNumber };

    processTransaction({
      cart: currentCart,
      serviceFee,
      userInfo, // May have empty fields
      pickupInfo, // May have empty fields
      paymentMethod: 'gcash',
      paymentDetails: gcashDetails, // Will pass current (possibly empty) gcash input values
    });
    navigate('/orders'); // Navigate to the orders/reservations page
  };

  return (
    <div className="placeorder-container">
      <div className="cart-section">
        <h3>Cart Totals</h3>
        <div className="summary-line">
          <span>Subtotal</span>
          {/* Ensure subtotal is a number before calling toFixed */}
          <span>₱ {typeof subtotal === 'number' ? subtotal.toFixed(2) : '0.00'}</span>
        </div>
        <div className="summary-line">
          <span>Order and Reservation Fee</span>
          {/* Ensure serviceFee is a number */}
          <span>₱ {typeof serviceFee === 'number' ? serviceFee.toFixed(2) : '0.00'}</span>
        </div>
        <div className="summary-line total-line">
          <span>Total</span>
          {/* Ensure total is a number */}
          <span>₱ {typeof total === 'number' ? total.toFixed(2) : '0.00'}</span>
        </div>
      </div>

      <div className="gcash-section">
        <h3>Gcash Details</h3>
        {/* Inputs remain, but their values (even if empty) will be used */}
        <input type="text" placeholder="Account Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
        <input type="email" placeholder="Email Address (Optional)" value={gcashEmail} onChange={(e) => setGcashEmail(e.target.value)} />
        <input type="text" placeholder="Gcash Number" value={gcashNumber} onChange={(e) => setGcashNumber(e.target.value)} />
        <button onClick={handlePay} className="place-order-btn">
          Pay
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;