import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you'll want to navigate
import { assets } from '../assets/assets'; // Adjust path if necessary
import './styles/ForgotPassword.css'; // We'll create this CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // For potential navigation after sending code or back

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Implement your logic to send the password reset email
    console.log('Password reset requested for email:', email);
    alert('If an account exists for this email, instructions to reset your password have been sent.');
    // Optionally navigate to another page, e.g., back to login
    // navigate('/auth?mode=login');
  };

  return (
    <div className="fp-auth-container">
      {/* Background image is applied via CSS to fp-auth-container */}
      {/* <img src="/cafet.png" alt="Background" className="fp-bg" /> */}

      <div className="fp-auth-wrapper">
        {/* Left Panel - Consistent with your login/signup design */}
        <div className="fp-auth-panel fp-yellow-bg">
          <img src="/ustpfoodlogos.png" alt="Logo" className="fp-auth-logo" />
          <h2 className="fp-auth-heading">Hello, Trailblazer!</h2>
          <p>Unlock the experience--sign up and start now!</p>
          {/* You might want a button here to go back to login or signup */}
          {/* Example:
          <button
            className="fp-auth-switch"
            onClick={() => navigate('/auth?mode=login')}
          >
            Back to Login
          </button>
          */}
        </div>

        {/* Right Panel - Forgot Password Form */}
        <div className="fp-auth-panel fp-white-bg">
          <h2 className="fp-form-title">Forgot Password</h2>
          <p className="fp-form-description">
            Enter the email address you used to create the account, and we will email you instructions to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="fp-form">
            <label htmlFor="email" className="fp-input-label">Enter Email Address</label>
            <div className="fp-input-group">
              <img src={assets.email} alt="Email" className="fp-input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" " // Using space for floating label effect if desired, or remove
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="fp-input-field"
              />
            </div>
            <button className="fp-auth-submit" type="submit">
              Send Code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;