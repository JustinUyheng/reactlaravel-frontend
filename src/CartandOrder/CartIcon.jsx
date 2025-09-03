import React, { useState } from "react";
import { useCart } from "../CartandOrder/CartContext";
import CartDisplay from "./CartDisplay";
import "./CaorStyle/CartIcon.css";

const CartIcon = () => {
	const { getCartItemCount } = useCart();
	const [showCart, setShowCart] = useState(false);

	// Get total count of all items
	const totalCount = getCartItemCount(); // This gets both order and reserve items
	const orderCount = getCartItemCount("order");
	const reserveCount = getCartItemCount("reserve");

	const handleCartClick = () => {
		setShowCart(true);
	};

	const handleCloseCart = () => {
		setShowCart(false);
	};

	return (
		<>
			<div className="cart-icon-container" onClick={handleCartClick}>
				<div className="cart-icon">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.3 5.1 16.3H17M17 13V16.3M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>

					{totalCount > 0 && (
						<div className="cart-badge">
							<span className="cart-count">{totalCount}</span>
						</div>
					)}
				</div>

				{totalCount > 0 && (
					<div className="cart-tooltip">
						<div className="tooltip-content">
							{orderCount > 0 && <span>{orderCount} orders</span>}
							{reserveCount > 0 && <span>{reserveCount} reservations</span>}
						</div>
					</div>
				)}
			</div>

			<CartDisplay isOpen={showCart} onClose={handleCloseCart} />
		</>
	);
};

export default CartIcon;
