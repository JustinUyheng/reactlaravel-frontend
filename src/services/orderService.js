import { API_CONFIG, getAuthHeaders, handleApiResponse } from "../config/api";

export const orderService = {
	/**
	 * Get all orders for the vendor's store
	 */
	async getOrders() {
		const response = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
			method: "GET",
			headers: getAuthHeaders(),
		});
		return handleApiResponse(response);
	},

	/**
	 * Update order status
	 */
	async updateOrderStatus(orderId, status) {
		const response = await fetch(
			`${API_CONFIG.BASE_URL}/orders/${orderId}/status`,
			{
				method: "PUT",
				headers: getAuthHeaders(),
				body: JSON.stringify({ status }),
			}
		);
		return handleApiResponse(response);
	},

	/**
	 * Get order statistics
	 */
	async getOrderStatistics() {
		const response = await fetch(`${API_CONFIG.BASE_URL}/orders/statistics`, {
			method: "GET",
			headers: getAuthHeaders(),
		});
		return handleApiResponse(response);
	},

	/**
	 * Get transaction history
	 */
	async getTransactionHistory() {
		// For now, we'll use localStorage as the backend isn't fully implemented
		// In a real implementation, this would fetch from the API
		const historyData = localStorage.getItem("orderHistory");
		if (historyData) {
			try {
				const parsedData = JSON.parse(historyData);
				return {
					success: true,
					transactions: parsedData.sort(
						(a, b) => new Date(b.timestamp) - new Date(a.timestamp)
					),
				};
			} catch (error) {
				console.error("Failed to parse transaction history:", error);
				return { success: true, transactions: [] };
			}
		}
		return { success: true, transactions: [] };
	},
};
