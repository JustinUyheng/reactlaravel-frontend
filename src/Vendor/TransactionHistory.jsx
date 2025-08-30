import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { orderService } from "../services/orderService";
import { toast } from "react-toastify";
import "./VendorStyle/TransactionHistory.css";

const TransactionHistory = () => {
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterType, setFilterType] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");
	const [dateRange, setDateRange] = useState("all");

	const statusOptions = [
		{ value: "preparing", label: "Preparing", color: "#ff9800" },
		{ value: "ready", label: "Ready", color: "#4caf50" },
		{ value: "picked_up", label: "Picked Up", color: "#2196f3" },
		{ value: "cancelled", label: "Cancelled", color: "#f44336" },
		{ value: "delivered", label: "Delivered", color: "#9c27b0" },
	];

	useEffect(() => {
		if (!isAuthenticated || user?.role_id !== 2) {
			navigate("/auth");
			return;
		}
		fetchTransactionHistory();
	}, [isAuthenticated, user, navigate]);

	const fetchTransactionHistory = async () => {
		try {
			setLoading(true);
			const response = await orderService.getTransactionHistory();
			setTransactions(response.transactions || []);
		} catch (error) {
			toast.error("Failed to fetch transaction history: " + error.message);
		} finally {
			setLoading(false);
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

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDateOnly = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const filterTransactions = () => {
		let filtered = transactions;

		// Filter by type
		if (filterType !== "all") {
			filtered = filtered.filter((t) => t.type === filterType);
		}

		// Filter by status
		if (filterStatus !== "all") {
			filtered = filtered.filter((t) => t.status === filterStatus);
		}

		// Filter by date range
		if (dateRange !== "all") {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			switch (dateRange) {
				case "today":
					filtered = filtered.filter((t) => {
						const transactionDate = new Date(t.timestamp);
						return transactionDate >= today;
					});
					break;
				case "week":
					const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
					filtered = filtered.filter((t) => {
						const transactionDate = new Date(t.timestamp);
						return transactionDate >= weekAgo;
					});
					break;
				case "month":
					const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
					filtered = filtered.filter((t) => {
						const transactionDate = new Date(t.timestamp);
						return transactionDate >= monthAgo;
					});
					break;
				default:
					break;
			}
		}

		return filtered;
	};

	const calculateTransactionTotal = (transaction) => {
		const itemsTotal = transaction.items.reduce((sum, item) => {
			return sum + parseFloat(item.price || 0) * parseInt(item.quantity || 1);
		}, 0);
		return itemsTotal + parseFloat(transaction.fee || 0);
	};

	const getTransactionSummary = () => {
		const filtered = filterTransactions();
		const totalTransactions = filtered.length;
		const totalRevenue = filtered.reduce(
			(sum, t) => sum + calculateTransactionTotal(t),
			0
		);
		const ordersCount = filtered.filter((t) => t.type === "order").length;
		const reservationsCount = filtered.filter(
			(t) => t.type === "reservation"
		).length;

		return {
			totalTransactions,
			totalRevenue,
			ordersCount,
			reservationsCount,
		};
	};

	const filteredTransactions = filterTransactions();
	const summary = getTransactionSummary();

	if (loading) {
		return (
			<div className="transaction-history-loading">
				<div className="loading-spinner"></div>
				<p>Loading transaction history...</p>
			</div>
		);
	}

	return (
		<div className="transaction-history">
			<div className="transaction-history-header">
				<h1>Transaction History</h1>
			</div>

			{/* Summary Cards */}
			<div className="summary-cards">
				<div className="summary-card">
					<h3>Total Transactions</h3>
					<p>{summary.totalTransactions}</p>
				</div>
				<div className="summary-card">
					<h3>Total Revenue</h3>
					<p>₱{summary.totalRevenue.toFixed(2)}</p>
				</div>
				<div className="summary-card">
					<h3>Orders</h3>
					<p>{summary.ordersCount}</p>
				</div>
				<div className="summary-card">
					<h3>Reservations</h3>
					<p>{summary.reservationsCount}</p>
				</div>
			</div>

			{/* Filters */}
			<div className="filters-section">
				<div className="filter-group">
					<label>Transaction Type:</label>
					<select
						value={filterType}
						onChange={(e) => setFilterType(e.target.value)}
					>
						<option value="all">All Types</option>
						<option value="order">Orders</option>
						<option value="reservation">Reservations</option>
					</select>
				</div>

				<div className="filter-group">
					<label>Status:</label>
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
					>
						<option value="all">All Statuses</option>
						{statusOptions.map((status) => (
							<option key={status.value} value={status.value}>
								{status.label}
							</option>
						))}
					</select>
				</div>

				<div className="filter-group">
					<label>Date Range:</label>
					<select
						value={dateRange}
						onChange={(e) => setDateRange(e.target.value)}
					>
						<option value="all">All Time</option>
						<option value="today">Today</option>
						<option value="week">Last 7 Days</option>
						<option value="month">Last 30 Days</option>
					</select>
				</div>
			</div>

			{/* Transactions List */}
			<div className="transactions-list">
				{filteredTransactions.length === 0 ? (
					<div className="no-transactions">
						<p>No transactions found with the selected filters.</p>
					</div>
				) : (
					filteredTransactions.map((transaction) => (
						<div key={transaction.id} className="transaction-card">
							<div className="transaction-header">
								<div className="transaction-info">
									<h3>
										{transaction.type === "order"
											? "📦 Order"
											: "🗓️ Reservation"}{" "}
										#{transaction.id}
									</h3>
									<p className="transaction-date">
										{formatDate(transaction.timestamp)}
									</p>
								</div>
								<div className="transaction-status">
									<span
										className="status-badge"
										style={{
											backgroundColor: getStatusColor(transaction.status),
										}}
									>
										{getStatusLabel(transaction.status)}
									</span>
								</div>
							</div>

							<div className="transaction-details">
								<div className="customer-info">
									<h4>Customer Information</h4>
									{transaction.userInfo ? (
										<>
											<p>
												<strong>Name:</strong> {transaction.userInfo.fullName}
											</p>
											<p>
												<strong>Email:</strong> {transaction.userInfo.email}
											</p>
											{transaction.userInfo.contactNumber && (
												<p>
													<strong>Contact:</strong>{" "}
													{transaction.userInfo.contactNumber}
												</p>
											)}
										</>
									) : (
										<p>Customer information not available</p>
									)}
								</div>

								<div className="pickup-info">
									<h4>Pickup Information</h4>
									{transaction.pickupInfo ? (
										<>
											{transaction.pickupInfo.pickupDate && (
												<p>
													<strong>Date:</strong>{" "}
													{transaction.pickupInfo.pickupDate}
												</p>
											)}
											{transaction.pickupInfo.pickupTime && (
												<p>
													<strong>Time:</strong>{" "}
													{transaction.pickupInfo.pickupTime}
												</p>
											)}
										</>
									) : (
										<p>Pickup information not available</p>
									)}
								</div>

								<div className="payment-info">
									<h4>Payment Information</h4>
									<p>
										<strong>Method:</strong>{" "}
										{transaction.paymentMethod || "N/A"}
									</p>
									{transaction.paymentMethod === "gcash" &&
										transaction.paymentDetails && (
											<>
												<p>
													<strong>Account:</strong>{" "}
													{transaction.paymentDetails.accountName}
												</p>
												<p>
													<strong>Number:</strong>{" "}
													{transaction.paymentDetails.gcashNumber}
												</p>
											</>
										)}
								</div>
							</div>

							<div className="transaction-items">
								<h4>Items</h4>
								<div className="items-list">
									{transaction.items.map((item, index) => (
										<div key={index} className="item">
											<span className="item-name">{item.name}</span>
											<span className="item-quantity">
												x{item.quantity || 1}
											</span>
											<span className="item-price">
												₱
												{(
													parseFloat(item.price || 0) *
													parseInt(item.quantity || 1)
												).toFixed(2)}
											</span>
										</div>
									))}
								</div>
								<div className="transaction-total">
									<p>
										<strong>Service Fee:</strong> ₱
										{parseFloat(transaction.fee || 0).toFixed(2)}
									</p>
									<p>
										<strong>Total:</strong> ₱
										{calculateTransactionTotal(transaction).toFixed(2)}
									</p>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default TransactionHistory;
