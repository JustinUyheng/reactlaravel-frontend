// export const loginUser = async (userData) => {
//     const res = await fetch(`${API_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//     })

//     if (!res.ok) throw new Error('Login failed!');
//     return await res.json();
// }

// export const registerUser = async (userData) => {
//     const res = await fetch(`${API_URL}/auth/register`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//     })

//     if (!res.ok) throw new Error('Registration failed!');
//     return await res.json();
// }

import { API_CONFIG, getAuthHeaders, handleApiResponse } from "../config/api";

export const loginUser = async (userData) => {
	const res = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
		method: "POST",
		headers: API_CONFIG.HEADERS,
		body: JSON.stringify(userData),
	});

	const data = await handleApiResponse(res);

	// Store the token
	if (data.token) {
		localStorage.setItem("auth_token", data.token);
		localStorage.setItem("user_data", JSON.stringify(data.user));
	}

	return data;
};

export const registerUser = async (userData) => {
	console.log("testing", userData);
	const res = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
		method: "POST",
		headers: API_CONFIG.HEADERS,
		body: JSON.stringify(userData),
	});

	return await handleApiResponse(res);
};

export const logoutUser = async () => {
	try {
		const res = await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
			method: "POST",
			headers: getAuthHeaders(),
		});

		if (res.ok) {
			// Clear local storage
			localStorage.removeItem("auth_token");
			localStorage.removeItem("user_data");
		}
	} catch (error) {
		console.error("Logout error:", error);
	} finally {
		// Always clear local storage even if API call fails
		localStorage.removeItem("auth_token");
		localStorage.removeItem("user_data");
	}
};

// Helper function to get user profile
export const getUserProfile = async () => {
	const res = await fetch(`${API_CONFIG.BASE_URL}/user/profile`, {
		method: "GET",
		headers: getAuthHeaders(),
	});

	if (!res.ok) {
		const errorData = await res.json().catch(() => ({}));
		console.error("getUserProfile error:", errorData);
		throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
	}
	const data = await res.json();
	console.log("getUserProfile response data:", data);

	return data;
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
	return !!localStorage.getItem("auth_token");
};

// Helper function to get current user data
export const getCurrentUser = () => {
	const userData = localStorage.getItem("user_data");
	return userData ? JSON.parse(userData) : null;
};

// Admin API functions
export const getAllUsers = async () => {
	const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users`, {
		method: "GET",
		headers: getAuthHeaders(),
	});

	return await handleApiResponse(res);
};

export const getAllVendors = async () => {
	const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users/vendors`, {
		method: "GET",
		headers: getAuthHeaders(),
	});

	return await handleApiResponse(res);
};

export const getAllCustomers = async () => {
	const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users/customers`, {
		method: "GET",
		headers: getAuthHeaders(),
	});

	return await handleApiResponse(res);
};

export const getPendingVendors = async () => {
	const res = await fetch(`${API_CONFIG.BASE_URL}/admin/pending-vendors`, {
		method: "GET",
		headers: getAuthHeaders(),
	});

	return await handleApiResponse(res);
};

export const approveVendor = async (userId) => {
	const res = await fetch(
		`${API_CONFIG.BASE_URL}/admin/vendors/${userId}/approve`,
		{
			method: "POST",
			headers: getAuthHeaders(),
		}
	);

	return await handleApiResponse(res);
};

export const rejectVendor = async (userId) => {
	const res = await fetch(
		`${API_CONFIG.BASE_URL}/admin/vendors/${userId}/reject`,
		{
			method: "POST",
			headers: getAuthHeaders(),
		}
	);

	return await handleApiResponse(res);
};

export const getUserById = async (userId) => {
	const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users/${userId}`, {
		method: "GET",
		headers: getAuthHeaders(),
	});

	return await handleApiResponse(res);
};

export const createStore = async (storeData) => {
	const res = await fetch(`${API_CONFIG.BASE_URL}/stores/create`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify(storeData),
	});

	return await handleApiResponse(res);
};

export const getAdminFeedback = async (params = {}) => {
	const query = new URLSearchParams(params).toString();
	const url = `${API_CONFIG.BASE_URL}/admin/feedback${
		query ? `?${query}` : ""
	}`;

	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders(),
	});

	return await handleApiResponse(res);
};
