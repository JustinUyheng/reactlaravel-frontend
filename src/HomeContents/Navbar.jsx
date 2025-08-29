import React, { useState } from "react";
import "./style/Navbar.css"; // Ensure this path is correct
import { assets } from "../assets/assets"; // Ensure this path is correct
import { Link } from "react-router-dom";

const Navbar = () => {
  // const [menu, setMenu] = useState("menu"); // This state variable is not used. You can remove it if not needed.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="navbar">
        {/* Left: Hamburger + Logo */}
        <div className="navbar-left">
          <img
            src={assets.hamburger} // Make sure assets.hamburger is correctly defined
            alt="menu"
            className="hamburger"
            onClick={toggleSidebar}
          />
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={assets.ustpfoodlogo} alt="USTP Food Logo" className="ustpfoodlogo" />
          </Link>
        </div>

        {/* Right: Auth Buttons */}
        <div className="navbar-right">
          <Link to="/auth?mode=login"><button className="login-btn">Login</button></Link> {/* Changed class for consistency */}
          <Link to="/auth?mode=signup"><button className="signup-btn">Sign Up</button></Link> {/* Changed class for consistency */}
        </div>
      </div>

      {/* Full-width horizontal line - This should be visible with correct CSS */}
      <hr className="navbar-divider" />

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-close-btn" onClick={toggleSidebar}>&times;</span> {/* Using &times; for a common close icon */}
        </div>
        <div className="sidebar-content">
          <Link to="/about-us" className="sidebar-link" onClick={toggleSidebar}>
            <div className="sidebar-item">
              <img src="/about-us.png" alt="About Us Icon" /> {/* Example: Assuming icons are in public/images/icons */}
              <span>About Us</span>
            </div>
          </Link>
          <Link to="/contact-us" className="sidebar-link" onClick={toggleSidebar}>
            <div className="sidebar-item">
              <img src="/phone-call.png" alt="Contact Us Icon" />
              <span>Contact Us</span>
            </div>
          </Link>
          <Link to="/faq" className="sidebar-link" onClick={toggleSidebar}>
            <div className="sidebar-item">
              <img src="/question.png" alt="FAQ Icon" />
              <span>FAQ</span>
            </div>
          </Link>
          <Link to="/feedback" className="sidebar-link" onClick={toggleSidebar}>
            <div className="sidebar-item">
              <img src="/rate.png" alt="Feedback Icon" />
              <span>Feedback</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;