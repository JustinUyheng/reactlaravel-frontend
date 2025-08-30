// App.jsx:
import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// General Components
import Navbar from "./HomeContents/Navbar"; // Public Navbar
import Navbars from "./AfterLoginContents/Navbars"; // Logged-in User Navbar
import HomeBody from "./HomeContents/HomeBody";
import About from "./HomeContents/About";
import Contact from "./HomeContents/Contact";
import Frequently from "./HomeContents/Frequently";
import Feedback from "./HomeContents/Feedback";
import GetStarted from "./HomeContents/GetStarted";
import Login from "./LoginSignup/Login";
import Stores from "./AfterLoginContents/Store";
import Store1 from "./StoreContents/store1";
import Snacks from "./FranceBistroStore/Snacks";
import Buffet from "./FranceBistroStore/Buffet";
import BudgetMeals from "./FranceBistroStore/Budgetmeals";
import Budgetsnacks from "./FranceBistroStore/Budgetsnacks";
import Category1 from "./AvailableToday/Category1";
import Snackss from "./hasOrder&Reserved/Snackss";
import Buffetss from "./hasOrder&Reserved/Buffetss";
import Budgetmealss from "./hasOrder&Reserved/Budgetmealss";
import Budgetsnackss from "./hasOrder&Reserved/Budgetsnackss";
import Cart from "./CartandOrder/Cart";
import { ToastContainer } from "react-toastify";
import Checkout from "./CartandOrder/Checkout";
import PayCash from "./CartandOrder/PayCash";
import PlaceOrder from "./CartandOrder/PlaceOrder";
import Order from "./CartandOrder/Orders";
import VendorStores from "./Vendor/VendorStores";
import VenCategory1 from "./Vendor/VenCategory1";
import AddItems from "./Records/AddItems";
import Category2 from "./AvailableToday/Category2";
import FasSnacks from "./FASPeCC/FasSnacks";
import FasBuffet from "./FASPeCC/FasBuffet";
import FasBudgetsnacks from "./FASPeCC/FasBudgetsnacks";
import FasBudgetmeals from "./FASPeCC/FasBudgetmeals";
import User from "./Profile/User";

// Admin Components
import AdminNavbar from "./Admin/AdminNavbar";
import AdminDashboard from "./Admin/AdminDashboard";
import Dasboard from "./Admin/Dasboard";
import AdminAccountConfirmation from "./Admin/AdminAccountConfirmation";
import AdminAccountVerified from "./Admin/AdminAccountVerified";
import AdminOrders from "./Admin/AdminOrders";
import AdminReservation from "./Admin/AdminReservation";
import AdminTest from "./Admin/AdminTest";
import FaspeccCategory from "./AllStores/FaspeccCategory";
import FaspeccBuffet from "./AllStores/FaspeccBuffet";
import FaspeccBudgetMeals from "./AllStores/FaspeccBudgetMeals";
import FaspeccBudgetSnacks from "./AllStores/FaspeccBudgetSnacks";
import FaspeccSnacks from "./AllStores/FaspeccSnacks";
import ForgotPassword from "./LoginSignup/ForgotPassword";
import FranceCategory from "./AllStores/FranceCategory";
import FranceSnacks from "./AllStores/FranceSnacks";
import FranceBuffets from "./AllStores/FranceBuffets";
import FranceBudgetSnacks from "./AllStores/FranceBudgetSnacks";
import FranceBudgetMeals from "./AllStores/FranceBudgetMeals";

// Vendor Components
import VendorDashboard from "./Vendor/VendorDashboard";
import CreateStore from "./Vendor/CreateStore";
import ProductManagement from "./Vendor/ProductManagement";
import StoreProfile from "./Vendor/StoreProfile";

