import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
	getAdminFeedback,
	getAllUsers,
	getAllVendors,
	getAllCustomers,
	getPendingVendors,
	approveVendor,
	rejectVendor,
} from "../LoginSignup/action";
import "./DashStyle/Dashboard.css";
import "./Dashboard.css";
import { toast } from "react-toastify";

const AdminDashboard = () => {
	const { user, isAuthenticated, loading: authLoading } = useAuth();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("dashboard");
	const [users, setUsers] = useState([]);
	const [vendors, setVendors] = useState([]);
	const [customers, setCustomers] = useState([]);
	const [pendingVendors, setPendingVendors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [feedback, setFeedback] = useState([]);
	const [feedbackMeta, setFeedbackMeta] = useState({
		current_page: 1,
		per_page: 20,
		total: 0,
	});
	const [feedbackFilters, setFeedbackFilters] = useState({
		store_id: "",
		min_rating: "",
		max_rating: "",
	});

	useEffect(() => {
		// Wait for auth context to finish loading
		if (authLoading) {
			return;
		}

		// Check if user is authenticated
		if (!isAuthenticated) {
			navigate("/auth");
			return;
		}

		// Check if user is admin
		if (user && user.role_id === 3) {
			// Load all dashboard data when component mounts
			loadDashboardData();
			return;
		} else {
			navigate("/auth");
			return;
		}
	}, [isAuthenticated, user, authLoading, navigate]);

	// Show loading while checking authentication
	if (authLoading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					fontSize: "18px",
				}}
			>
				Loading...
			</div>
		);
	}

	// Show error if user is not authenticated
	if (!isAuthenticated) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					fontSize: "18px",
					color: "red",
				}}
			>
				Please log in to access the admin dashboard.
			</div>
		);
	}

	// Show error if user is not admin
	if (user && user.role_id !== 3) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					fontSize: "18px",
					color: "red",
				}}
			>
				Access Denied. Admin privileges required.
			</div>
		);
	}

	const loadDashboardData = async () => {
		setLoading(true);
		setError("");

		try {
			// Load all data in parallel for better performance
			const [usersData, vendorsData, customersData, pendingData] =
				await Promise.all([
					getAllUsers(),
					getAllVendors(),
					getAllCustomers(),
					getPendingVendors(),
				]);

			setUsers(usersData.users);
			setVendors(vendorsData.users);
			setCustomers(customersData.users);
			setPendingVendors(pendingData.pending_vendors);
		} catch (error) {
			setError(error.message);
			console.error("Error loading dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		// Only load data if it hasn't been loaded yet
		if (tab === "all-users" && users.length === 0) {
			loadData(tab);
		} else if (tab === "vendors" && vendors.length === 0) {
			loadData(tab);
		} else if (tab === "customers" && customers.length === 0) {
			loadData(tab);
		} else if (tab === "pending-vendors" && pendingVendors.length === 0) {
			loadData(tab);
		} else if (tab === "feedback" && feedback.length === 0) loadData(tab);
	};

	const loadFeedback = async (page = 1) => {
		setLoading(true);
		setError("");
		try {
			const params = {
				per_page: feedbackMeta.per_page || 20,
				page,
			};
			if (feedbackFilters.store_id) params.store_id = feedbackFilters.store_id;
			if (feedbackFilters.min_rating)
				params.min_rating = feedbackFilters.min_rating;
			if (feedbackFilters.max_rating)
				params.max_rating = feedbackFilters.max_rating;

			const data = await getAdminFeedback(params);
			// Laravel paginator returns { data, current_page, per_page, total, ... }
			const p = data.feedback;
			setFeedback(Array.isArray(p.data) ? p.data : []);
			setFeedbackMeta({
				current_page: p.current_page,
				per_page: p.per_page,
				total: p.total,
				last_page: p.last_page,
			});
		} catch (err) {
			setError(err.message || "Failed to load feedback");
		} finally {
			setLoading(false);
		}
	};

	const loadData = async (tab) => {
		setLoading(true);
		setError("");

		try {
			switch (tab) {
				case "all-users": {
					const usersData = await getAllUsers();
					setUsers(usersData.users);
					break;
				}
				case "vendors": {
					const vendorsData = await getAllVendors();
					setVendors(vendorsData.users);
					break;
				}
				case "customers": {
					const customersData = await getAllCustomers();
					setCustomers(customersData.users);
					break;
				}
				case "pending-vendors": {
					const pendingData = await getPendingVendors();
					setPendingVendors(pendingData.pending_vendors);
					break;
				}
				case "feedback": {
					await loadFeedback(1);
					break;
				}
				default:
					break;
			}
		} catch (error) {
			setError(error.message);
			console.error("Error loading data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleApproveVendor = async (userId) => {
		try {
			await approveVendor(userId);
			toast.success("Vendor approved successfully!");
			loadData("pending-vendors"); // Refresh the list
		} catch (error) {
			toast.error("Failed to approve vendor: " + error.message);
		}
	};

	const handleRejectVendor = async (userId) => {
		if (
			window.confirm(
				"Are you sure you want to reject this vendor? This action cannot be undone."
			)
		) {
			try {
				await rejectVendor(userId);
				toast.success("Vendor rejected successfully!");
				loadData("pending-vendors"); // Refresh the list
			} catch (error) {
				toast.error("Failed to reject vendor: " + error.message);
			}
		}
	};

	const renderUserTable = (userList, title) => (
		<div className="admin-table-container">
			<h3>{title}</h3>
			{loading ? (
				<p>Loading...</p>
			) : (
				<table className="admin-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{userList.map((user) => (
							<tr key={user.id}>
								<td>{user.id}</td>
								<td>{`${user.firstname} ${user.lastname}`}</td>
								<td>{user.email}</td>
								<td>
									{user.role_id === 1
										? "Customer"
										: user.role_id === 2
											? "Vendor"
											: user.role_id === 3
												? "Admin"
												: "Unknown"}
								</td>
								<td>{user.is_approved ? "Approved" : "Pending"}</td>
								<td>
									{user.role_id === 2 && !user.is_approved && (
										<>
											<button
												onClick={() => handleApproveVendor(user.id)}
												className="btn-approve"
											>
												Approve
											</button>
											<button
												onClick={() => handleRejectVendor(user.id)}
												className="btn-reject"
											>
												Reject
											</button>
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);

	const renderFeedback = () => (
		<div className="admin-table-container">
			<h3>Feedback</h3>

			<div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
				<input
					type="number"
					placeholder="Store ID"
					value={feedbackFilters.store_id}
					onChange={(e) =>
						setFeedbackFilters({ ...feedbackFilters, store_id: e.target.value })
					}
					style={{ width: 120 }}
				/>
				<input
					type="number"
					placeholder="Min rating"
					min={1}
					max={5}
					value={feedbackFilters.min_rating}
					onChange={(e) =>
						setFeedbackFilters({
							...feedbackFilters,
							min_rating: e.target.value,
						})
					}
					style={{ width: 120 }}
				/>
				<input
					type="number"
					placeholder="Max rating"
					min={1}
					max={5}
					value={feedbackFilters.max_rating}
					onChange={(e) =>
						setFeedbackFilters({
							...feedbackFilters,
							max_rating: e.target.value,
						})
					}
					style={{ width: 120 }}
				/>
				<button onClick={() => loadFeedback(1)} disabled={loading}>
					{loading ? "Loading..." : "Apply"}
				</button>
			</div>

			{loading ? (
				<p>Loading...</p>
			) : (
				<table className="admin-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Rating</th>
							<th>Comment</th>
							<th>User</th>
							<th>Store</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{feedback.length === 0 ? (
							<tr>
								<td colSpan="6" style={{ textAlign: "center" }}>
									No feedback found
								</td>
							</tr>
						) : (
							feedback.map((f) => (
								<tr key={f.id}>
									<td>{f.id}</td>
									<td>{f.rating}</td>
									<td style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
										{f.comment || "-"}
									</td>
									<td>
										{f.user
											? `${f.user.firstname ?? ""} ${
													f.user.lastname ?? ""
												}`.trim() || f.user.email
											: "-"}
									</td>
									<td>{f.store ? f.store.business_name : "-"}</td>
									<td>{new Date(f.created_at).toLocaleString()}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			)}

			{/* pagination */}
			{feedbackMeta.total > feedbackMeta.per_page && (
				<div
					style={{
						marginTop: 12,
						display: "flex",
						gap: 8,
						alignItems: "center",
					}}
				>
					<button
						onClick={() =>
							loadFeedback(Math.max(1, (feedbackMeta.current_page || 1) - 1))
						}
						disabled={loading || feedbackMeta.current_page <= 1}
					>
						Prev
					</button>
					<span>
						Page {feedbackMeta.current_page} of {feedbackMeta.last_page}
					</span>
					<button
						onClick={() =>
							loadFeedback(
								Math.min(
									feedbackMeta.last_page,
									(feedbackMeta.current_page || 1) + 1
								)
							)
						}
						disabled={
							loading || feedbackMeta.current_page >= feedbackMeta.last_page
						}
					>
						Next
					</button>
				</div>
			)}
		</div>
	);

	return (
		<div className="admin-dashboard">
			<div className="admin-header">
				<h1>Admin Dashboard</h1>
				<p>
					Welcome, {user?.firstname} {user?.lastname}
				</p>
			</div>

			<div className="admin-nav">
				<button
					className={activeTab === "dashboard" ? "active" : ""}
					onClick={() => handleTabChange("dashboard")}
				>
					Dashboard
				</button>
				<button
					className={activeTab === "all-users" ? "active" : ""}
					onClick={() => handleTabChange("all-users")}
				>
					All Users
				</button>
				<button
					className={activeTab === "vendors" ? "active" : ""}
					onClick={() => handleTabChange("vendors")}
				>
					All Vendors
				</button>
				<button
					className={activeTab === "customers" ? "active" : ""}
					onClick={() => handleTabChange("customers")}
				>
					All Customers
				</button>
				<button
					className={activeTab === "pending-vendors" ? "active" : ""}
					onClick={() => handleTabChange("pending-vendors")}
				>
					Pending Vendors
				</button>
				<button
					className={activeTab === "feedback" ? "active" : ""}
					onClick={() => handleTabChange("feedback")}
				>
					Feedback
				</button>
			</div>

			<div className="admin-content">
				{error && <div className="error-message">{error}</div>}

				{activeTab === "dashboard" && (
					<div className="dashboard-overview">
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "20px",
							}}
						>
							<h2>System Overview</h2>
							<button
								onClick={loadDashboardData}
								disabled={loading}
								style={{
									padding: "8px 16px",
									backgroundColor: "#007bff",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: loading ? "not-allowed" : "pointer",
									opacity: loading ? 0.6 : 1,
								}}
							>
								{loading ? "Loading..." : "Refresh Data"}
							</button>
						</div>
						<div className="stats-grid">
							<div className="stat-card">
								<h3>Total Users</h3>
								<p>{loading ? "..." : users.length}</p>
							</div>
							<div className="stat-card">
								<h3>Total Vendors</h3>
								<p>{loading ? "..." : vendors.length}</p>
							</div>
							<div className="stat-card">
								<h3>Total Customers</h3>
								<p>{loading ? "..." : customers.length}</p>
							</div>
							<div className="stat-card">
								<h3>Pending Vendors</h3>
								<p>{loading ? "..." : pendingVendors.length}</p>
							</div>
						</div>
					</div>
				)}

				{activeTab === "all-users" && renderUserTable(users, "All Users")}
				{activeTab === "vendors" && renderUserTable(vendors, "All Vendors")}
				{activeTab === "customers" &&
					renderUserTable(customers, "All Customers")}
				{activeTab === "pending-vendors" &&
					renderUserTable(pendingVendors, "Pending Vendors")}
				{activeTab === "feedback" && renderFeedback()}
			</div>
		</div>
	);
};

export default AdminDashboard;
