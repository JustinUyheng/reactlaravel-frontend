import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_CONFIG, getAuthHeaders } from "../config/api";
import "./VendorStyle/VendorDashboard.css";

const VendorDashboard = () => {
	const { user, isAuthenticated, loading: authLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [store, setStore] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchVendorStore = async () => {
		try {
			setError(null);
			const response = await fetch(`${API_CONFIG.BASE_URL}/store`, {
				method: "GET",
				headers: getAuthHeaders(),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.store) {
					setStore(data.store);
				} else {
					setStore(null);
				}
			} else if (response.status === 404) {
				// No store found - this is normal for new vendors
				setStore(null);
			} else {
				const errorData = await response.json();
				setError(errorData.message || "Failed to fetch store data");
				setStore(null);
			}
		} catch (error) {
			console.error("Error fetching store:", error);
			setError("Failed to fetch store data");
			setStore(null);
		}
	};

	useEffect(() => {
		if (authLoading) {
			console.log("Auth context still loading...");
			return;
		}
		// Check if user is authenticated and is a vendor
		if (!isAuthenticated || user?.role_id !== 2) {
			navigate("/auth");
			return;
		}

		// Fetch store data
		fetchVendorStore().finally(() => {
			setLoading(false);
		});
	}, [isAuthenticated, user, authLoading, navigate]);

	const handleNavigation = (path) => {
		navigate(path);
	};

	const getCurrentPageTitle = () => {
		const path = location.pathname;
		if (path === "/vendor/dashboard") return "Dashboard";
		if (path === "/vendor/products") return "Product Management";
		if (path === "/vendor/orders") return "Order Management";
		if (path === "/vendor/transactions") return "Transaction History";
		if (path === "/vendor/profile") return "Store Profile";
		if (path === "/vendor/create-store") return "Create Store";
		return "Vendor Dashboard";
	};

	if (!isAuthenticated || user?.role_id !== 2) {
		return <div>Access denied. Vendor access required.</div>;
	}

	if (authLoading || loading) {
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

	return (
		<div className="vendor-dashboard">
			{/* Navigation Header */}
			<div className="vendor-nav-header">
				<div className="vendor-nav-left">
					{location.pathname !== "/vendor/dashboard" && (
						<button
							className="back-btn"
							onClick={() => navigate("/vendor/dashboard")}
						>
							← Back to Dashboard
						</button>
					)}
				</div>
				<div className="vendor-nav-center">
					<h1>{getCurrentPageTitle()}</h1>
				</div>
				<div className="vendor-nav-right">
					<button className="home-btn" onClick={() => navigate("/homepage")}>
						Home
					</button>
				</div>
			</div>

			{/* Breadcrumb Navigation */}
			<div className="vendor-breadcrumb">
				<button
					className="breadcrumb-item"
					onClick={() => navigate("/vendor/dashboard")}
				>
					Dashboard
				</button>
				{location.pathname !== "/vendor/dashboard" && (
					<>
						<span className="breadcrumb-separator">/</span>
						<span className="breadcrumb-current">{getCurrentPageTitle()}</span>
					</>
				)}
			</div>
			{/* Main Content */}
			<div className="vendor-content">
				{/* ... existing dashboard content ... */}
				<div className="vendor-header">
					<h1>Vendor Dashboard</h1>
					<p>
						Welcome, {user?.firstname} {user?.lastname}
					</p>
				</div>
				{error && (
					<div
						className="error-message"
						style={{
							color: "red",
							margin: "10px 0",
							padding: "10px",
							backgroundColor: "#ffebee",
							borderRadius: "4px",
						}}
					>
						{error}
					</div>
				)}

				{!store ? (
					<div className="no-store-section">
						<h2>Create Your Store</h2>
						<p>You need to create a store to start selling your products.</p>
						<button
							onClick={() => navigate("/vendor/create-store")}
							className="create-store-btn"
						>
							Create Store
						</button>
					</div>
				) : (
					<div className="store-section">
						<h2>Your Store: {store.business_name}</h2>
						<div className="store-info">
							<p>
								<strong>Business Type:</strong> {store.business_type}
							</p>
							{store.description && (
								<p>
									<strong>Description:</strong> {store.description}
								</p>
							)}
							{store.address && (
								<p>
									<strong>Address:</strong> {store.address}
								</p>
							)}
							{store.contact_number && (
								<p>
									<strong>Contact:</strong> {store.contact_number}
								</p>
							)}
							{store.operating_hours && (
								<p>
									<strong>Hours:</strong> {store.operating_hours}
								</p>
							)}
						</div>

						<div className="store-actions">
							<button onClick={() => navigate("/vendor/products")}>
								Manage Products
							</button>
							<button onClick={() => navigate("/vendor/orders")}>
								View Orders
							</button>
							<button onClick={() => navigate("/vendor/transactions")}>
								Transaction History
							</button>
							<button onClick={() => navigate("/vendor/profile")}>
								Edit Store Profile
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default VendorDashboard;
