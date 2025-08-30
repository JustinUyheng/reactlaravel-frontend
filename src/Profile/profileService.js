// profileService.js
const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Get auth token from wherever you store it
const getAuthToken = () => {
	return (
		localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
	);
};

// Common headers for authenticated requests
const getAuthHeaders = () => ({
	Authorization: `Bearer ${getAuthToken()}`,
	Accept: "application/json",
});

export const profileService = {
	/**
	 * Upload profile picture
	 * @param {File} file - The image file to upload
	 * @returns {Promise} API response
	 */
	async uploadProfilePicture(file) {
		const formData = new FormData();
		formData.append("profile_picture", file);

		const response = await fetch(`${API_BASE_URL}/profile/picture/upload`, {
			method: "POST",
			headers: getAuthHeaders(),
			body: formData,
		});

		return await response.json();
	},

	/**
	 * Delete profile picture
	 * @returns {Promise} API response
	 */
	async deleteProfilePicture() {
		const response = await fetch(`${API_BASE_URL}/profile/picture`, {
			method: "DELETE",
			headers: getAuthHeaders(),
		});

		return await response.json();
	},

	/**
	 * Get profile picture for a user
	 * @param {number} userId - User ID
	 * @returns {Promise} API response
	 */
	async getProfilePicture(userId) {
		const response = await fetch(`${API_BASE_URL}/profile/picture/${userId}`, {
			method: "GET",
			headers: getAuthHeaders(),
		});

		return await response.json();
	},

	/**
	 * Get current user profile
	 * @returns {Promise} API response
	 */
	async getCurrentUserProfile() {
		const response = await fetch(`${API_BASE_URL}/user/profile`, {
			method: "GET",
			headers: getAuthHeaders(),
		});

		return await response.json();
	},
};
