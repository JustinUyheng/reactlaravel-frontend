import React from "react";
import { useAuth } from "../contexts/AuthContext";

const AdminTest = () => {
	const { user, isAuthenticated, loading } = useAuth();

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h2>Admin Authentication Test</h2>
			<div style={{ marginBottom: "10px" }}>
				<strong>Loading:</strong> {loading ? "Yes" : "No"}
			</div>
			<div style={{ marginBottom: "10px" }}>
				<strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
			</div>
			<div style={{ marginBottom: "10px" }}>
				<strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "None"}
			</div>
			<div style={{ marginBottom: "10px" }}>
				<strong>Role ID:</strong> {user?.role_id || "None"}
			</div>
			<div style={{ marginBottom: "10px" }}>
				<strong>Is Admin:</strong> {user?.role_id === 3 ? "Yes" : "No"}
			</div>
			<div style={{ marginBottom: "10px" }}>
				<strong>Local Storage Token:</strong>{" "}
				{localStorage.getItem("auth_token") ? "Present" : "Missing"}
			</div>
			<div style={{ marginBottom: "10px" }}>
				<strong>Local Storage User Data:</strong>{" "}
				{localStorage.getItem("user_data") ? "Present" : "Missing"}
			</div>
		</div>
	);
};

export default AdminTest;
