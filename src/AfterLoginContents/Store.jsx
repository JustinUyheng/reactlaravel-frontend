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
					<div style={{ padding: 20 }}>No stores found.</div>
				) : (
					filteredStores.map((store) => {
						const title = store.business_name || "Store";
						const img = assets.food_1; // placeholder image until you add images per store
						// Choose route based on business_name until you have dynamic store detail pages
						const route = "/france-bistro-stores";

						return (
							<div
								key={store.id || `${title}-${store.user_id}`}
								className="store-card"
								onClick={() => navigate(route)}
							>
								<img src={img} alt={title} className="store-image" />
								<div className="store-title">{title}</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default Stores;
