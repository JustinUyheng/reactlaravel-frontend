import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createStore } from "../LoginSignup/action";
import "./VendorStyle/CreateStore.css";
import { toast } from "react-toastify";

const CreateStore = () => {
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		business_name: "",
		business_type: "",
		// description: "",
		// address: "",
		// contact_number: "",
		// operating_hours: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		// Check if user is authenticated and is a vendor
		if (!isAuthenticated || user?.role_id !== 2) {
			navigate("/login");
			return;
		}
	}, [isAuthenticated, user, navigate]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await createStore(formData);
			toast.success("Store created successfully!");
			navigate("/vendor/dashboard"); // Navigate to vendor dashboard
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	if (!isAuthenticated || user?.role_id !== 2) {
		return <div>Access denied. Vendor access required.</div>;
	}

	return (
		<div className="create-store-container">
			<div className="create-store-card">
				<h2>Create Your Store</h2>
				<p>Set up your food business profile</p>

				{error && <div className="error-message">{error}</div>}

				<form onSubmit={handleSubmit} className="create-store-form">
					<div className="form-group">
						<label htmlFor="business_name">Business Name *</label>
						<input
							type="text"
							id="business_name"
							name="business_name"
							value={formData.business_name}
							onChange={handleInputChange}
							required
							placeholder="Enter your business name"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="business_type">Business Type *</label>
						<select
							id="business_type"
							name="business_type"
							value={formData.business_type}
							onChange={handleInputChange}
							required
						>
							<option value="">Select business type</option>
							<option value="Food">Food</option>
							<option value="Food/Retail">Food/Retail</option>
							{/* <option value="restaurant">Restaurant</option>
							<option value="cafe">Cafe</option>
							<option value="food_stall">Food Stall</option>
							<option value="bakery">Bakery</option>
							<option value="catering">Catering</option>
							<option value="other">Other</option> */}
						</select>
					</div>

					{/* <div className="form-group">
						<label htmlFor="description">Description</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="Describe your business and what you offer"
							rows="4"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="address">Address *</label>
						<input
							type="text"
							id="address"
							name="address"
							value={formData.address}
							onChange={handleInputChange}
							required
							placeholder="Enter your business address"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="contact_number">Contact Number *</label>
						<input
							type="tel"
							id="contact_number"
							name="contact_number"
							value={formData.contact_number}
							onChange={handleInputChange}
							required
							placeholder="Enter your contact number"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="operating_hours">Operating Hours</label>
						<input
							type="text"
							id="operating_hours"
							name="operating_hours"
							value={formData.operating_hours}
							onChange={handleInputChange}
							placeholder="e.g., Mon-Fri 8AM-6PM, Sat-Sun 9AM-5PM"
						/>
					</div> */}

					<button type="submit" className="submit-btn" disabled={loading}>
						{loading ? "Creating Store..." : "Create Store"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateStore;
