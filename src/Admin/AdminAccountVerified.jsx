import React, { useState, useEffect } from "react";
import { getAllVendors } from "../LoginSignup/action";
import "./DashStyle/Dashboard.css";
import "./Dashboard.css";

const AdminAccountVerified = () => {
	const [vendors, setVendors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		loadVendors();
	}, []);

	const loadVendors = async () => {
		setLoading(true);
		setError("");

		try {
			const data = await getAllVendors();
			setVendors(data.users || []);
		} catch (error) {
			setError(error.message);
			console.error("Error loading vendors:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="admin-account-verified">
			<h2>Verified Accounts</h2>
			<p>View all approved vendor accounts</p>

			{error && <div className="error-message">{error}</div>}

			{loading ? (
				<div className="loading">Loading vendors...</div>
			) : (
				<div className="vendors-container">
					{vendors.length === 0 ? (
						<div className="no-vendors">
							<p>No vendors found.</p>
						</div>
					) : (
						<div className="vendors-table">
							<table>
								<thead>
									<tr>
										<th>ID</th>
										<th>Name</th>
										<th>Email</th>
										<th>Birthday</th>
										<th>Gender</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{vendors.map((vendor) => (
										<tr key={vendor.id}>
											<td>{vendor.id}</td>
											<td>{`${vendor.firstname} ${vendor.lastname}`}</td>
											<td>{vendor.email}</td>
											<td>{vendor.birthday}</td>
											<td>{vendor.gender}</td>
											<td>
												<span
													className={`status ${
														vendor.is_approved ? "approved" : "pending"
													}`}
												>
													{vendor.is_approved ? "Approved" : "Pending"}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default AdminAccountVerified;
