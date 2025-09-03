import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { orderService } from "../services/orderService";
import { toast } from "react-toastify";
import "./VendorStyle/OrderManagement.css";
import VendorNavigation from "./components/VendorNavigation";

const OrderManagement = () => {
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [orders, setOrders] = useState([]);
	const [statistics, setStatistics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("orders");
	const [filterStatus, setFilterStatus] = useState("all");

	const statusOptions = [
		{ value: "preparing", label: "Preparing", color: "#ff9800" },
		{ value: "ready", label: "Ready for Pickup", color: "#4caf50" },
		{ value: "picked_up", label: "Picked Up", color: "#2196f3" },
		{ value: "cancelled", label: "Cancelled", color: "#f44336" },
		{ value: "delivered", label: "Delivered", color: "#9c27b0" },
	];

	useEffect(() => {
		if (!isAuthenticated || user?.role_id !== 2) {
			navigate("/auth");
			return;
		}
		fetchData();
	}, [isAuthenticated, user, navigate]);

	const fetchData = async () => {
		try {
			setLoading(true);
			const [ordersResponse, statsResponse] = await Promise.all([
				orderService.getOrders(),
				orderService.getOrderStatistics(),
			]);

			setOrders(ordersResponse.orders || []);
			setStatistics(statsResponse.statistics || {});
		} catch (error) {
			toast.error("Failed to fetch data: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusUpdate = async (orderId, newStatus) => {
		try {
			await orderService.updateOrderStatus(orderId, newStatus);
			toast.success("Order status updated successfully!");
			fetchData(); // Refresh data
		} catch (error) {
			toast.error("Failed to update order status: " + error.message);
		}
	};

	const getStatusColor = (status) => {
		const statusOption = statusOptions.find(
			(option) => option.value === status
		);
		return statusOption ? statusOption.color : "#666";
	};

	const getStatusLabel = (status) => {
		const statusOption = statusOptions.find(
			(option) => option.value === status
		);
		return statusOption ? statusOption.label : status;
	};

	const filteredOrders =
		filterStatus === "all"
			? orders
			: orders.filter((order) => order.status === filterStatus);

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const calculateOrderTotal = (order) => {
		const itemsTotal = order.items.reduce((sum, item) => {
			return sum + parseFloat(item.price) * parseInt(item.quantity);
		}, 0);
		return itemsTotal + parseFloat(order.service_fee || 0);
	};

	if (loading) {
		return (
			<div className="order-management-loading">
				<div className="loading-spinner"></div>
				<p>Loading orders...</p>
			</div>
		);
	}

	return (
		<div className="order-management">
			<VendorNavigation />
			<div className="order-management-header">
				<h1>Order Management</h1>
				<div className="header-actions">
					<button
						className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
						onClick={() => setActiveTab("orders")}
					>
						Orders
					</button>
					<button
						className={`tab-btn ${activeTab === "statistics" ? "active" : ""}`}
						onClick={() => setActiveTab("statistics")}
					>
						Statistics
					</button>
				</div>
			</div>

			{activeTab === "orders" && (
				<div className="orders-section">
					{/* Statistics Cards */}
					<div className="stats-cards">
						<div className="stat-card">
							<h3>Total Orders</h3>
							<p>{statistics?.total_orders || 0}</p>
						</div>
						<div className="stat-card">
							<h3>Pending Orders</h3>
							<p>{statistics?.pending_orders || 0}</p>
						</div>
						<div className="stat-card">
							<h3>Total Revenue</h3>
							{/* <p>₱{(statistics?.total_revenue || 0).toFixed(2)}</p> */}
							<p>₱{statistics?.total_revenue || 0}</p>
						</div>
					</div>

					{/* Status Filter */}
					<div className="status-filter">
						<button
							className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
							onClick={() => setFilterStatus("all")}
						>
							All Orders
						</button>
						{statusOptions.map((status) => (
							<button
								key={status.value}
								className={`filter-btn ${filterStatus === status.value ? "active" : ""}`}
								onClick={() => setFilterStatus(status.value)}
								style={{ borderColor: status.color }}
							>
								{status.label}
							</button>
						))}
					</div>

					{/* Orders List */}
					<div className="orders-list">
						{filteredOrders.length === 0 ? (
							<div className="no-orders">
								<p>No orders found with the selected filter.</p>
							</div>
						) : (
							filteredOrders.map((order) => (
								<div key={order.id} className="order-card">
									<div className="order-header">
										<div className="order-info">
											<h3>Order #{order.id}</h3>
											<p className="order-date">
												{formatDate(order.created_at)}
											</p>
											<p className="order-type">
												{order.type === "order" ? "📦 Order" : "🗓️ Reservation"}
											</p>
										</div>
										<div className="order-status">
											<span
												className="status-badge"
												style={{
													backgroundColor: getStatusColor(order.status),
												}}
											>
												{getStatusLabel(order.status)}
											</span>
										</div>
									</div>

									<div className="order-details">
										<div className="customer-info">
											<h4>Customer Information</h4>
											<p>
												<strong>Name:</strong> {order.user?.firstname}{" "}
												{order.user?.lastname}
											</p>
											<p>
												<strong>Email:</strong> {order.user?.email}
											</p>
											{order.user_info?.contactNumber && (
												<p>
													<strong>Contact:</strong>{" "}
													{order.user_info.contactNumber}
												</p>
											)}
										</div>

										<div className="pickup-info">
											<h4>Pickup Information</h4>
											{order.pickup_info?.pickupDate && (
												<p>
													<strong>Date:</strong> {order.pickup_info.pickupDate}
												</p>
											)}
											{order.pickup_info?.pickupTime && (
												<p>
													<strong>Time:</strong> {order.pickup_info.pickupTime}
												</p>
											)}
										</div>

										<div className="payment-info">
											<h4>Payment Information</h4>
											<p>
												<strong>Method:</strong> {order.payment_method}
											</p>
											{order.payment_method === "gcash" &&
												order.payment_details && (
													<>
														<p>
															<strong>Account:</strong>{" "}
															{order.payment_details.accountName}
														</p>
														<p>
															<strong>Number:</strong>{" "}
															{order.payment_details.gcashNumber}
														</p>
													</>
												)}
										</div>
									</div>

									<div className="order-items">
										<h4>Order Items</h4>
										<div className="items-list">
											{order.items.map((item, index) => (
												<div key={index} className="item">
													<span className="item-name">{item.name}</span>
													<span className="item-quantity">
														x{item.quantity}
													</span>
													<span className="item-price">
														₱ {item.price * item.quantity}
														{/* {(
															parseFloat(item.price) * parseInt(item.quantity)
														).toFixed(2)} */}
													</span>
												</div>
											))}
										</div>
										<div className="order-total">
											<p>
												<strong>Subtotal:</strong> ₱
												{/* {parseFloat(order.subtotal).toFixed(2)} */}
												{order.subtotal}
											</p>
											<p>
												<strong>Service Fee:</strong> ₱
												{/* {parseFloat(order.service_fee || 0).toFixed(2)} */}
												{order.service_fee || 0}
											</p>
											<p>
												<strong>Total:</strong> ₱
												{/* {calculateOrderTotal(order).toFixed(2)} */}
												{calculateOrderTotal(order)}
											</p>
										</div>
									</div>

									<div className="order-actions">
										<select
											value={order.status}
											onChange={(e) =>
												handleStatusUpdate(order.id, e.target.value)
											}
											className="status-select"
										>
											{statusOptions.map((status) => (
												<option key={status.value} value={status.value}>
													{status.label}
												</option>
											))}
										</select>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			)}

			{activeTab === "statistics" && (
				<div className="statistics-section">
					<div className="stats-overview">
						<h2>Order Statistics Overview</h2>
						<div className="stats-grid">
							<div className="stat-item">
								<h3>Total Orders</h3>
								<p className="stat-number">{statistics?.total_orders || 0}</p>
							</div>
							<div className="stat-item">
								<h3>Pending Orders</h3>
								<p className="stat-number">{statistics?.pending_orders || 0}</p>
							</div>
							<div className="stat-item">
								<h3>Total Revenue</h3>
								<p className="stat-number">
									{/* ₱{(statistics?.total_revenue || 0).toFixed(2)} */}₱
									{statistics?.total_revenue || 0}
								</p>
							</div>
							<div className="stat-item">
								<h3>Average Order Value</h3>
								<p className="stat-number">
									₱
									{statistics?.total_orders > 0
										? (
												statistics.total_revenue / statistics.total_orders
											).toFixed(2)
										: "0.00"}
								</p>
							</div>
						</div>
					</div>

					<div className="status-breakdown">
						<h3>Orders by Status</h3>
						<div className="status-chart">
							{statusOptions.map((status) => {
								const count = orders.filter(
									(order) => order.status === status.value
								).length;
								const percentage =
									orders.length > 0
										? ((count / orders.length) * 100).toFixed(1)
										: 0;

								return (
									<div key={status.value} className="status-bar">
										<div className="status-label">
											<span
												className="status-dot"
												style={{ backgroundColor: status.color }}
											></span>
											{status.label}
										</div>
										<div className="status-count">{count}</div>
										<div className="status-percentage">{percentage}%</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderManagement;
