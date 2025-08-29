// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const API_CONFIG = {
	BASE_URL: API_URL,
	HEADERS: {
		"Content-Type": "application/json",
		Accept: "application/json",
		"X-Requested-With": "XMLHttpRequest",
	},
};

// Helper function to get auth headers with token
export const getAuthHeaders = () => {
	const token = localStorage.getItem("auth_token");
	return {
		...API_CONFIG.HEADERS,
		Authorization: token ? `Bearer ${token}` : "",
	};
};

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.message || `HTTP error! status: ${response.status}`
		);
	}
	return response.json();
};
