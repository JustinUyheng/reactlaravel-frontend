// Navbars.jsx

import React, { useState, useEffect } from "react";
import "./styless/Navbars.css"; // Make sure 'styless' is the correct folder name
import { assets } from "../assets/assets"; // Ensure this path is correct for your assets
import { Link, useLocation } from "react-router-dom";

const Navbars = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    // For debugging, you can log the current path:
    // console.log("Current Navbar Path:", currentPath);

    if (currentPath === "/" || currentPath === "/homepage") {
      setActiveLink("home");
    } else if (
      currentPath.startsWith("/stores") || // General stores page
      currentPath.startsWith("/store-buffets") || // From Category1.jsx
      currentPath.startsWith("/store-budget-meals") || // From Category1.jsx
      currentPath.startsWith("/store-budget-snacks") || // From Category1.jsx
      currentPath.startsWith("/store-snacks") || // From Category1.jsx & likely for Snackss.jsx
      currentPath.startsWith("/availabletoday") ||
      currentPath.startsWith("/france-bistro-store") ||
      currentPath.startsWith("/faspecc-store") ||
      // Add other distinct store-related root paths here if they don't start with /store-
      // For example, if Snackss.jsx is ONLY routed to "/snacks" and not "/store-snacks"
      currentPath.startsWith("/snacks") || // Covers the case if Snackss.jsx is at /snacks
      currentPath.startsWith("/budgetmeals") || // Covers a potential /budgetmeals direct route
      currentPath.startsWith("/buffets") // Covers a potential /buffets direct route
    ) {
      setActiveLink("stores");
    } else if (currentPath.startsWith("/user-profile")) {
      setActiveLink("user-profile");
    }
    // Removed the 'else' block to ensure the active link persists
    // if navigating to a sub-route not explicitly listed but part of a section.
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavLinkClick = (linkName) => {
    setActiveLink(linkName);
    if (linkName === "home" && (location.pathname === "/" || location.pathname === "/homepage")) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Optional: Scroll to top when "Stores" is clicked if desired
    // if (linkName === "stores" && location.pathname.startsWith("/stores")) {
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    // }
  };

  const handleSidebarLinkClick = (linkName) => { // linkName might be useful for future logic
    closeSidebar();
  };


  return (
    <>
      <div className="navbars" id="Homepage">
        <div className="navbar-left">
          <img
            src={assets.hamburger}
            alt="menu"
            className="hamburger"
            onClick={toggleSidebar}
          />
          <Link to="/" onClick={() => handleNavLinkClick("home")}>
            <img src={assets.ustpfoodlogo} alt="logo" className="ustpfoodlogo" />
          </Link>
        </div>

        <div className="navbar-right">
          <Link
            to="/homepage" // Or "/"
            className={`nav-link ${activeLink === "home" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("home")}
          >
            Home
          </Link>
          <Link
            to="/stores" // This should link to your main stores listing or a default store page
            className={`nav-link ${activeLink === "stores" ? "active" : ""}`}
            onClick={() => handleNavLinkClick("stores")}
          >
            Stores
          </Link>
          <Link
            to="/user-profile"
            className={`nav-link ${activeLink === "user-profile" ? "active" : ""}`} // Added nav-link for consistent styling potential
            onClick={() => handleNavLinkClick("user-profile")}
          >
            <img src={assets.user} alt="user" className="User" />
          </Link>
        </div>
      </div>

      <hr className="navbar-divider" />

      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <span className="close-btn" onClick={toggleSidebar}>×</span>
        </div>
        <div className="sidebar-content">
          {/* Pass linkName to handleSidebarLinkClick if you intend to use it */}
          <Link to="/about-us" onClick={() => handleSidebarLinkClick("about-us")}>
            <div className="sidebar-item"><img src="/about-us.png" alt="About Us" />About Us</div>
          </Link>
          <Link to="/contact-us" onClick={() => handleSidebarLinkClick("contact-us")}>
            <div className="sidebar-item"><img src="/phone-call.png" alt="Contact Us" />Contact Us</div>
          </Link>
          <Link to="/faq" onClick={() => handleSidebarLinkClick("faq")}>
            <div className="sidebar-item"><img src="/question.png" alt="FAQ" />FAQ</div>
          </Link>
          <Link to="/feedback" onClick={() => handleSidebarLinkClick("feedback")}>
            <div className="sidebar-item"><img src="/rate.png" alt="Feedback" />Feedback</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbars;