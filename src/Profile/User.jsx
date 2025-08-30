import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import UserTransactionHistory from "./UserTransactionHistory";
import "./userstyle/User.css";

const User = () => {
	// --- State Variables ---
	const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
	const [newPasswordVisible, setNewPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");

	const [showEditTrigger, setShowEditTrigger] = useState(false);
	const [profileImageUrl, setProfileImageUrl] = useState(
		assets.user || assets.personal
	);
	const [currentEmail, setCurrentEmail] = useState("");

	// Profile picture upload states
	const [isUploadingPicture, setIsUploadingPicture] = useState(false);
	const [pictureUploadError, setPictureUploadError] = useState("");
	const [isImageLoading, setIsImageLoading] = useState(false);

	const [profileDetails, setProfileDetails] = useState({
		name: "",
		age: "",
		contactNumber: "",
	});
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

	// API Base URL - adjust this to match your backend
	const API_BASE_URL =
		import.meta.env.VITE_API_URL || "http://localhost:8000/api";

	// Get auth token
	const getAuthToken = () => {
		return (
			localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
		);
	};

	// --- Effects ---
	useEffect(() => {
		if (user) {
			setCurrentEmail(user.email || "");
			setEditableEmail(user.email || "");

			const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();
			const userDetails = {
				name: fullName,
				age: user.birthday ? calculateAge(user.birthday) : "",
				contactNumber: user.contact_number || "",
			};

			setProfileDetails(userDetails);
			setEditableProfileDetails(userDetails);

			// Set profile picture URL from user data
			if (user.profile_picture_url) {
				const apiBaseUrl = API_BASE_URL.replace("/api", "");
				const fullProfilePictureUrl = user.profile_picture_url
					? `${apiBaseUrl}${user.profile_picture_url}`
					: null;
				setProfileImageUrl(fullProfilePictureUrl);
			}
		}
	}, [user]);

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

	useEffect(() => {
		if (showEditTrigger) {
			setEditableProfileDetails(profileDetails);
			setEditableEmail(currentEmail);
		}
	}, [showEditTrigger, profileDetails, currentEmail]);

	// --- Profile Picture Handlers ---
	const handleProfileImageChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		// Validate file
		if (!file.type.startsWith("image/")) {
			setPictureUploadError("Please select an image file");
			return;
		}

		if (file.size > 2 * 1024 * 1024) {
			setPictureUploadError("File size must be less than 2MB");
			return;
		}

		// Upload to server
		await uploadProfilePicture(file);
		event.target.value = null;
	};

	const uploadProfilePicture = async (file) => {
		setIsUploadingPicture(true);
		setPictureUploadError("");

		try {
			const formData = new FormData();
			formData.append("profile_picture", file);

			const response = await fetch(`${API_BASE_URL}/profile/picture/upload`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
					Accept: "application/json",
				},
				body: formData,
			});

			const data = await response.json();

			if (data.success) {
				const apiBaseUrl = API_BASE_URL.replace("/api", "");
				const fullProfilePictureUrl = data.profile_picture_url
					? `${apiBaseUrl}${data.profile_picture_url}`
					: data.profile_picture_url;

				setProfileImageUrl(fullProfilePictureUrl);
				// Refresh the user context if needed
				if (refreshProfile) {
					await refreshProfile();
				}
				toast.success("Profile picture updated successfully!");
			} else {
				setPictureUploadError(data.message || "Upload failed");
				// Revert to original image
				setProfileImageUrl(
					user?.profile_picture_url || assets.user || assets.personal
				);
			}
		} catch (err) {
			setPictureUploadError("Network error. Please try again.");
			setProfileImageUrl(
				user?.profile_picture_url || assets.user || assets.personal
			);
			console.error("Upload error:", err);
		} finally {
			setIsUploadingPicture(false);
		}
	};

	const deleteProfilePicture = async () => {
		if (!user?.profile_picture_url) return;

		setIsUploadingPicture(true);
		setPictureUploadError("");

		try {
			const response = await fetch(`${API_BASE_URL}/profile/picture`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
					Accept: "application/json",
				},
			});

			const data = await response.json();

			if (data.success) {
				setProfileImageUrl(assets.user || assets.personal);
				if (refreshProfile) {
					await refreshProfile();
				}
				toast.success("Profile picture removed successfully!");
			} else {
				setPictureUploadError(data.message || "Delete failed");
			}
		} catch (err) {
			setPictureUploadError("Network error. Please try again.");
			console.error("Delete error:", err);
		} finally {
			setIsUploadingPicture(false);
		}
	};

	// --- Other Handlers ---
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
			setProfileDetails(editableProfileDetails);
			setCurrentEmail(editableEmail);
			toast.success(
				"Profile details updated locally. Implement API call for saving."
			);
		}
		setShowEditTrigger(!showEditTrigger);
	};

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

	const handleEditAddressClick = () => {
		setIsAddressEditing(true);
	};

	const handleSaveAddressClick = () => {
		setAddress(tempAddress);
		setIsAddressEditing(false);
		toast.success("Address updated locally. Implement API call.");
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
			toast.warning("Please fill in all password fields.");
			return;
		}
		if (newPassword !== confirmNewPassword) {
			toast.error("New password and confirm password do not match.");
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
		toast.warning("Password change initiated (implement backend logic).");
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

	const handleRefreshProfile = async () => {
		try {
			await refreshProfile();
			toast.success("Profile refreshed successfully!");
		} catch (error) {
			toast.error("Failed to refresh profile. Please try again.");
			console.error("Refresh failed:", error);
		}
	};

	return (
		<div className="user-profile-container">
			{/* Top Section */}
			<div className={`profile-header ${showEditTrigger ? "editing" : ""}`}>
				<div className="profile-image-wrapper">
					<img
						src={profileImageUrl}
						alt="User"
						className="profile-icon"
						onLoad={() => setIsImageLoading(false)}
						onError={() => {
							setIsImageLoading(false);
							setProfileImageUrl(assets.user || assets.personal);
						}}
						style={{ opacity: isImageLoading ? 0.5 : 1 }}
					/>

					{/* Loading overlay for profile picture */}
					{isUploadingPicture && (
						<div className="profile-pic-loading-overlay">
							<div className="loading-spinner"></div>
						</div>
					)}

					{/* Profile pic edit icon - now shows when main "Edit Profile" is active OR always visible */}
					<div
						className="profile-pic-edit-icon"
						onClick={handleProfileEditTriggerClick}
						title="Change profile picture"
						style={{
							opacity: isUploadingPicture ? 0.5 : 1,
							pointerEvents: isUploadingPicture ? "none" : "auto",
						}}
					>
						<img src={assets.edit_square || assets.edit} alt="Edit Pic" />
					</div>

					{/* Delete picture button (only show if user has uploaded picture) */}
					{user?.profile_picture_url && !isUploadingPicture && (
						<button
							className="profile-pic-delete-icon"
							onClick={deleteProfilePicture}
							title="Remove profile picture"
						>
							<img src={assets.bin} alt="Delete Pic" />
						</button>
					)}

					<input
						type="file"
						ref={fileInputRef}
						onChange={handleProfileImageChange}
						style={{ display: "none" }}
						accept="image/png, image/jpeg, image/gif, image/jpg"
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
							name="name"
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

			{/* Profile Picture Error Message */}
			{pictureUploadError && (
				<div className="profile-picture-error">{pictureUploadError}</div>
			)}

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
										type="number"
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
										name="email"
										value={editableEmail}
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
										type="tel"
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
				{/* Transaction History Section */}
				<div className="profile-section-row">
					<div className="profile-card">
						<div className="card-header">
							<h3>Transaction History</h3>
						</div>
						<div className="card-content">
							<UserTransactionHistory />
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Section */}
			<div className="profile-section-row bottom-row">
				{/* Settings Card */}
				<div className="profile-card settings-card">
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

				{/* Saved Address Card */}
				<div className="profile-card address-card">
					<div className="card-header">
						<img
							src={assets.location}
							alt="Saved Address"
							className="card-icon"
						/>
						<h3 className="card-title">Saved Address</h3>
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
