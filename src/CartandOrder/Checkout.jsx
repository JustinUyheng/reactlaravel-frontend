// Checkout.jsx
import React, { useState } from 'react';
import './CaorStyle/Checkout.css';
import { useCart } from './userCart'; // Ensure this path is correct
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cart } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('08:00');
  const [paymentMethodState, setPaymentMethodState] = useState('gcash'); // Local state for active button style

  const calculateTotalItemsPrice = (items) =>
    items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  const orderItems = Array.isArray(cart?.order) ? cart.order : [];
  const reserveItems = Array.isArray(cart?.reserve) ? cart.reserve : [];

  const orderTotal = calculateTotalItemsPrice(orderItems);
  const reserveTotal = calculateTotalItemsPrice(reserveItems);
  const subtotal = orderTotal + reserveTotal;
  const serviceFee = 5; // This is the fee mentioned in other components
  const total = subtotal + serviceFee;

  const getCheckoutData = (currentPaymentMethod) => ({
    userInfo: { fullName, email, contactNumber },
    pickupInfo: { pickupDate, pickupTime },
    cart, // The current cart from useCart()
    serviceFee,
    subtotal, // Pass subtotal for display
    total,    // Pass total for display
    paymentMethod: currentPaymentMethod
  });

  return (
    <div className="checkout-wrapper">
      <div className="checkout-page-container">
        <div className="checkout-row">
          <div className="checkout-column info-column">
            <h3 className="section-title">Information</h3>
            <div className="form-group">
              <input type="text" id="fullName" placeholder="Complete Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <input type="email" id="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <input type="tel" id="contactNumber" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
            </div>
          </div>
          <div className="checkout-column reservation-column">
            <h3 className="section-title">Reservation</h3>
            <div className="pickup-row-inputs">
              <div className="form-group pickup-date-group">
                <label htmlFor="pickupDate">Date of pick up</label>
                <input type="text" id="pickupDate" placeholder="mm/dd/yyyy" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} />
              </div>
              <div className="form-group pickup-time-group">
                <label htmlFor="pickupTimeField">Select time for pick up</label>
                <input type="time" id="pickupTimeField" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required className="time-input" />
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-row">
          <div className="checkout-column cart-summary-column">
            <div className="cart-summary-box">
              <h3 className="section-title">Cart Totals</h3>
              <p>Subtotal <span>₱ {subtotal.toFixed(2)}</span></p>
              <p>Order and Reservation Fee <span>₱ {serviceFee.toFixed(2)}</span></p>
              <h3 className="total-amount">Total <span>₱ {total.toFixed(2)}</span></h3>
            </div>
          </div>
          <div className="checkout-column payment-column">
            <h3 className="section-title">Orders & Reservation Payment</h3>
            <div className="payment-buttons">
              <Link
                to="/pay" // Route for PayCash
                state={{ checkoutData: getCheckoutData('cash') }}
                className={`payment-btn cash-btn ${paymentMethodState === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethodState('cash')}
              >
                Cash
              </Link>
              <Link
                to="/place-order" // Route for PlaceOrder (GCash)
                state={{ checkoutData: getCheckoutData('gcash') }}
                className={`payment-btn gcash-btn ${paymentMethodState === 'gcash' ? 'active' : ''}`}
                onClick={() => setPaymentMethodState('gcash')}
              >
                Gcash
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;