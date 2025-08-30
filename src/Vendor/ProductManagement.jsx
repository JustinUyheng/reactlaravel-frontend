import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { productService } from "../services/productService";
import { toast } from "react-toastify";
import "./VendorStyle/ProductManagement.css";
import VendorNavigation from "./components/VendorNavigation";

const ProductManagement = () => {
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [activeCategory, setActiveCategory] = useState("all");
	const [selectedImageName, setSelectedImageName] = useState("");

	// Form states
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		category: "",
		price: "",
		image: null,
		is_available: true,
	});

	const categories = [
		{ value: "buffet", label: "Buffet" },
		{ value: "budget_meals", label: "Budget Meals" },
		{ value: "budget_snacks", label: "Budget Snacks" },
		{ value: "snacks", label: "Snacks" },
		{ value: "drinks", label: "Drinks" },
	];

	const formCategories = [
		{ value: "", label: "Select a category" },
		...categories,
	];

	useEffect(() => {
		if (!isAuthenticated || user?.role_id !== 2) {
			navigate("/auth");
			return;
		}
		fetchProducts();
	}, [isAuthenticated, user, navigate]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await productService.getProducts();
			setProducts(response.products || []);
		} catch (error) {
			toast.error("Failed to fetch products: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked, files } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				type === "checkbox" ? checked : type === "file" ? files[0] : value,
		}));

		// Update selected image name for display
		if (type === "file" && files[0]) {
			setSelectedImageName(files[0].name);
		} else if (type === "file" && !files[0]) {
			setSelectedImageName("");
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			category: "",
			price: "",
			image: null,
			is_available: true,
		});
		setSelectedImageName("");
	};

	const handleAddProduct = async (e) => {
		e.preventDefault();

		// Validate form data before sending
		if (!formData.name.trim()) {
			toast.error("Product name is required");
			return;
		}

		if (!formData.category) {
			toast.error("Please select a category");
			return;
		}

		if (!formData.price || parseFloat(formData.price) <= 0) {
			toast.error("Please enter a valid price");
			return;
		}

		try {
			// Ensure price is a number
			const productDataToSend = {
				...formData,
				price: parseFloat(formData.price),
			};

			console.log("Sending product data:", productDataToSend);

			await productService.createProduct(productDataToSend);
			toast.success("Product added successfully!");
			setShowAddModal(false);
			resetForm();
			fetchProducts();
		} catch (error) {
			console.error("Product creation error:", error);
			toast.error("Failed to add product: " + error.message);
		}
	};

	const handleEditProduct = async (e) => {
		e.preventDefault();
		try {
			await productService.updateProduct(selectedProduct.id, formData);
			toast.success("Product updated successfully!");
			setShowEditModal(false);
			setSelectedProduct(null);
			resetForm();
			fetchProducts();
		} catch (error) {
			toast.error("Failed to update product: " + error.message);
		}
	};

	const handleDeleteProduct = async (productId) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			try {
				await productService.deleteProduct(productId);
				toast.success("Product deleted successfully!");
				fetchProducts();
			} catch (error) {
				toast.error("Failed to delete product: " + error.message);
			}
		}
	};

	const openEditModal = (product) => {
		setSelectedProduct(product);
		setFormData({
			name: product.name,
			description: product.description || "",
			category: product.category,
			price: product.price.toString(),
			image: null,
			is_available: product.is_available,
		});
		setSelectedImageName("");
		setShowEditModal(true);
	};

	const filteredProducts =
		activeCategory === "all"
			? products
			: products.filter((product) => product.category === activeCategory);

	if (loading) {
		return (
			<div className="product-management-loading">
				<div className="loading-spinner"></div>
				<p>Loading products...</p>
			</div>
		);
	}

	return (
		<div className="product-management">
			<VendorNavigation />
			<div className="product-management-header">
				<h1>Product Management</h1>
				<button
					className="add-product-btn"
					onClick={() => setShowAddModal(true)}
				>
					+ Add Product
				</button>
			</div>

			{/* Category Filter */}
			<div className="category-filter">
				<button
					className={`filter-btn ${activeCategory === "all" ? "active" : ""}`}
					onClick={() => setActiveCategory("all")}
				>
					All Products
				</button>
				{categories.map((category) => (
					<button
						key={category.value}
						className={`filter-btn ${activeCategory === category.value ? "active" : ""}`}
						onClick={() => setActiveCategory(category.value)}
					>
						{category.label}
					</button>
				))}
			</div>

			{/* Products Grid */}
			<div className="products-grid">
				{filteredProducts.length === 0 ? (
					<div className="no-products">
						<p>No products found in this category.</p>
						<button onClick={() => setShowAddModal(true)}>
							Add your first product
						</button>
					</div>
				) : (
					filteredProducts.map((product) => (
						<div key={product.id} className="product-card">
							<div className="product-image">
								{product.image_path ? (
									<img
										src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/${product.image_path}`}
										alt={product.name}
										onLoad={() => {
											console.log(
												"Image loaded successfully",
												product.image_url
											);
										}}
									/>
								) : (
									<div className="placeholder-image">No Image</div>
								)}
								<div className="product-status">
									<span
										className={`status-badge ${product.is_available ? "available" : "unavailable"}`}
									>
										{product.is_available ? "Available" : "Unavailable"}
									</span>
								</div>
							</div>

							<div className="product-info">
								<h3>{product.name}</h3>
								<p className="product-description">{product.description}</p>
								<p className="product-category">
									{categories.find((c) => c.value === product.category)?.label}
								</p>
								<p className="product-price">
									₱{parseFloat(product.price).toFixed(2)}
								</p>
							</div>

							<div className="product-actions">
								<button
									className="edit-btn"
									onClick={() => openEditModal(product)}
								>
									Edit
								</button>
								<button
									className="delete-btn"
									onClick={() => handleDeleteProduct(product.id)}
								>
									Delete
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{/* Add Product Modal */}
			{showAddModal && (
				<div className="modal-overlay">
					<div className="modal">
						<div className="modal-header">
							<h2>Add New Product</h2>
							<button
								className="close-btn"
								onClick={() => {
									setShowAddModal(false);
									resetForm();
								}}
							>
								×
							</button>
						</div>
						<form onSubmit={handleAddProduct} className="product-form">
							<div className="form-group">
								<label>Product Name *</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div className="form-group">
								<label>Description</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows="3"
								/>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Category *</label>
									<select
										name="category"
										value={formData.category}
										onChange={handleInputChange}
										required
									>
										{formCategories.map((category) => (
											<option key={category.value} value={category.value}>
												{category.label}
											</option>
										))}
									</select>
								</div>

								<div className="form-group">
									<label>Price (₱) *</label>
									<input
										type="number"
										name="price"
										value={formData.price}
										onChange={handleInputChange}
										min="0"
										step="0.01"
										required
									/>
								</div>
							</div>

							<div className="form-group">
								<label>Product Image</label>
								<input
									type="file"
									name="image"
									onChange={handleInputChange}
									accept="image/*"
									id="product-image-input"
									style={{ display: "none" }}
								/>
								<div className="file-input-wrapper">
									<button
										type="button"
										className="file-select-btn"
										onClick={() =>
											document.getElementById("product-image-input").click()
										}
									>
										Choose Image
									</button>
									{selectedImageName && (
										<div className="selected-file">
											<span className="file-name">{selectedImageName}</span>
											<button
												type="button"
												className="remove-file-btn"
												onClick={() => {
													setFormData((prev) => ({ ...prev, image: null }));
													setSelectedImageName("");
													document.getElementById("product-image-input").value =
														"";
												}}
											>
												×
											</button>
										</div>
									)}
								</div>
							</div>

							<div className="form-actions">
								<button
									type="button"
									onClick={() => {
										setShowAddModal(false);
										resetForm();
									}}
								>
									Cancel
								</button>
								<button type="submit">Add Product</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Edit Product Modal */}
			{showEditModal && selectedProduct && (
				<div className="modal-overlay">
					<div className="modal">
						<div className="modal-header">
							<h2>Edit Product</h2>
							<button
								className="close-btn"
								onClick={() => {
									setShowEditModal(false);
									setSelectedProduct(null);
									resetForm();
								}}
							>
								×
							</button>
						</div>
						<form onSubmit={handleEditProduct} className="product-form">
							<div className="form-group">
								<label>Product Name *</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div className="form-group">
								<label>Description</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows="3"
								/>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Category *</label>
									<select
										name="category"
										value={formData.category}
										onChange={handleInputChange}
										required
									>
										{formCategories.map((category) => (
											<option key={category.value} value={category.value}>
												{category.label}
											</option>
										))}
									</select>
								</div>

								<div className="form-group">
									<label>Price (₱) *</label>
									<input
										type="number"
										name="price"
										value={formData.price}
										onChange={handleInputChange}
										min="0"
										step="0.01"
										required
									/>
								</div>
							</div>

							<div className="form-group">
								<label>Product Image</label>
								<input
									type="file"
									name="image"
									onChange={handleInputChange}
									accept="image/*"
									id="edit-product-image-input"
									style={{ display: "none" }}
								/>
								<div className="file-input-wrapper">
									<button
										type="button"
										className="file-select-btn"
										onClick={() =>
											document
												.getElementById("edit-product-image-input")
												.click()
										}
									>
										Choose New Image
									</button>
									{selectedImageName && (
										<div className="selected-file">
											<span className="file-name">{selectedImageName}</span>
											<button
												type="button"
												className="remove-file-btn"
												onClick={() => {
													setFormData((prev) => ({ ...prev, image: null }));
													setSelectedImageName("");
													document.getElementById(
														"edit-product-image-input"
													).value = "";
												}}
											>
												×
											</button>
										</div>
									)}
									{selectedProduct.image_path && !selectedImageName && (
										<div className="current-image-info">
											<p>
												Current image:{" "}
												{selectedProduct.image_path.split("/").pop()}
											</p>
											<p className="image-note">
												Select a new image to replace the current one
											</p>
										</div>
									)}
								</div>
							</div>

							<div className="form-group">
								<label className="checkbox-label">
									<input
										type="checkbox"
										name="is_available"
										checked={formData.is_available}
										onChange={handleInputChange}
									/>
									Product is available for purchase
								</label>
							</div>

							<div className="form-actions">
								<button
									type="button"
									onClick={() => {
										setShowEditModal(false);
										setSelectedProduct(null);
										resetForm();
									}}
								>
									Cancel
								</button>
								<button type="submit">Update Product</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductManagement;
