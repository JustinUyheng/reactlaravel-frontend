// CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

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

	const cartItems = [...cart.order, ...cart.reserve];

	const addToCart = (product, quantity = 1) => {
		const type = product.type || "order";

		// Find existing item in the specific type array
		const existingItemIndex = cart[type].findIndex(
			(item) => item.id === product.id && item.store_id === product.store_id
		);

		setCart((prev) => {
			if (existingItemIndex >= 0) {
				// Update existing item quantity
				const updatedType = [...prev[type]];
				updatedType[existingItemIndex] = {
					...updatedType[existingItemIndex],
					quantity: updatedType[existingItemIndex].quantity + quantity,
				};
				return { ...prev, [type]: updatedType };
			} else {
				// Add new item
				return {
					...prev,
					[type]: [...prev[type], { ...product, quantity }],
				};
			}
		});
	};

	const removeFromCart = (productId, type = "order", storeId = null) => {
		setCart((prev) => ({
			...prev,
			[type]: prev[type].filter((item) => {
				if (storeId) {
					return !(item.id === productId && item.store_id === storeId);
				}
				return item.id !== productId;
			}),
		}));
	};

	// Update item quantity
	const updateQuantity = (
		productId,
		newQuantity,
		type = "order",
		storeId = null
	) => {
		if (newQuantity <= 0) {
			removeFromCart(productId, type, storeId);
			return;
		}

		setCart((prev) => ({
			...prev,
			[type]: prev[type].map((item) => {
				const isMatch = storeId
					? item.id === productId && item.store_id === storeId
					: item.id === productId;

				return isMatch ? { ...item, quantity: newQuantity } : item;
			}),
		}));
	};

	const clearCart = () => {
		setCart({ order: [], reserve: [] });
	};

	// Clear items from specific store (useful after placing an order)
	const clearStoreItems = (storeId, type = "order") => {
		setCart((prev) => ({
			...prev,
			[type]: prev[type].filter((item) => item.store_id !== storeId),
		}));
	};

	// Clear items of specific type
	const clearCartType = (type) => {
		setCart((prev) => ({
			...prev,
			[type]: [],
		}));
	};

	// Get cart total for specific store and type
	const getStoreTotal = (storeId, type = null) => {
		const items = getStoreItems(storeId, type);
		return items.reduce((total, item) => total + item.price * item.quantity, 0);
	};

	const getCartItemCount = (type = null) => {
		if (type) {
			return cart[type]?.reduce((sum, item) => sum + item.quantity, 0) || 0;
		}
		return cartItems.reduce((sum, item) => sum + item.quantity, 0);
	};

	// Get items for specific store and type
	const getStoreItems = (storeId, type = null) => {
		if (type) {
			return cart[type].filter((item) => item.store_id === storeId);
		}
		return cartItems.filter((item) => item.store_id === storeId);
	};

	// Process transaction (updated for better backend integration)
	const processTransaction = async (checkoutDetails) => {
		const {
			cart: currentCart,
			serviceFee = 0,
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

		// Process orders
		if (currentCart.order && currentCart.order.length > 0) {
			const orderTransaction = {
				id: Date.now() + "-order-" + Math.random().toString(36).substr(2, 9),
				type: "order",
				items: currentCart.order,
				timestamp,
				status: "Preparing",
				serviceFee,
				userInfo,
				pickupInfo,
				paymentMethod,
			};
			newTransactions.push(orderTransaction);
		}

		// Process reservations
		if (currentCart.reserve && currentCart.reserve.length > 0) {
			const reservationTransaction = {
				id: Date.now() + "-reserve-" + Math.random().toString(36).substr(2, 9),
				type: "reservation",
				items: currentCart.reserve,
				timestamp,
				status: "Reserved",
				serviceFee,
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

		return newTransactions;
	};

	// Get order history
	const getOrderHistory = () => {
		try {
			const historyData = localStorage.getItem("orderHistory");
			return historyData ? JSON.parse(historyData) : [];
		} catch (error) {
			console.error("Could not parse order history from localStorage:", error);
			return [];
		}
	};

	// Check if product is in cart
	const isInCart = (productId, storeId, type = null) => {
		if (type) {
			return cart[type].some(
				(item) => item.id === productId && item.store_id === storeId
			);
		}
		return cartItems.some(
			(item) => item.id === productId && item.store_id === storeId
		);
	};

	// Get specific item from cart
	const getCartItem = (productId, storeId, type = "order") => {
		return cart[type].find(
			(item) => item.id === productId && item.store_id === storeId
		);
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				cartItems,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				clearStoreItems,
				clearCartType,
				getStoreItems,
				getStoreTotal,
				getCartItemCount,
				isInCart,
				getCartItem,
				processTransaction,
				getOrderHistory,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

// It's common to export a custom hook for convenience from the same file or a dedicated userCart.js
export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};
