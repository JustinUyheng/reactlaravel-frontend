// CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
// Make sure useCart hook is properly defined, either here or in userCart.js
// If userCart.js only contains the hook, you might not need to import useCart here directly
// but ensure the components using it can access it.

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState(() => {
		try {
			const localData = localStorage.getItem("shoppingCart");
			return localData ? JSON.parse(localData) : { order: [], reserve: [] };
		} catch (error) {
			console.error("Could not parse cart from localStorage:", error);
			return { order: [], reserve: [] };
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem("shoppingCart", JSON.stringify(cart));
		} catch (error) {
			console.error("Could not save cart to localStorage:", error);
		}
	}, [cart]);

	// In your addToCart function, you might want to handle the type
	const addToCart = (product, quantity = 1) => {
		const type = product.type;
		const existingItem = cart[type].find((item) => item.id === product.id);
		if (existingItem) {
			setCart((prev) => ({
				...prev,
				[type]: prev[type].map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item
				),
			}));
		} else {
			setCart((prev) => ({
				...prev,
				[type]: [...prev[type], { ...product, quantity }],
			}));
		}

		// Update localStorage
		const updatedCart = cart.map((item) =>
			item.id === product.id && item.type === product.type
				? { ...item, quantity: item.quantity + quantity }
				: item
		);

		if (!existingItem) {
			updatedCart.push({ ...product, quantity });
		}

		localStorage.setItem("cart", JSON.stringify(updatedCart));
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
		const {
			cart: currentCart,
			serviceFee = 5,
			userInfo,
			pickupInfo,
			paymentMethod,
		} = checkoutDetails;
		let existingHistory = [];
		try {
			const historyData = localStorage.getItem("orderHistory");
			existingHistory = historyData ? JSON.parse(historyData) : [];
		} catch (error) {
			console.error("Could not parse order history from localStorage:", error);
			existingHistory = [];
		}

		const newTransactions = [];
		const timestamp = new Date().toISOString();

		if (currentCart.order && currentCart.order.length > 0) {
			const orderTransaction = {
				id: Date.now() + "-order-" + Math.random().toString(36).substr(2, 9),
				type: "order",
				items: currentCart.order,
				timestamp,
				status: "Ready for pickup",
				fee: serviceFee, // Assuming serviceFee applies to this part if it exists
				userInfo,
				pickupInfo,
				paymentMethod,
			};
			newTransactions.push(orderTransaction);
		}

		if (currentCart.reserve && currentCart.reserve.length > 0) {
			const reservationTransaction = {
				id: Date.now() + "-reserve-" + Math.random().toString(36).substr(2, 9),
				type: "reservation",
				items: currentCart.reserve,
				timestamp,
				status: "Preparing for pickup",
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
				localStorage.setItem("orderHistory", JSON.stringify(updatedHistory));
			} catch (error) {
				console.error("Could not save order history to localStorage:", error);
			}
		}
		clearCart(); // Clear the cart after successful processing
	};

	const getCartItemCount = (type) => {
		return cart[type]?.reduce((sum, item) => sum + item.quantity, 0) || 0;
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				processTransaction,
				getCartItemCount,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

// It's common to export a custom hook for convenience from the same file or a dedicated userCart.js
export const useCart = () => useContext(CartContext);
