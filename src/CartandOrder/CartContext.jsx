// CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
// Make sure useCart hook is properly defined, either here or in userCart.js
// If userCart.js only contains the hook, you might not need to import useCart here directly
// but ensure the components using it can access it.

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem('shoppingCart');
      return localData ? JSON.parse(localData) : { order: [], reserve: [] };
    } catch (error) {
      console.error("Could not parse cart from localStorage:", error);
      return { order: [], reserve: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Could not save cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (item, type) => {
    setCart((prev) => {
      const updatedType = [...prev[type]];
      const existingIndex = updatedType.findIndex((i) => i.name === item.name);
      if (existingIndex > -1) {
        updatedType[existingIndex] = {
          ...updatedType[existingIndex],
          quantity: updatedType[existingIndex].quantity + (item.quantity || 1), // Allow adding specific quantity
        };
      } else {
        updatedType.push({ ...item, quantity: (item.quantity || 1) });
      }
      return { ...prev, [type]: updatedType };
    });
  };

  const removeFromCart = (type, index) => {
    setCart((prev) => {
      const updatedType = [...prev[type]];
      updatedType.splice(index, 1);
      return { ...prev, [type]: updatedType };
    });
  };

  const updateQuantity = (type, index, change) => {
    setCart((prev) => {
      const updatedType = prev[type].map((item, i) => {
        if (i === index) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      });
      return { ...prev, [type]: updatedType };
    });
  };

  const clearCart = () => {
    setCart({ order: [], reserve: [] });
  };

  const processTransaction = (checkoutDetails) => {
    const { cart: currentCart, serviceFee = 5, userInfo, pickupInfo, paymentMethod } = checkoutDetails;
    let existingHistory = [];
    try {
      const historyData = localStorage.getItem('orderHistory');
      existingHistory = historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      console.error("Could not parse order history from localStorage:", error);
      existingHistory = [];
    }

    const newTransactions = [];
    const timestamp = new Date().toISOString();

    if (currentCart.order && currentCart.order.length > 0) {
      const orderTransaction = {
        id: Date.now() + '-order-' + Math.random().toString(36).substr(2, 9),
        type: 'order',
        items: currentCart.order,
        timestamp,
        status: 'Ready for pickup',
        fee: serviceFee, // Assuming serviceFee applies to this part if it exists
        userInfo,
        pickupInfo,
        paymentMethod,
      };
      newTransactions.push(orderTransaction);
    }

    if (currentCart.reserve && currentCart.reserve.length > 0) {
      const reservationTransaction = {
        id: Date.now() + '-reserve-' + Math.random().toString(36).substr(2, 9),
        type: 'reservation',
        items: currentCart.reserve,
        timestamp,
        status: 'Preparing for pickup',
        fee: serviceFee, // Assuming serviceFee applies to this part if it exists
        userInfo,
        pickupInfo,
        paymentMethod,
      };
      newTransactions.push(reservationTransaction);
    }

    if (newTransactions.length > 0) {
      const updatedHistory = [...existingHistory, ...newTransactions];
      try {
        localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Could not save order history to localStorage:", error);
      }
    }
    clearCart(); // Clear the cart after successful processing
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, processTransaction }}>
      {children}
    </CartContext.Provider>
  );
};

// It's common to export a custom hook for convenience from the same file or a dedicated userCart.js
export const useCart = () => useContext(CartContext);