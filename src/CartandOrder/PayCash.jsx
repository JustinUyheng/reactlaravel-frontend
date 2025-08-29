// PayCash.jsx
import React from 'react';
import './CaorStyle/PayCash.css';
import { useCart } from './userCart'; // Ensure this path is correct
import { useLocation, useNavigate } from 'react-router-dom';

const PayCash = () => {
  const { processTransaction } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve data passed from Checkout.jsx
  const { checkoutData } = location.state || {};

  if (!checkoutData) {
    // Optional: Redirect or show error if checkoutData is missing
    // It's generally good to keep this check for checkoutData itself.
    navigate('/checkout'); // Example: redirect back to checkout
    return <p>Loading checkout details... Please return to checkout.</p>; // Or some loading/error UI
  }

  // Destructure checkoutData. userInfo and pickupInfo might be incomplete if not filled.
  const { subtotal, serviceFee, total, cart: currentCart, userInfo, pickupInfo } = checkoutData;

  const handlePlaceOrder = () => {
    // The validation for fullName and pickupDate has been removed as requested.
    // processTransaction will now be called even if these fields are empty.
    // Note: This means 'orderHistory' might store transactions with incomplete userInfo or pickupInfo.
    processTransaction({
      cart: currentCart,
      serviceFee,
      userInfo, // This might have empty fields if not entered in Checkout
      pickupInfo, // This might have empty fields if not entered in Checkout
      paymentMethod: 'cash',
    });
    navigate('/orders'); // Navigate to the orders/reservations page
  };

  return (
    <div className="paycash-container">
      <h2>Pay Cash</h2>
      <div className="cart-summary">
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
        <button onClick={handlePlaceOrder} className="place-order-btn">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PayCash;