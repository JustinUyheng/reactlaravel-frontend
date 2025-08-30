// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const API_CONFIG = {
	BASE_URL: API_URL,
	HEADERS: {
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

// Helper function to get JSON headers (with Content-Type)
export const getJsonHeaders = () => {
	const token = localStorage.getItem("auth_token");
	return {
		...API_CONFIG.HEADERS,
		"Content-Type": "application/json",
		Authorization: token ? `Bearer ${token}` : "",
	};
};

// Helper function to get FormData headers (auth only, no Content-Type)
export const getFormDataHeaders = () => {
	const token = localStorage.getItem("auth_token");
	return {
		Accept: "application/json",
		"X-Requested-With": "XMLHttpRequest",
		Authorization: token ? `Bearer ${token}` : "",
		// NO Content-Type - let browser set it for FormData
	};
};

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));

		// Handle validation errors (422)
		if (response.status === 422 && errorData.errors) {
			const validationErrors = Object.values(errorData.errors).flat();
			throw new Error(validationErrors.join(", "));
		}

		// Handle other errors
		throw new Error(
			errorData.message || `HTTP error! status: ${response.status}`
		);
	}
	return response.json();
};
