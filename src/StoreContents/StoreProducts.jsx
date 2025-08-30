import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_CONFIG, getAuthHeaders } from "../config/api";
import { assets } from "../assets/assets";
import "./StoreProducts.css";

const StoreProducts = () => {
	const { storeId } = useParams();
	const navigate = useNavigate();
	const [store, setStore] = useState(null);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchStoreAndProducts = async () => {
			try {
				// Fetch store details
				const storeRes = await fetch(
					`${API_CONFIG.BASE_URL}/stores/${storeId}`,
					{
						method: "GET",
						headers: getAuthHeaders(),
					}
				);

				if (!storeRes.ok) {
					throw new Error("Store not found");
				}

				const storeData = await storeRes.json();
				setStore(storeData.store);

				// Fetch store products
				const productsRes = await fetch(
					`${API_CONFIG.BASE_URL}/stores/${storeId}/products`,
					{
						method: "GET",
						headers: getAuthHeaders(),
					}
				);

				if (productsRes.ok) {
					const productsData = await productsRes.json();
					setProducts(productsData.products || []);
				}
			} catch (e) {
				console.error(e);
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchStoreAndProducts();
	}, [storeId]);

	if (loading) {
		return <div>Loading store...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="store-products">
			<div className="store-header">
				<button onClick={() => navigate("/stores")} className="back-btn">
					← Back to Stores
				</button>
				<div className="store-header-content">
					<h1>{store?.business_name}</h1>
					<p>{store?.business_type}</p>
					{store?.description && (
						<p style={{ marginTop: "10px", opacity: 0.8 }}>
							{store.description}
						</p>
					)}
				</div>
			</div>

			<div className="products-grid">
				{products.length === 0 ? (
					<div>No products available in this store.</div>
				) : (
					products.map((product) => (
						<div key={product.id} className="product-card">
							<img
								src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${product.image_path}`}
								alt={product.name}
								className="product-image"
							/>
							<div className="product-info">
								<h3>{product.name}</h3>
								<p>{product.description}</p>
								<p className="price">₱{product.price}</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default StoreProducts;
