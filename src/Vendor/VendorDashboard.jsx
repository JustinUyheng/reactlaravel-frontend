import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_CONFIG, getAuthHeaders } from "../config/api";
import "./VendorStyle/VendorDashboard.css";

const VendorDashboard = () => {
	const { user, isAuthenticated, loading: authLoading } = useAuth();
	const navigate = useNavigate();

	const [store, setStore] = useState(null);
	const [_, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchVendorStore = async () => {
		try {
			const response = await fetch(`${API_CONFIG.BASE_URL}/stores/vendor`, {
				method: "GET",
				headers: getAuthHeaders(),
			});

			if (response.ok) {
				const data = await response.json();
				setStore(data.store);
			} else if (response.status === 404) {
				// No store found - this is normal for new vendors
				setStore(null);
			} else {
				const errorData = await response.json();
				setError(errorData.message || "Failed to fetch store data");
			}
		} catch (error) {
			console.error("Error fetching store:", error);
			setError("Failed to fetch store data");
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

	// const handleStoreCreated = async () => {
	// 	await fetchVendorStore();
	// 	await refreshProfile();
	// };

	if (!isAuthenticated || user?.role_id !== 2) {
		return <div>Access denied. Vendor access required.</div>;
	}

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

	return (
		<div className="vendor-dashboard">
			<div className="vendor-header">
				<h1>Vendor Dashboard</h1>
				<p>
					Welcome, {user?.firstname} {user?.lastname}
				</p>
			</div>

			{error && (
				<div
					className="error-message"
					style={{ color: "red", margin: "10px 0" }}
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
						{/* <p>
							<strong>Address:</strong> {store.address}
						</p>
						<p>
							<strong>Contact:</strong> {store.contact_number}
						</p>
						{store.operating_hours && (
							<p>
								<strong>Hours:</strong> {store.operating_hours}
							</p>
						)} */}
					</div>

					<div className="store-actions">
						<button onClick={() => navigate("/vendor/products")}>
							Manage Products
						</button>
						<button onClick={() => navigate("/vendor/orders")}>
							View Orders
						</button>
						<button onClick={() => navigate("/vendor/profile")}>
							Edit Store Profile
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default VendorDashboard;
