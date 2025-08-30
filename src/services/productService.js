import { API_CONFIG, getAuthHeaders, handleApiResponse } from "../config/api";

export const productService = {
	/**
	 * Get all products for the vendor's store
	 */
	async getProducts() {
		const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
			method: "GET",
			headers: getAuthHeaders(),
		});
		return handleApiResponse(response);
	},

	/**
	 * Create a new product
	 */
	async createProduct(productData) {
		const formData = new FormData();

		// Add text fields
		formData.append("name", productData.name);
		formData.append("description", productData.description || "");
		formData.append("category", productData.category);
		formData.append("price", productData.price);

		// Add image if provided
		if (productData.image) {
			formData.append("image", productData.image);
		}

		const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
			method: "POST",
			headers: {
				...getAuthHeaders(),
				// Remove Content-Type for FormData
				"Content-Type": undefined,
			},
			body: formData,
		});
		return handleApiResponse(response);
	},

	/**
	 * Update an existing product
	 */
	async updateProduct(id, productData) {
		const formData = new FormData();

		// Add text fields
		formData.append("name", productData.name);
		formData.append("description", productData.description || "");
		formData.append("category", productData.category);
		formData.append("price", productData.price);
		formData.append("is_available", productData.is_available);

		// Add image if provided
		if (productData.image) {
			formData.append("image", productData.image);
		}

		const response = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
			method: "PUT",
			headers: {
				...getAuthHeaders(),
				// Remove Content-Type for FormData
				"Content-Type": undefined,
			},
			body: formData,
		});
		return handleApiResponse(response);
	},

	/**
	 * Delete a product
	 */
	async deleteProduct(id) {
		const response = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
			method: "DELETE",
			headers: getAuthHeaders(),
		});
		return handleApiResponse(response);
	},
};
