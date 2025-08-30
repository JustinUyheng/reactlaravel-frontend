// ./Admin/Dasboard.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // Ensure Outlet is imported
import AdminDashboard from "./AdminDashboard";
import "./DashStyle/Dashboard.css"; // Ensure this path is correct
import { assets } from "../assets/assets"; // Adjust path if necessary

// --- Constants for Dashboard Stats (kept within this component) ---
const DASHBOARD_STATS_DATA = {
	today: { orders: 12, customers: 8, revenue: 1250 },
	thisWeek: { orders: 67, customers: 45, revenue: 7600 },
	thisMonth: { orders: 250, customers: 180, revenue: 32000 },
};

// Component to display Dashboard Statistics
const DashboardStatsView = () => (
	<div className="dashboard-view-container">
		<div className="dashboard-section">
			<h3 className="dashboard-section-title">Today</h3>
			<div className="dashboard-cards-container">
				<div className="dashboard-card">
					<img
						src={
							assets.yellowbag || "https://placehold.co/40x40/FFC107/333?text=O"
						}
						alt="Orders"
						className="dashboard-card-icon"
					/>
					<div className="dashboard-card-info">
						<span className="dashboard-card-value">
							{DASHBOARD_STATS_DATA.today.orders}
						</span>
						<span className="dashboard-card-label">Orders Today</span>
					</div>
				</div>
				<div className="dashboard-card">
					<img
						src={
							assets.customer || "https://placehold.co/40x40/007BFF/FFF?text=C"
						}
						alt="Customers"
						className="dashboard-card-icon"
					/>
					<div className="dashboard-card-info">
						<span className="dashboard-card-value">
							{DASHBOARD_STATS_DATA.today.customers}
						</span>
						<span className="dashboard-card-label">Customers Today</span>
					</div>
				</div>
				<div className="dashboard-card">
					<img
						src={
							assets.revenue || "https://placehold.co/40x40/28A745/FFF?text=R"
						}
						alt="Revenue"
						className="dashboard-card-icon"
					/>
					<div className="dashboard-card-info">
						<span className="dashboard-card-value">
							₱{DASHBOARD_STATS_DATA.today.revenue.toLocaleString()}
						</span>
						<span className="dashboard-card-label">Revenue Today</span>
					</div>
				</div>
			</div>
		</div>
		<div className="dashboard-section">
			<h3 className="dashboard-section-title">This Week</h3>
			<div className="dashboard-cards-container">
				<div className="dashboard-card">
					<img
						src={
							assets.yellowbag || "https://placehold.co/40x40/FFC107/333?text=O"
						}
						alt="Orders"
						className="dashboard-card-icon"
					/>
					<div className="dashboard-card-info">
						<span className="dashboard-card-value">
							{DASHBOARD_STATS_DATA.thisWeek.orders}
						</span>
						<span className="dashboard-card-label">Orders this week</span>
					</div>
				</div>
				<div className="dashboard-card">
					<img
						src={
							assets.customer || "https://placehold.co/40x40/007BFF/FFF?text=C"
						}
						alt="Customers"
						className="dashboard-card-icon"
					/>
					<div className="dashboard-card-info">
						<span className="dashboard-card-value">
							{DASHBOARD_STATS_DATA.thisWeek.customers}
						</span>
						<span className="dashboard-card-label">Customers this week</span>
					</div>
				</div>
				<div className="dashboard-card">
					<img
						src={
							assets.revenue || "https://placehold.co/40x40/28A745/FFF?text=R"
						}
						alt="Revenue"
						className="dashboard-card-icon"
					/>
					<div className="dashboard-card-info">
						<span className="dashboard-card-value">
							₱{DASHBOARD_STATS_DATA.thisWeek.revenue.toLocaleString()}
						</span>
						<span className="dashboard-card-label">Revenue this week</span>
					</div>
				</div>
			</div>
		</div>
		<div className="dashboard-section">
			<h3 className="dashboard-section-title">This Month</h3>
			<div className="dashboard-cards-container">
				<div className="dashboard-card">
					<img
						src={
							assets.yellowbag || "https://placehold.co/40x40/FFC107/333?text=O"
						}
						alt="Orders"
						className="dashboard-card-icon"
					/>
					<div className="dashboard-card-info">
						<span className="dashboard-card-value">
							{DASHBOARD_STATS_DATA.thisMonth.orders}
						</span>
						<span className="dashboard-card-label">Orders this month</span>
					</div>
				</div>
				<div className="dashboard-card">
					<img
						src={
							assets.customer || "https://placehold.co/40x40/007BFF/FFF?text=C"
						}
						alt="Customers"
						className="dashboard-card-icon"
					/>
					<div className="dashboard-card-info">
						<span className="dashboard-card-value">
							{DASHBOARD_STATS_DATA.thisMonth.customers}
						</span>
						<span className="dashboard-card-label">Customers this month</span>
					</div>
				</div>
				<div className="dashboard-card">
					<img
						src={
							assets.revenue || "https://placehold.co/40x40/28A745/FFF?text=R"
						}
						alt="Revenue"
						className="dashboard-card-icon"
					/>
					<div className="dashboard-card-info">
						<span className="dashboard-card-value">
							₱{DASHBOARD_STATS_DATA.thisMonth.revenue.toLocaleString()}
						</span>
						<span className="dashboard-card-label">Revenue this month</span>
					</div>
				</div>
			</div>
		</div>
	</div>
);

const Dasboard = () => {
	const location = useLocation();
	const [activePath, setActivePath] = useState(location.pathname);

	useEffect(() => {
		setActivePath(location.pathname);
	}, [location.pathname]);

	// This is the base path for your admin section as defined in App.jsx
	const adminBasePath = "/admin-dashboard";

	const navItems = [
		{
			path: adminBasePath,
			label: "Dashboard",
			icon: assets.dashboard,
			id: "dashboard",
		}, // Links to base admin path
		{
			path: "/admin-account-confirmation",
			label: "Accounts Confirmation",
			icon: assets.account,
			id: "accountsConfirmation",
		},
		{
			path: "/admin-account-verified",
			label: "Accounts Verified",
			icon: assets.verified,
			id: "accountsVerified",
		},
		{
			path: "/admin-orders",
			label: "Orders",
			icon: assets.order,
			id: "orders",
		},
		{
			path: "/admin-reservation",
			label: "Reservation",
			icon: assets.reservation,
			id: "reservation",
		},
	];

	// Check if the current location is exactly the adminBasePath for showing stats
	const isBaseDashboardView =
		location.pathname === adminBasePath ||
		location.pathname === `${adminBasePath}/`;

	return (
		<div className="additems-page-container">
			<div className="additems-body-container">
				<aside className="additems-sidebar">
					<nav>
						<ul>
							{navItems.map((item) => (
								<li key={item.id}>
									<Link
										to={item.path}
										className={`additems-sidebar-item ${
											// The main 'Dashboard' link is active if the path is exactly adminBasePath.
											// Other links are active if the current path starts with their path.
											(item.path === adminBasePath && isBaseDashboardView) ||
											(item.path !== adminBasePath &&
												activePath.startsWith(item.path))
												? "active"
												: ""
										}`}
										onClick={() => setActivePath(item.path)} // You can also remove this if NavLink's active class is sufficient
									>
										<img
											src={
												item.icon ||
												`https://placehold.co/18x18/ccc/000?text=${item.label.charAt(
													0
												)}`
											}
											alt={item.label}
											className="sidebar-icon"
										/>{" "}
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</aside>
				<main className="additems-main-content">
					{/* Always use Outlet for consistent routing */}
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Dasboard;
