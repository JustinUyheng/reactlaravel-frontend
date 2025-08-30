// Stores.jsx:
import React, { useEffect, useState, useMemo } from "react";
import "./styless/Store.css";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { API_CONFIG, getAuthHeaders } from "../config/api";

const Stores = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const [stores, setStores] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const isAvailableToday = location.pathname === "/available-today";

	useEffect(() => {
		const fetchStores = async () => {
			try {
				const res = await fetch(`${API_CONFIG.BASE_URL}/stores`, {
					method: "GET",
					headers: getAuthHeaders(),
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(
						err.message || `Failed to load stores (${res.status})`
					);
				}
				const data = await res.json();
				setStores(Array.isArray(data.stores) ? data.stores : []);
			} catch (e) {
				console.error(e);
				setError(e.message || "Failed to load stores");
			} finally {
				setLoading(false);
			}
		};

		fetchStores();
	}, []);

	const filteredStores = useMemo(() => {
		// Placeholder filter for "Available Today" if/when you add availability flags
		if (!isAvailableToday) return stores;
		return stores; // apply filter here later (e.g., store.is_available_today)
	}, [stores, isAvailableToday]);

	const handleTabClick = (path) => {
		if (location.pathname !== path) {
			navigate(path);
		}
	};

	const handleStoreClick = (store) => {
		// Navigate to store-specific page based on store ID
		// For now, we'll use a generic route, but you can make this dynamic
		navigate(`/store/${store.id}/products`);
	};

	if (loading) {
		return (
			<div className="stores-container" id="stores">
				<div className="breadcrumb">USTP &gt; Cafeteria</div>
				<div style={{ padding: 20 }}>Loading stores...</div>
			</div>
		);
	}

	return (
		<div className="stores-container" id="stores">
			<div className="breadcrumb">USTP &gt; Cafeteria</div>

			<div className="stores-tabs">
				<span
					className={`tab ${!isAvailableToday ? "active" : ""}`}
					onClick={() => handleTabClick("/stores")}
				>
					All Stores
				</span>
				<span
					className={`tab ${isAvailableToday ? "active" : ""}`}
					onClick={() => handleTabClick("/available-today")}
				>
					Available Today
				</span>
			</div>

			{error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}

			<div className="store-grid">
				{filteredStores.length === 0 ? (
					<div style={{ padding: 20 }}>
						<p>No stores found.</p>
						<p>Vendors need to create stores first.</p>
					</div>
				) : (
					filteredStores.map((store) => {
						const title = store.business_name || "Unnamed Store";
						const businessType = store.business_type || "Food";
						const description = store.description || "No description available";

						// Use store image if available, otherwise use placeholder
						const img = store.store_image_url || assets.food_1;

						return (
							<div
								key={store.id}
								className="store-card"
								onClick={() => handleStoreClick(store)}
							>
								<img
									src={img}
									alt={title}
									className="store-image"
									onError={(e) => {
										// Fallback to placeholder if image fails to load
										e.target.src = assets.food_1;
									}}
								/>
								<div className="store-info">
									<div className="store-title">{title}</div>
									<div className="store-type">{businessType}</div>
									{description && (
										<div className="store-description">
											{description.length > 50
												? `${description.substring(0, 50)}...`
												: description}
										</div>
									)}
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default Stores;
