import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG, getAuthHeaders } from "../config/api";
import { toast } from "react-toastify";
import "./UserOrders.css";

const UserOrders = () => {
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchUserOrders();
	}, []);

	const fetchUserOrders = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${API_CONFIG.BASE_URL}/orders/user`, {
				method: "GET",
				headers: getAuthHeaders(),
			});

			const result = await response.json();

			if (response.ok && result.success) {
				setOrders(result.orders);
			} else {
				setError(result.message || "Failed to fetch orders");
			}
		} catch (error) {
			console.error("Error fetching orders:", error);
			setError("Error loading orders");
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		const colors = {
			preparing: "#ffc107",
			ready: "#17a2b8",
			picked_up: "#28a745",
			delivered: "#28a745",
			cancelled: "#dc3545",
		};
		return colors[status] || "#6c757d";
	};

	const formatStatus = (status) => {
		return status.replace("_", " ").toUpperCase();
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="user-orders">
				<div className="loading-state">
					<div className="loading-spinner"></div>
					Loading your orders...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="user-orders">
				<div className="error-state">
					<h3>Error Loading Orders</h3>
					<p>{error}</p>
					<button onClick={fetchUserOrders} className="retry-btn">
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="user-orders">
			<div className="orders-header">
				<h1>My Orders</h1>
				<button
					onClick={() => navigate("/stores")}
					className="browse-stores-btn"
				>
					Browse Stores
				</button>
			</div>

			{orders.length === 0 ? (
				<div className="empty-orders">
					<h3>No Orders Yet</h3>
					<p>You haven't placed any orders yet.</p>
					<button
						onClick={() => navigate("/stores")}
						className="start-shopping-btn"
					>
						Start Shopping
					</button>
				</div>
			) : (
				<div className="orders-list">
					{orders.map((order) => (
						<div key={order.id} className="order-card">
							<div className="order-header">
								<div className="order-info">
									<h3>Order #{order.id}</h3>
									<p className="store-name">{order.store?.business_name}</p>
									<p className="order-date">{formatDate(order.created_at)}</p>
								</div>
								<div className="order-status">
									<span
										className="status-badge"
										style={{ backgroundColor: getStatusColor(order.status) }}
									>
										{formatStatus(order.status)}
									</span>
								</div>
							</div>

							<div className="order-items">
								<h4>Items:</h4>
								{order.items?.map((item) => (
									<div key={item.id} className="order-item">
										<span className="item-name">{item.product?.name}</span>
										<span className="item-quantity">{item.quantity}x</span>
										<span className="item-price">
											₱{parseFloat(item.price).toFixed(2)}
										</span>
									</div>
								))}
							</div>

							{order.delivery_address && (
								<div className="order-address">
									<strong>Delivery Address:</strong>
									<p>{order.delivery_address}</p>
								</div>
							)}

							{order.notes && (
								<div className="order-notes">
									<strong>Notes:</strong>
									<p>{order.notes}</p>
								</div>
							)}

							<div className="order-total">
								<strong>Total: ₱{parseFloat(order.total).toFixed(2)}</strong>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default UserOrders;
