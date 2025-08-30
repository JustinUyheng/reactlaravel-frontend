import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_CONFIG, getAuthHeaders, handleApiResponse } from "../config/api";
import { toast } from "react-toastify";
import "./VendorStyle/StoreProfile.css";
import VendorNavigation from "./components/VendorNavigation";

const StoreProfile = () => {
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [store, setStore] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const [formData, setFormData] = useState({
		business_name: "",
		business_type: "",
		description: "",
		address: "",
		contact_number: "",
		operating_hours: "",
		store_image: null,
	});

	const businessTypes = [
		"Restaurant",
		"Cafeteria",
		"Food Stall",
		"Catering Service",
		"Bakery",
		"Other",
	];

	useEffect(() => {
		if (!isAuthenticated || user?.role_id !== 2) {
			navigate("/auth");
			return;
		}
		fetchStoreProfile();
	}, [isAuthenticated, user, navigate]);

	const fetchStoreProfile = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${API_CONFIG.BASE_URL}/store`, {
				method: "GET",
				headers: getAuthHeaders(),
			});

			if (response.ok) {
				const data = await response.json();
				setStore(data.store);
				setFormData({
					business_name: data.store.business_name || "",
					business_type: data.store.business_type || "",
					description: data.store.description || "",
					address: data.store.address || "",
					contact_number: data.store.contact_number || "",
					operating_hours: data.store.operating_hours || "",
					store_image: null,
				});
			} else if (response.status === 404) {
				toast.error("Store not found. Please create a store first.");
				navigate("/vendor/dashboard");
			} else {
				const errorData = await response.json();
				toast.error(errorData.message || "Failed to fetch store profile");
			}
		} catch (error) {
			toast.error("Failed to fetch store profile: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value, files } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: files ? files[0] : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);

			const formDataToSend = new FormData();
			Object.keys(formData).forEach((key) => {
				if (formData[key] !== null) {
					formDataToSend.append(key, formData[key]);
				}
			});

			const response = await fetch(`${API_CONFIG.BASE_URL}/store`, {
				method: "PUT",
				headers: {
					...getAuthHeaders(),
					"Content-Type": undefined, // Remove for FormData
				},
				body: formDataToSend,
			});

			if (response.ok) {
				const data = await response.json();
				setStore(data.store);
				setIsEditing(false);
				toast.success("Store profile updated successfully!");
			} else {
				const errorData = await response.json();
				toast.error(errorData.message || "Failed to update store profile");
			}
		} catch (error) {
			toast.error("Failed to update store profile: " + error.message);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="store-profile-loading">
				<div className="loading-spinner"></div>
				<p>Loading store profile...</p>
			</div>
		);
	}

	if (!store) {
		return (
			<div className="store-profile-error">
				<p>Store not found. Please create a store first.</p>
				<button onClick={() => navigate("/vendor/dashboard")}>
					Back to Dashboard
				</button>
			</div>
		);
	}

	return (
		<div className="store-profile">
			<VendorNavigation />
			<div className="store-profile-header">
				<h1>Store Profile</h1>
				<button
					className={`edit-btn ${isEditing ? "cancel" : ""}`}
					onClick={() => setIsEditing(!isEditing)}
				>
					{isEditing ? "Cancel" : "Edit Profile"}
				</button>
			</div>

			<form onSubmit={handleSubmit} className="store-profile-form">
				<div className="form-section">
					<h2>Basic Information</h2>

					<div className="form-group">
						<label>Business Name *</label>
						<input
							type="text"
							name="business_name"
							value={formData.business_name}
							onChange={handleInputChange}
							disabled={!isEditing}
							required
						/>
					</div>

					<div className="form-group">
						<label>Business Type *</label>
						<select
							name="business_type"
							value={formData.business_type}
							onChange={handleInputChange}
							disabled={!isEditing}
							required
						>
							<option value="">Select Business Type</option>
							{businessTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label>Description</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							disabled={!isEditing}
							rows="4"
							placeholder="Tell customers about your business..."
						/>
					</div>
				</div>

				<div className="form-section">
					<h2>Contact Information</h2>

					<div className="form-group">
						<label>Address</label>
						<textarea
							name="address"
							value={formData.address}
							onChange={handleInputChange}
							disabled={!isEditing}
							rows="3"
							placeholder="Enter your business address..."
						/>
					</div>

					<div className="form-group">
						<label>Contact Number</label>
						<input
							type="tel"
							name="contact_number"
							value={formData.contact_number}
							onChange={handleInputChange}
							disabled={!isEditing}
							placeholder="Enter contact number..."
						/>
					</div>
				</div>

				<div className="form-section">
					<h2>Operating Hours</h2>

					<div className="form-group">
						<label>Operating Hours</label>
						<textarea
							name="operating_hours"
							value={formData.operating_hours}
							onChange={handleInputChange}
							disabled={!isEditing}
							rows="3"
							placeholder="e.g., Monday-Friday: 8:00 AM - 6:00 PM&#10;Saturday: 9:00 AM - 5:00 PM&#10;Sunday: Closed"
						/>
					</div>
				</div>

				<div className="form-section">
					<h2>Store Image</h2>

					<div className="form-group">
						<label>Store Image</label>
						{store.store_image && !isEditing && (
							<div className="current-image">
								<img
									src={`${API_CONFIG.BASE_URL.replace("/api", "")}/storage/${store.store_image}`}
									alt="Store"
									onError={(e) => {
										e.target.style.display = "none";
									}}
								/>
							</div>
						)}
						{isEditing && (
							<input
								type="file"
								name="store_image"
								onChange={handleInputChange}
								accept="image/*"
							/>
						)}
					</div>
				</div>

				{isEditing && (
					<div className="form-actions">
						<button
							type="button"
							onClick={() => setIsEditing(false)}
							disabled={saving}
						>
							Cancel
						</button>
						<button type="submit" disabled={saving} className="save-btn">
							{saving ? "Saving..." : "Save Changes"}
						</button>
					</div>
				)}
			</form>
		</div>
	);
};

export default StoreProfile;
