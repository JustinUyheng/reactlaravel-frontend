import React, { useState, useEffect } from "react";
import {
	getPendingVendors,
	approveVendor,
	rejectVendor,
} from "../LoginSignup/action";
import "./Dashboard.css";
import "./DashStyle/Dashboard.css";
import { toast } from "react-toastify";

const AdminAccountConfirmation = () => {
	const [pendingVendors, setPendingVendors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		loadPendingVendors();
	}, []);

	const loadPendingVendors = async () => {
		setLoading(true);
		setError("");

		try {
			const data = await getPendingVendors();
			setPendingVendors(data.pending_vendors || []);
		} catch (error) {
			setError(error.message);
			console.error("Error loading pending vendors:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleApproveVendor = async (userId) => {
		try {
			await approveVendor(userId);
			toast.success("Vendor approved successfully!");
			loadPendingVendors(); // Refresh the list
		} catch (error) {
			toast.error("Failed to approve vendor: " + error.message);
		}
	};

	const handleRejectVendor = async (userId) => {
		if (
			window.confirm(
				"Are you sure you want to reject this vendor? This action cannot be undone."
			)
		) {
			try {
				await rejectVendor(userId);
				toast.success("Vendor rejected successfully!");
				loadPendingVendors(); // Refresh the list
			} catch (error) {
				toast.error("Failed to reject vendor: " + error.message);
			}
		}
	};

	return (
		<div className="admin-account-confirmation">
			<h2>Account Confirmation</h2>
			<p>Review and approve pending vendor accounts</p>

			{error && <div className="error-message">{error}</div>}

			{loading ? (
				<div className="loading">Loading pending vendors...</div>
			) : (
				<div className="vendors-container">
					{pendingVendors.length === 0 ? (
						<div className="no-vendors">
							<p>No pending vendors to review.</p>
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
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{pendingVendors.map((vendor) => (
										<tr key={vendor.id}>
											<td>{vendor.id}</td>
											<td>{`${vendor.firstname} ${vendor.lastname}`}</td>
											<td>{vendor.email}</td>
											<td>{vendor.birthday}</td>
											<td>{vendor.gender}</td>
											<td>
												<button
													onClick={() => handleApproveVendor(vendor.id)}
													className="btn-approve"
												>
													Approve
												</button>
												<button
													onClick={() => handleRejectVendor(vendor.id)}
													className="btn-reject"
												>
													Reject
												</button>
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

export default AdminAccountConfirmation;
