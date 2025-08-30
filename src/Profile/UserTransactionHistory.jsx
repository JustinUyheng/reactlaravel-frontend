import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { orderService } from "../services/orderService";
import { toast } from "react-toastify";
import "./userstyle/UserTransactionHistory.css";

const UserTransactionHistory = () => {
	const { user, isAuthenticated } = useAuth();
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterType, setFilterType] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");
	const [dateRange, setDateRange] = useState("all");

	const statusOptions = [
		{ value: "preparing", label: "Preparing", color: "#ff9800" },
		{ value: "ready", label: "Ready for Pickup", color: "#4caf50" },
		{ value: "picked_up", label: "Picked Up", color: "#2196f3" },
		{ value: "cancelled", label: "Cancelled", color: "#f44336" },
		{ value: "delivered", label: "Delivered", color: "#9c27b0" },
	];

	useEffect(() => {
		if (isAuthenticated) {
			fetchUserTransactionHistory();
		}
	}, [isAuthenticated]);

	const fetchUserTransactionHistory = async () => {
		try {
			setLoading(true);
			const response = await orderService.getTransactionHistory();
			// Filter transactions for the current user
			const userTransactions = (response.transactions || []).filter(
				(transaction) => transaction.userInfo?.email === user?.email
			);
			setTransactions(userTransactions);
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
		const totalSpent = filtered.reduce(
			(sum, t) => sum + calculateTransactionTotal(t),
			0
		);
		const ordersCount = filtered.filter((t) => t.type === "order").length;
		const reservationsCount = filtered.filter(
			(t) => t.type === "reservation"
		).length;

		return {
			totalTransactions,
			totalSpent,
			ordersCount,
			reservationsCount,
		};
	};

	const filteredTransactions = filterTransactions();
	const summary = getTransactionSummary();

	if (loading) {
		return (
			<div className="user-transaction-loading">
				<div className="loading-spinner"></div>
				<p>Loading your transaction history...</p>
			</div>
		);
	}

	return (
		<div className="user-transaction-history">
			<div className="transaction-history-header">
				<h2>My Transaction History</h2>
				<p>Track your orders and reservations</p>
			</div>

			{/* Summary Cards */}
			<div className="summary-cards">
				<div className="summary-card">
					<h3>Total Transactions</h3>
					<p>{summary.totalTransactions}</p>
				</div>
				<div className="summary-card">
					<h3>Total Spent</h3>
					<p>₱{summary.totalSpent.toFixed(2)}</p>
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
						<p>Start ordering or reserving food to see your history here!</p>
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
								<h4>Items Ordered</h4>
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

export default UserTransactionHistory;
