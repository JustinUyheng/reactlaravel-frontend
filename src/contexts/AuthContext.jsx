import React, { createContext, useContext, useState, useEffect } from "react";
import {
	isAuthenticated,
	getCurrentUser,
	logoutUser,
	getUserProfile,
} from "../LoginSignup/action";
import { API_CONFIG } from "../config/api";

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated on app load
		if (isAuthenticated()) {
			// Immediately load user from localStorage
			const userData = getCurrentUser();
			if (userData) {
				setUser(userData);
				// Set loading to false immediately so components can render
				setLoading(false);
			}

			// Try to refresh from API in the background
			getUserProfile()
				.then((data) => {
					setUser(data.user);
					// Update localStorage with fresh data
					localStorage.setItem("user_data", JSON.stringify(data.user));
				})
				.catch((error) => {
					console.error("Failed to fetch user profile:", error);
					// Keep using localStorage data if API fails
					const userData = getCurrentUser();
					if (userData) {
						setUser(userData);
					}
				});
		} else {
			setLoading(false);
		}
	}, []);

	const login = (userData) => {
		setUser(userData);
	};

	const logout = async () => {
		await logoutUser();
		setUser(null);
	};

	// Function to refresh user profile
	const refreshProfile = async () => {
		if (isAuthenticated()) {
			try {
				const data = await getUserProfile();

				const userData = {
					...data.user,
					profile_picture_url:
						data.user.profile_picture_url ||
						(data.user.profile_picture
							? `${API_CONFIG.BASE_URL.replace("/api", "")}/storage/${data.user.profile_picture}`
							: null),
				};
				setUser(userData);
				localStorage.setItem("user_data", JSON.stringify(userData));
				return userData;
			} catch (error) {
				console.error("Failed to refresh profile:", error);
				throw error;
			}
		}
	};

	const value = {
		user,
		login,
		logout,
		refreshProfile,
		isAuthenticated: !!user,
		loading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
