import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./userstyle/User.css";
import { assets } from "../assets/assets"; // Assuming assets are correctly set up

const User = () => {
	// --- State Variables ---
	const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
	const [newPasswordVisible, setNewPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");

	const [showEditTrigger, setShowEditTrigger] = useState(false); // This now controls overall edit mode
	const [profileImageUrl, setProfileImageUrl] = useState(
		assets.user || assets.personal
	);
	const [currentEmail, setCurrentEmail] = useState(""); // Email might also be editable

	const [profileDetails, setProfileDetails] = useState({
		name: "",
		age: "",
		contactNumber: "",
	});
	// State to hold temporary values while editing personal details
	const [editableProfileDetails, setEditableProfileDetails] = useState({});
	const [editableEmail, setEditableEmail] = useState("");

	const [isAddressEditing, setIsAddressEditing] = useState(false);
	const [address, setAddress] = useState("");
	const [tempAddress, setTempAddress] = useState("");
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	// --- Hooks ---
	const fileInputRef = useRef(null);
	const navigate = useNavigate();
	const { user, logout, refreshProfile } = useAuth();

	// --- Effects ---
	useEffect(() => {
		if (user) {
			// Update state with real user data
			setCurrentEmail(user.email || "");
			setEditableEmail(user.email || "");

			const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();
			const userDetails = {
				name: fullName,
				age: user.birthday ? calculateAge(user.birthday) : "",
				contactNumber: "", // This might not be in your user model yet
			};

			setProfileDetails(userDetails);
			setEditableProfileDetails(userDetails);
		}
	}, [user]);

	// Helper function to calculate age from birthday
	const calculateAge = (birthday) => {
		const today = new Date();
		const birthDate = new Date(birthday);
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();

		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			age--;
		}

		return age.toString();
	};

	useEffect(() => {
		if (isAddressEditing) {
			setTempAddress(address);
		}
	}, [isAddressEditing, address]);

	// Update editable fields when edit mode is toggled
	useEffect(() => {
		if (showEditTrigger) {
			setEditableProfileDetails(profileDetails);
			setEditableEmail(currentEmail);
		}
	}, [showEditTrigger, profileDetails, currentEmail]);

	// --- Handlers ---
	const togglePasswordVisibility = (field) => {
		switch (field) {
			case "current":
				setCurrentPasswordVisible(!currentPasswordVisible);
				break;
			case "new":
				setNewPasswordVisible(!newPasswordVisible);
				break;
			case "confirm":
				setConfirmPasswordVisible(!confirmPasswordVisible);
				break;
			default:
				break;
		}
	};

	const handleAddressInputChange = (e) => {
		setTempAddress(e.target.value);
	};

	const handleEditProfileClick = () => {
		if (showEditTrigger) {
			// When clicking "Done Editing"
			setProfileDetails(editableProfileDetails);
			setCurrentEmail(editableEmail); // If email is also made editable
			alert("Profile details updated locally. Implement API call for saving.");
			// Add API call logic here to save profileDetails and currentEmail
		}
		setShowEditTrigger(!showEditTrigger);
	};

	// Handler for changes in personal detail input fields
	const handleProfileDetailChange = (e) => {
		const { name, value } = e.target;
		if (name === "email") {
			setEditableEmail(value);
		} else {
			setEditableProfileDetails((prevDetails) => ({
				...prevDetails,
				[name]: value,
			}));
		}
	};

	const handleProfileEditTriggerClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleProfileImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfileImageUrl(reader.result);
				alert("Profile picture updated locally. Implement upload logic.");
			};
			reader.readAsDataURL(file);
		}
		event.target.value = null;
	};

	const handleEditAddressClick = () => {
		setIsAddressEditing(true);
	};

	const handleSaveAddressClick = () => {
		setAddress(tempAddress);
		setIsAddressEditing(false);
		alert("Address updated locally. Implement API call.");
		// Add API call logic here
	};

	const handlePasswordInputChange = (e, field) => {
		const { value } = e.target;
		switch (field) {
			case "current":
				setCurrentPassword(value);
				break;
			case "new":
				setNewPassword(value);
				break;
			case "confirm":
				setConfirmNewPassword(value);
				break;
			default:
				break;
		}
	};

	const handleSavePassword = () => {
		if (!currentPassword || !newPassword || !confirmNewPassword) {
			alert("Please fill in all password fields.");
			return;
		}
		if (newPassword !== confirmNewPassword) {
			alert("New password and confirm password do not match.");
			return;
		}
		console.log(
			"Changing password. Current:",
			currentPassword,
			"New:",
			newPassword
		);
		setCurrentPassword("");
		setNewPassword("");
		setConfirmNewPassword("");
		alert("Password change initiated (implement backend logic).");
		// Add API call logic here
	};

	const handleOpenLogoutModal = () => {
		setShowLogoutModal(true);
	};

	const handleCloseLogoutModal = () => {
		setShowLogoutModal(false);
	};

	const handleConfirmLogout = async () => {
		console.log("Logging out...");
		setShowLogoutModal(false);

		try {
			await logout();
			navigate("/");
		} catch (error) {
			console.error("Logout failed:", error);
			navigate("/");
		}
	};

	// Add a function to refresh profile data
	const handleRefreshProfile = async () => {
		try {
			await refreshProfile();
			alert("Profile refreshed successfully!");
		} catch (error) {
			alert("Failed to refresh profile. Please try again.");
			console.error("Refresh failed:", error);
		}
	};
	// --- END Handlers ---

	return (
		<div className="user-profile-container">
			{/* Top Section */}
			<div className={`profile-header ${showEditTrigger ? "editing" : ""}`}>
				<div className="profile-image-wrapper">
					<img src={profileImageUrl} alt="User" className="profile-icon" />
					{/* Profile pic edit icon appears when main "Edit Profile" is active */}
					{showEditTrigger && (
						<div
							className="profile-pic-edit-icon"
							onClick={handleProfileEditTriggerClick}
							title="Change profile picture"
						>
							<img src={assets.edit_square || assets.edit} alt="Edit Pic" />
						</div>
					)}
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleProfileImageChange}
						style={{ display: "none" }}
						accept="image/png, image/jpeg, image/gif"
					/>
				</div>

				<div className="user-info-main">
					{showEditTrigger ? (
						<input
							type="email"
							name="email"
							value={editableEmail}
							onChange={handleProfileDetailChange}
							className="editable-input user-email-main-input"
							placeholder="Email"
						/>
					) : (
						<p className="user-email-main">{currentEmail}</p>
					)}
					{showEditTrigger ? (
						<input
							type="text"
							name="name" // Matches the key in editableProfileDetails
							value={editableProfileDetails.name}
							onChange={handleProfileDetailChange}
							className="editable-input user-name-display-input"
							placeholder="Full Name"
						/>
					) : (
						<p className="user-name-display">{profileDetails.name}</p>
					)}
				</div>

				<button
					onClick={handleEditProfileClick}
					className="edit-profile-btn btn-outline"
				>
					{showEditTrigger ? "Done Editing" : "Edit Profile"}
				</button>
			</div>

			<hr className="divider" />

			{/* Mid Section */}
			<div className="profile-section-row">
				{/* Personal Details Card */}
				<div className="profile-card">
					<div className="card-header">
						<img
							src={assets.personal}
							alt="Personal Details"
							className="card-icon"
						/>
						<h3 className="card-title">Personal Details</h3>
					</div>
					<div className="card-content">
						<div className="details-list">
							<div className="detail-item">
								<span className="detail-label">Name:</span>
								{showEditTrigger ? (
									<input
										type="text"
										name="name"
										value={editableProfileDetails.name}
										onChange={handleProfileDetailChange}
										className="editable-input"
									/>
								) : (
									<span className="detail-value">{profileDetails.name}</span>
								)}
							</div>
							<div className="detail-item">
								<span className="detail-label">Age:</span>
								{showEditTrigger ? (
									<input
										type="number" // Or text, with validation
										name="age"
										value={editableProfileDetails.age}
										onChange={handleProfileDetailChange}
										className="editable-input"
									/>
								) : (
									<span className="detail-value">{profileDetails.age}</span>
								)}
							</div>
							<div className="detail-item">
								<span className="detail-label">Email:</span>
								{showEditTrigger ? (
									<input
										type="email"
										name="email" // Special handling if email is edited in header
										value={editableEmail} // Use editableEmail for consistency
										onChange={handleProfileDetailChange}
										className="editable-input"
									/>
								) : (
									<span className="detail-value">{currentEmail}</span>
								)}
							</div>
							<div className="detail-item">
								<span className="detail-label">Contact Number:</span>
								{showEditTrigger ? (
									<input
										type="tel" // Or text, with validation
										name="contactNumber"
										value={editableProfileDetails.contactNumber}
										onChange={handleProfileDetailChange}
										className="editable-input"
									/>
								) : (
									<span className="detail-value">
										{profileDetails.contactNumber}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* History Transaction Card */}
				<div className="profile-card">
					<div className="card-header">
						<img
							src={assets.history}
							alt="History Transaction"
							className="card-icon"
						/>
						<h3 className="card-title">History Transaction</h3>
					</div>
					<div className="card-content">
						<div className="history-table">
							<div className="history-row history-header">
								<span className="history-col">DATE</span>
								<span className="history-col">ITEM</span>
								<span className="history-col amount">AMOUNT</span>
								<span className="history-col status-header">STATUS</span>
							</div>
							<div className="history-row">
								<span className="history-col">May 1, 2025</span>
								<span className="history-col">Siomai</span>
								<span className="history-col amount">₱ 20</span>
								<span className="history-col status">
									<button className="status-btn reserve-btn">Reserve</button>
								</span>
							</div>
							<div className="history-row">
								<span className="history-col">May 3, 2025</span>
								<span className="history-col">Siopao</span>
								<span className="history-col amount">₱ 25</span>
								<span className="history-col status">
									<button className="status-btn order-btn">Order</button>
								</span>
							</div>
							<div className="history-row">
								<span className="history-col">May 5, 2025</span>
								<span className="history-col">Bottled Water</span>
								<span className="history-col amount">₱ 15</span>
								<span className="history-col status">
									<button className="status-btn reserve-btn">Reserve</button>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Section */}
			<div className="profile-section-row bottom-row">
				{" "}
				{/* Added class for specific styling if needed */}
				{/* Settings Card */}
				<div className="profile-card settings-card">
					{" "}
					{/* Added class for specific styling if needed */}
					<div className="card-header">
						<img src={assets.settings} alt="Settings" className="card-icon" />
						<h3 className="card-title">Settings</h3>
					</div>
					<div className="card-content">
						<p className="setting-label">Change Password</p>
						<div className="password-input-group">
							<label className="password-field-label">Current Password</label>
							<div className="password-input-container">
								<input
									type={currentPasswordVisible ? "text" : "password"}
									placeholder="Enter current password"
									className="password-input"
									value={currentPassword}
									onChange={(e) => handlePasswordInputChange(e, "current")}
								/>
								<img
									src={currentPasswordVisible ? assets.view : assets.hide}
									alt={currentPasswordVisible ? "Hide" : "View"}
									className="input-icon view-hide-icon"
									onClick={() => togglePasswordVisibility("current")}
								/>
							</div>
						</div>

						<div className="password-input-group">
							<label className="password-field-label">New Password</label>
							<div className="password-input-container">
								<input
									type={newPasswordVisible ? "text" : "password"}
									placeholder="Enter new password"
									className="password-input"
									value={newPassword}
									onChange={(e) => handlePasswordInputChange(e, "new")}
								/>
								<img
									src={newPasswordVisible ? assets.view : assets.hide}
									alt={newPasswordVisible ? "Hide" : "View"}
									className="input-icon view-hide-icon"
									onClick={() => togglePasswordVisibility("new")}
								/>
							</div>
						</div>

						<div className="password-input-group">
							<label className="password-field-label">
								Confirm New Password
							</label>
							<div className="password-input-container">
								<input
									type={confirmPasswordVisible ? "text" : "password"}
									placeholder="Confirm new password"
									className="password-input"
									value={confirmNewPassword}
									onChange={(e) => handlePasswordInputChange(e, "confirm")}
								/>
								<img
									src={confirmPasswordVisible ? assets.view : assets.hide}
									alt={confirmPasswordVisible ? "Hide" : "View"}
									className="input-icon view-hide-icon"
									onClick={() => togglePasswordVisibility("confirm")}
								/>
							</div>
						</div>
						<button
							onClick={handleSavePassword}
							className="btn-primary save-password-btn"
							title="Save New Password"
						>
							Save Password
						</button>
					</div>
				</div>
				{/* Saved Addressed Card */}
				<div className="profile-card address-card">
					{" "}
					{/* Added class for specific styling if needed */}
					<div className="card-header">
						<img
							src={assets.location}
							alt="Saved Address"
							className="card-icon"
						/>
						<h3 className="card-title">Saved Addressed</h3>
					</div>
					<div className="card-content address-content">
						{isAddressEditing ? (
							<input
								type="text"
								value={tempAddress}
								onChange={handleAddressInputChange}
								className="editable-input address-input-field"
							/>
						) : (
							<p className="address-text">{address}</p>
						)}
						{isAddressEditing ? (
							<button
								onClick={handleSaveAddressClick}
								className="save-address-btn icon-btn"
								title="Save Address"
							>
								<img src={assets.check} alt="Save" />
							</button>
						) : (
							<button
								onClick={handleEditAddressClick}
								className="edit-address-btn btn-outline"
							>
								Edit
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Footer Section */}
			<div className="profile-footer">
				<button
					className="logout-btn btn-primary"
					onClick={handleOpenLogoutModal}
				>
					Log out
				</button>
				<button
					onClick={handleRefreshProfile}
					className="refresh-profile-btn btn-outline"
				>
					Refresh Profile
				</button>
			</div>

			{/* Logout Confirmation Modal */}
			{showLogoutModal && (
				<div className="modal-overlay" onClick={handleCloseLogoutModal}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-icon-container">
							<img
								src={assets.signlog || assets.default_modal_icon}
								alt="Logout confirmation"
								className="modal-icon"
							/>
						</div>
						<p className="modal-text">Are you sure you want to log out?</p>
						<div className="modal-buttons">
							<button
								onClick={handleConfirmLogout}
								className="btn-primary modal-btn-logout"
							>
								Log out
							</button>
							<button
								onClick={handleCloseLogoutModal}
								className="btn-outline modal-btn-stay"
							>
								Stay logged in
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default User;
