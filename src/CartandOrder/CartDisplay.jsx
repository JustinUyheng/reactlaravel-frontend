import React, { useState } from "react";
import { useCart } from "../CartandOrder/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CaorStyle/CartDisplay.css";

const CartDisplay = ({ isOpen, onClose }) => {
	const {
		cart,
		cartItems,
		updateQuantity,
		removeFromCart,
		clearCart,
		clearCartType,
		getStoreTotal,
		getCartItemCount,
	} = useCart();

	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("order");

	// Get items for current tab
	const currentItems = cart[activeTab] || [];

	// Get totals
	const orderTotal = cart.order.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const reserveTotal = cart.reserve.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	// Get item counts
	const orderCount = getCartItemCount("order");
	const reserveCount = getCartItemCount("reserve");

	const handleQuantityChange = (item, newQuantity) => {
		if (newQuantity < 1) {
			handleRemoveItem(item);
			return;
		}
		updateQuantity(item.id, newQuantity, item.type, item.store_id);
	};

	const handleRemoveItem = (item) => {
		removeFromCart(item.id, item.type, item.store_id);
		toast.success(`${item.name} removed from cart`);
	};

	const handleClearAll = () => {
		if (window.confirm("Are you sure you want to clear your entire cart?")) {
			clearCart();
			toast.success("Cart cleared");
		}
	};

	const handleClearType = () => {
		const typeName = activeTab === "order" ? "orders" : "reservations";
		if (
			window.confirm(
				`Are you sure you want to clear all ${typeName} from cart?`
			)
		) {
			clearCartType(activeTab);
			toast.success(`All ${typeName} cleared from cart`);
		}
	};

	const handleCheckoutStore = (storeId, storeName) => {
		navigate(`/stores/${storeId}`);
		onClose();
	};

	// Group items by store
	const itemsByStore = currentItems.reduce((groups, item) => {
		const storeId = item.store_id;
		if (!groups[storeId]) {
			groups[storeId] = {
				storeName: item.store_name,
				items: [],
				total: 0,
			};
		}
		groups[storeId].items.push(item);
		groups[storeId].total += item.price * item.quantity;
		return groups;
	}, {});

	if (!isOpen) return null;

	return (
		<div className="cart-overlay">
			<div className="cart-modal">
				<div className="cart-header">
					<h2>Shopping Cart</h2>
					<button className="close-btn" onClick={onClose}>
						×
					</button>
				</div>

				{/* Tab Navigation */}
				<div className="cart-tabs">
					<button
						className={`tab-btn ${activeTab === "order" ? "active" : ""}`}
						onClick={() => setActiveTab("order")}
					>
						Orders ({orderCount})
					</button>
					<button
						className={`tab-btn ${activeTab === "reserve" ? "active" : ""}`}
						onClick={() => setActiveTab("reserve")}
					>
						Reservations ({reserveCount})
					</button>
				</div>

				<div className="cart-content">
					{currentItems.length === 0 ? (
						<div className="empty-cart">
							<p>
								No {activeTab === "order" ? "orders" : "reservations"} in cart
							</p>
							<button
								className="browse-btn"
								onClick={() => {
									navigate("/stores");
									onClose();
								}}
							>
								Browse Stores
							</button>
						</div>
					) : (
						<div className="cart-items">
							{Object.entries(itemsByStore).map(
								([storeId, { storeName, items, total }]) => (
									<div key={storeId} className="store-section">
										<div className="store-header">
											<h3>{storeName}</h3>
											<span className="store-total">₱{total.toFixed(2)}</span>
										</div>

										{items.map((item) => (
											<div
												key={`${item.id}-${item.store_id}`}
												className="cart-item"
											>
												<div className="item-image">
													{item.image ? (
														<img
															src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${item.image}`}
															alt={item.name}
															onError={(e) => {
																e.target.style.display = "none";
																e.target.nextSibling.style.display = "flex";
															}}
														/>
													) : null}
													<div
														className="placeholder-image"
														style={{
															display: item.image ? "none" : "flex",
														}}
													>
														No Image
													</div>
												</div>

												<div className="item-details">
													<h4>{item.name}</h4>
													<p className="item-price">₱{item.price.toFixed(2)}</p>
												</div>

												<div className="quantity-controls">
													<button
														className="qty-btn"
														onClick={() =>
															handleQuantityChange(item, item.quantity - 1)
														}
													>
														-
													</button>
													<span className="quantity">{item.quantity}</span>
													<button
														className="qty-btn"
														onClick={() =>
															handleQuantityChange(item, item.quantity + 1)
														}
													>
														+
													</button>
												</div>

												<div className="item-total">
													₱{(item.price * item.quantity).toFixed(2)}
												</div>

												<button
													className="remove-btn"
													onClick={() => handleRemoveItem(item)}
													title="Remove item"
												>
													🗑️
												</button>
											</div>
										))}

										{activeTab === "order" && (
											<div className="store-actions">
												<button
													className="checkout-store-btn"
													onClick={() =>
														handleCheckoutStore(storeId, storeName)
													}
												>
													Checkout {storeName}
												</button>
											</div>
										)}
									</div>
								)
							)}
						</div>
					)}
				</div>

				{currentItems.length > 0 && (
					<div className="cart-footer">
						<div className="cart-summary">
							<div className="total-section">
								<strong>
									Total: ₱
									{activeTab === "order"
										? orderTotal.toFixed(2)
										: reserveTotal.toFixed(2)}
								</strong>
							</div>
						</div>

						<div className="cart-actions">
							<button className="clear-type-btn" onClick={handleClearType}>
								Clear All {activeTab === "order" ? "Orders" : "Reservations"}
							</button>
							<button className="clear-all-btn" onClick={handleClearAll}>
								Clear Entire Cart
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CartDisplay;
