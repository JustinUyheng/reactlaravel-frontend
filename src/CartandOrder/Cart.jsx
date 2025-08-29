// Cart.jsx
import React from 'react';
import './CaorStyle/Cart.css';
import { useCart } from './userCart';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderTotal = calculateTotal(cart.order);
  const reserveTotal = calculateTotal(cart.reserve);
  const subtotal = orderTotal + reserveTotal;
  const serviceFee = 5;
  const total = subtotal + serviceFee;

  return (
    <div className="cart-container">
      <div className="cart-sections">
        <div className="cart-tables">
          <h2>Order</h2>
          <table>
            <thead>
              <tr><th>Items</th><th>Product Name</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              {cart.order.map((item, index) => (
                <tr key={index}>
                  <td><img src={item.image} alt={item.name} /></td>
                  <td>{item.name}</td>
                  <td>₱ {item.price}</td>
                  <td>
                    <button onClick={() => updateQuantity('order', index, -1)}>-</button>
                    {item.quantity}
                    <button onClick={() => updateQuantity('order', index, 1)}>+</button>
                  </td>
                  <td>₱ {item.price * item.quantity}</td>
                  <td><button onClick={() => removeFromCart('order', index)}>✖</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Reserve</h2>
          <table>
            <thead>
              <tr><th>Items</th><th>Product Name</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              {cart.reserve.map((item, index) => (
                <tr key={index}>
                  <td><img src={item.image} alt={item.name} /></td>
                  <td>{item.name}</td>
                  <td>₱ {item.price}</td>
                  <td>
                    <button onClick={() => updateQuantity('reserve', index, -1)}>-</button>
                    {item.quantity}
                    <button onClick={() => updateQuantity('reserve', index, 1)}>+</button>
                  </td>
                  <td>₱ {item.price * item.quantity}</td>
                  <td><button onClick={() => removeFromCart('reserve', index)}>✖</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-totals">
          <h3>Cart Total</h3>
          <p>Subtotal: ₱ {subtotal}</p>
          <p>Order and Reservation Fee: ₱ {serviceFee}</p>
          <h3>Total: ₱ {total}</h3>
          <Link to="/checkout" className="checkout-btn">PROCEED TO CHECKOUT</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