// Component to handle navbar rendering logic
const NavbarRenderer = () => {
	const location = useLocation();
	const { user, isAuthenticated, loading } = useAuth();

	// Don't render any navbar while loading
	if (loading) {
		return null;
	}

	// Admin paths that should show AdminNavbar
	const adminPaths = [
		"/admin-dashboard",
		"/admin-account-confirmation",
		"/admin-account-verified",
		"/admin-orders",
		"/admin-reservation",
		"/admin-test",
	];

	// Check if current path is an admin path
	const isAdminPath = adminPaths.some((path) =>
		location.pathname.startsWith(path)
	);

	// Check if user is authenticated and is an admin
	const isAdminUser = isAuthenticated && user?.role_id === 3;

	// Show AdminNavbar if:
	// 1. User is authenticated and is an admin, OR
	// 2. Current path is an admin path (for security, admin paths should redirect if not admin)
	if (isAdminUser || isAdminPath) {
		return <AdminNavbar />;
	}

	// Show logged-in user navbar if user is authenticated and not on admin paths
	if (isAuthenticated && !isAdminPath) {
		return <Navbars />;
	}

	// Show public navbar for unauthenticated users or public pages
	return <Navbar />;
};

const AppContent = () => {
	return (
		<div>
			{/* Use the new NavbarRenderer component */}
			<NavbarRenderer />

			<div className="app">
				<Routes>
					{/* Publicly accessible routes */}
					<Route path="/about-us" element={<About />} />
					<Route path="/contact-us" element={<Contact />} />
					<Route path="/faq" element={<Frequently />} />
					<Route path="/feedback" element={<Feedback />} />
					<Route path="/get-started" element={<GetStarted />} />
					<Route path="/auth" element={<Login />} />
					<Route path="/" element={<HomeBody />} />
					<Route path="/homepage" element={<HomeBody />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />

					{/* Protected routes - require authentication */}
					<Route
						path="/stores"
						element={
							<ProtectedRoute>
								<Stores />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/available-today"
						element={
							<ProtectedRoute>
								<Stores />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/snacks"
						element={
							<ProtectedRoute>
								<Snacks />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/buffet"
						element={
							<ProtectedRoute>
								<Buffet />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/budget-meals"
						element={
							<ProtectedRoute>
								<BudgetMeals />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/budget-snacks"
						element={
							<ProtectedRoute>
								<Budgetsnacks />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/france-bistro-store"
						element={
							<ProtectedRoute>
								<Category1 />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/faspecc-store"
						element={
							<ProtectedRoute>
								<Category2 />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/france-bistro-snacks"
						element={
							<ProtectedRoute>
								<Snackss />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/france-bistro-buffets"
						element={
							<ProtectedRoute>
								<Buffetss />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/france-bistro-budget-meals"
						element={
							<ProtectedRoute>
								<Budgetmealss />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/france-bistro-budget-snacks"
						element={
							<ProtectedRoute>
								<Budgetsnackss />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/cart"
						element={
							<ProtectedRoute>
								<Cart />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/checkout"
						element={
							<ProtectedRoute>
								<Checkout />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/pay"
						element={
							<ProtectedRoute>
								<PayCash />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/place-order"
						element={
							<ProtectedRoute>
								<PlaceOrder />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/orders"
						element={
							<ProtectedRoute>
								<Order />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/cafeteria"
						element={
							<ProtectedRoute>
								<VendorStores />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/vendor-france-bistro"
						element={
							<ProtectedRoute>
								<VenCategory1 />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/faspecc-snacks"
						element={
							<ProtectedRoute>
								<FasSnacks />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/faspecc-budget-buffet"
						element={
							<ProtectedRoute>
								<FasBuffet />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/faspecc-budget-snacks"
						element={
							<ProtectedRoute>
								<FasBudgetsnacks />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/faspecc-budget-meals"
						element={
							<ProtectedRoute>
								<FasBudgetmeals />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/user-profile"
						element={
							<ProtectedRoute>
								<User />
							</ProtectedRoute>
						}
					/>

					{/* Records / Vendor Item Management Routes */}
					<Route
						path="/vendor-add-items"
						element={
							<ProtectedRoute>
								<AddItems />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/vendor-list-items"
						element={
							<ProtectedRoute>
								<AddItems />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/vendor-orders"
						element={
							<ProtectedRoute>
								<AddItems />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/add-items"
						element={<Navigate replace to="/vendor-add-items" />}
					/>

					{/* === ADMIN SECTION === */}
					<Route element={<Dasboard />}>
						<Route
							path="/admin-dashboard"
							element={
								<AdminProtectedRoute>
									<AdminDashboard />
								</AdminProtectedRoute>
							}
						/>
						<Route
							path="/admin-account-confirmation"
							element={
								<AdminProtectedRoute>
									<AdminAccountConfirmation />
								</AdminProtectedRoute>
							}
						/>
						<Route
							path="/admin-account-verified"
							element={
								<AdminProtectedRoute>
									<AdminAccountVerified />
								</AdminProtectedRoute>
							}
						/>
						<Route
							path="/admin-orders"
							element={
								<AdminProtectedRoute>
									<AdminOrders />
								</AdminProtectedRoute>
							}
						/>
						<Route
							path="/admin-reservation"
							element={
								<AdminProtectedRoute>
									<AdminReservation />
								</AdminProtectedRoute>
							}
						/>
					</Route>

					{/* === VENDOR SECTION === */}
					<Route
						path="/vendor/dashboard"
						element={
							<VendorProtectedRoute>
								<VendorDashboard />
							</VendorProtectedRoute>
						}
					/>
					<Route
						path="/vendor/create-store"
						element={
							<VendorProtectedRoute>
								<CreateStore />
							</VendorProtectedRoute>
						}
					/>
					<Route
						path="/vendor/products"
						element={
							<VendorProtectedRoute>
								<ProductManagement />
							</VendorProtectedRoute>
						}
					/>
					<Route
						path="/vendor/profile"
						element={
							<VendorProtectedRoute>
								<StoreProfile />
							</VendorProtectedRoute>
						}
					/>

					{/* Additional routes */}
					<Route path="/france-bistro-stores" element={<FranceCategory />} />
					<Route
						path="/choice-france-bistro-snacks"
						element={<FranceSnacks />}
					/>
					<Route
						path="/choice-france-bistro-buffet"
						element={<FranceBuffets />}
					/>
					<Route
						path="/choice-france-bistro-budget-snacks"
						element={<FranceBudgetSnacks />}
					/>
					<Route
						path="/choice-france-bistro-budget-meals"
						element={<FranceBudgetMeals />}
					/>

					<Route path="/faspecc-store-category" element={<FaspeccCategory />} />
					<Route path="/choice-faspecc-buffet" element={<FaspeccBuffet />} />
					<Route
						path="/choice-faspecc-budget-meals"
						element={<FaspeccBudgetMeals />}
					/>
					<Route
						path="/choice-faspecc-budget-snacks"
						element={<FaspeccBudgetSnacks />}
					/>
					<Route path="/choice-faspecc-snacks" element={<FaspeccSnacks />} />

					{/* Fallback for unmatched routes */}
					<Route
						path="*"
						element={
							<div style={{ padding: "20px", textAlign: "center" }}>
								<h2>404 - Page Not Found</h2>
							</div>
						}
					/>
				</Routes>
				<ToastContainer />
			</div>
		</div>
	);
};

// Protected Route Component for authenticated users
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					fontSize: "18px",
				}}
			>
				Loading...
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	return children;
};

// Protected Route Component for admin users
const AdminProtectedRoute = ({ children }) => {
	const { user, isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					fontSize: "18px",
				}}
			>
				Loading...
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	if (user?.role_id !== 3) {
		return (
			<div
				style={{
					padding: "20px",
					textAlign: "center",
				}}
			>
				<h2>Access Denied</h2>
				<p>You need admin privileges to access this page.</p>
			</div>
		);
	}

	return children;
};

// Protected Route Component for vendor users
const VendorProtectedRoute = ({ children }) => {
	const { user, isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					fontSize: "18px",
				}}
			>
				Loading...
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	if (user?.role_id !== 2) {
		return (
			<div
				style={{
					padding: "20px",
					textAlign: "center",
				}}
			>
				<h2>Access Denied</h2>
				<p>You need vendor privileges to access this page.</p>
			</div>
		);
	}

	return children;
};

const App = () => {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
};

export default App;
