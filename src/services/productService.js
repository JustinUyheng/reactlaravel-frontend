import {
	API_CONFIG,
	getAuthHeaders,
	getJsonHeaders,
	getFormDataHeaders,
	handleApiResponse,
} from "../config/api";

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
		// Check if there's an image file
		if (productData.image && productData.image instanceof File) {
			// Use FormData for file upload
			const formData = new FormData();
			formData.append("name", productData.name.trim());
			formData.append("description", productData.description || "");
			formData.append("category", productData.category);
			formData.append("price", productData.price.toString());
			formData.append("image", productData.image);

			const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
				method: "POST",
				headers: getFormDataHeaders(), // Use the clean FormData headers
				body: formData,
			});

			return handleApiResponse(response);
		} else {
			// Use JSON for data without image
			const jsonData = {
				name: productData.name.trim(),
				description: productData.description || "",
				category: productData.category,
				price: parseFloat(productData.price),
			};

			const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
				method: "POST",
				headers: getJsonHeaders(), // Use JSON headers
				body: JSON.stringify(jsonData),
			});

			return handleApiResponse(response);
		}
	},

	/**
	 * Update an existing product
	 */
	async updateProduct(id, productData) {
		// Check if there's an image file
		if (productData.image && productData.image instanceof File) {
			// Use FormData with POST + _method for file upload
			const formData = new FormData();
			formData.append("_method", "POST"); // Laravel method spoofing
			formData.append("name", productData.name.trim());
			formData.append("description", productData.description || "");
			formData.append("category", productData.category);
			formData.append("price", productData.price.toString());
			formData.append("is_available", productData.is_available ? "1" : "0");
			formData.append("image", productData.image);

			const response = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
				method: "POST", // Use POST with _method spoofing
				headers: getFormDataHeaders(), // Use clean FormData headers
				body: formData,
			});

			return handleApiResponse(response);
		} else {
			// Use JSON for data without image
			const jsonData = {
				name: productData.name.trim(),
				description: productData.description || "",
				category: productData.category,
				price: parseFloat(productData.price),
				is_available: productData.is_available,
			};

			const response = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
				method: "POST",
				headers: getJsonHeaders(), // Use JSON headers
				body: JSON.stringify(jsonData),
			});

			return handleApiResponse(response);
		}
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
