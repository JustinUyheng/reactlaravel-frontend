import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_CONFIG, getAuthHeaders } from "../config/api";
import { assets } from "../assets/assets";
import { useCart } from "../CartandOrder/CartContext"; // Import cart context
import { toast } from "react-toastify"; // Import toast for notifications
import "./StoreProducts.css";

const StoreProducts = () => {
	const { storeId } = useParams();
	const navigate = useNavigate();
	const { addToCart } = useCart(); // Get cart functions
	const [store, setStore] = useState(null);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [quantities, setQuantities] = useState({}); // Track quantities for each product

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

					// Initialize quantities for each product
					const initialQuantities = {};
					productsData.products?.forEach((product) => {
						initialQuantities[product.id] = 1;
					});
					setQuantities(initialQuantities);
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

	// Handle quantity changes
	const handleQuantityChange = (productId, newQuantity) => {
		if (newQuantity < 1) return;
		setQuantities((prev) => ({
			...prev,
			[productId]: newQuantity,
		}));
	};

	// Handle adding to cart (for ordering)
	const handleAddToCart = (product) => {
		const quantity = quantities[product.id] || 1;

		if (!product.is_available) {
			toast.error("This product is currently unavailable");
			return;
		}

		addToCart(
			{
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.image_path,
				store_id: store.id,
				store_name: store.business_name,
				type: "order", // or 'reserve' based on your cart system
			},
			quantity
		);

		toast.success(`${quantity}x ${product.name} added to cart!`);
	};

	// Handle reserving (if you have a separate reserve system)
	const handleReserve = (product) => {
		const quantity = quantities[product.id] || 1;

		if (!product.is_available) {
			toast.error("This product is currently unavailable");
			return;
		}

		addToCart(
			{
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.image_path,
				store_id: store.id,
				store_name: store.business_name,
				type: "reserve",
			},
			quantity
		);

		toast.success(`${quantity}x ${product.name} added to reserve!`);
	};

	// Get unique categories from products
	const categories = ["all", ...new Set(products.map((p) => p.category))];

	// Filter products by category
	const filteredProducts =
		selectedCategory === "all"
			? products
			: products.filter((product) => product.category === selectedCategory);

	if (loading) {
		return (
			<div className="store-products">
				<div className="loading-state">
					<div className="loading-spinner"></div>
					Loading store...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="store-products">
				<div className="error-state">
					<h3>Error Loading Store</h3>
					<p>{error}</p>
					<button onClick={() => navigate("/stores")} className="back-btn">
						← Back to Stores
					</button>
				</div>
			</div>
		);
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

			{/* Category Filter */}
			{categories.length > 1 && (
				<div className="category-filter">
					{categories.map((category) => (
						<button
							key={category}
							className={`category-btn ${selectedCategory === category ? "active" : ""}`}
							onClick={() => setSelectedCategory(category)}
						>
							{category === "all"
								? "All Products"
								: category.replace("_", " ").toUpperCase()}
						</button>
					))}
				</div>
			)}

			<div className="store-products-grid">
				{filteredProducts.length === 0 ? (
					<div className="empty-state">
						<h3>No Products Available</h3>
						<p>
							{selectedCategory === "all"
								? "This store doesn't have any products yet."
								: `No products found in the ${selectedCategory.replace("_", " ")} category.`}
						</p>
					</div>
				) : (
					filteredProducts.map((product) => (
						<div key={product.id} className="store-product-card">
							<div style={{ position: "relative" }}>
								<img
									src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${product.image_path}`}
									alt={product.name}
									className="store-product-image"
									onError={(e) => {
										e.target.style.display = "none";
										e.target.nextSibling.style.display = "block";
									}}
								/>
								{/* <div
									className="placeholder-image"
									style={{
										display: "none",
										width: "100%",
										height: "200px",
										background: "linear-gradient(45deg, #f0f0f0, #e0e0e0)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#999",
										fontSize: "14px",
									}}
								>
									No Image
								</div> */}
								{!product.is_available && (
									<div className="store-product-status unavailable">
										Unavailable
									</div>
								)}
							</div>
							<div className="store-product-info">
								<h3>{product.name}</h3>
								<p>{product.description}</p>
								<p className="price">₱{parseFloat(product.price).toFixed(2)}</p>

								{/* Quantity Selector */}
								<div className="quantity-selector">
									<label>Quantity:</label>
									<div className="quantity-controls">
										<button
											className="quantity-btn"
											onClick={() =>
												handleQuantityChange(
													product.id,
													(quantities[product.id] || 1) - 1
												)
											}
											disabled={!product.is_available}
										>
											-
										</button>
										<span className="quantity-display">
											{quantities[product.id] || 1}
										</span>
										<button
											className="quantity-btn"
											onClick={() =>
												handleQuantityChange(
													product.id,
													(quantities[product.id] || 1) + 1
												)
											}
											disabled={!product.is_available}
										>
											+
										</button>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="store-product-actions">
									<button
										className="add-to-cart-btn"
										onClick={() => handleAddToCart(product)}
										disabled={!product.is_available}
									>
										<img
											src={assets.order}
											alt="Add to cart"
											className="store-product-action-add-to-cart"
										/>
									</button>
									<button
										className="reserve-btn"
										onClick={() => handleReserve(product)}
										disabled={!product.is_available}
									>
										<img
											src={assets.reservation}
											alt="Reserve"
											className="store-product-action-reserve"
										/>
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default StoreProducts;
