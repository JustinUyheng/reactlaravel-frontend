import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./VendorNavigation.css";

const VendorNavigation = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const getCurrentPageTitle = () => {
		const path = location.pathname;
		if (path === "/vendor/dashboard") return "Dashboard";
		if (path === "/vendor/products") return "Product Management";
		if (path === "/vendor/orders") return "Order Management";
		if (path === "/vendor/transactions") return "Transaction History";
		if (path === "/vendor/profile") return "Store Profile";
		if (path === "/vendor/create-store") return "Create Store";
		return "Vendor Dashboard";
	};

	const getBreadcrumbPath = () => {
		const path = location.pathname;
		if (path === "/vendor/dashboard") return [];
		if (path === "/vendor/products") return ["Dashboard", "Products"];
		if (path === "/vendor/orders") return ["Dashboard", "Orders"];
		if (path === "/vendor/transactions") return ["Dashboard", "Transactions"];
		if (path === "/vendor/profile") return ["Dashboard", "Profile"];
		if (path === "/vendor/create-store") return ["Dashboard", "Create Store"];
		return ["Dashboard"];
	};

	const handleBreadcrumbClick = (index) => {
		const paths = [
			"/vendor/dashboard",
			"/vendor/products",
			"/vendor/orders",
			"/vendor/transactions",
			"/vendor/profile",
			"/vendor/create-store",
		];
		const breadcrumbPaths = getBreadcrumbPath();
		const targetPath = breadcrumbPaths[index];

		if (targetPath === "Dashboard") {
			navigate("/vendor/dashboard");
		} else if (targetPath === "Products") {
			navigate("/vendor/products");
		} else if (targetPath === "Orders") {
			navigate("/vendor/orders");
		} else if (targetPath === "Transactions") {
			navigate("/vendor/transactions");
		} else if (targetPath === "Profile") {
			navigate("/vendor/profile");
		} else if (targetPath === "Create Store") {
			navigate("/vendor/create-store");
		}
	};

	return (
		<div className="vendor-navigation">
			{/* Top Navigation Bar */}
			<div className="vendor-nav-header">
				<div className="vendor-nav-left">
					{location.pathname !== "/vendor/dashboard" && (
						<button
							className="back-btn"
							onClick={() => navigate("/vendor/dashboard")}
						>
							← Back to Dashboard
						</button>
					)}
				</div>
				<div className="vendor-nav-center">
					<h1>{getCurrentPageTitle()}</h1>
				</div>
				<div className="vendor-nav-right">
					<button className="home-btn" onClick={() => navigate("/homepage")}>
						Home
					</button>
				</div>
			</div>

			{/* Breadcrumb Navigation */}
			<div className="vendor-breadcrumb">
				{getBreadcrumbPath().map((item, index) => (
					<React.Fragment key={index}>
						{index > 0 && <span className="breadcrumb-separator">/</span>}
						{index === getBreadcrumbPath().length - 1 ? (
							<span className="breadcrumb-current">{item}</span>
						) : (
							<button
								className="breadcrumb-item"
								onClick={() => handleBreadcrumbClick(index)}
							>
								{item}
							</button>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default VendorNavigation;
