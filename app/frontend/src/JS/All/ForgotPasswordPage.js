import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/All/ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const navigate = useNavigate(); // Function for navigating to different page
  // State variables
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  // Function that's called when form is submitted
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email);
    // Set 'sent' state of page to true, changing the send button and removing the email input
    setSent(true);
    // Send email to the backend, to be sent an email
    axios.post("http://localhost:3001/api/reset-password", {email});
  };

  // Function for taking the user to the login page after clicking the login button
  const handleLogin = () => {
    // Send user to login page
    navigate('/Login');
  };

  return (
    <div className="forgot-container">
      <header className="forgot-header">
      <h2 className="logo"><Link to="/">PEFORMA</Link></h2>
        <nav>
          <button onClick={handleLogin}>Login</button>
        </nav>
      </header>
      <div className="forgot-form-container">
        <form onSubmit={handleSubmit}>
          <h1>Forgot Email/Password?</h1>
          <p>We will send you an email with instructions on how to reset your password.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          {sent === false && (
            <button type="submit" className='send-button'>Email Me</button>
          )}
          {sent === true && (
            <button type="button" className="email-sent-button">Email Sent!</button>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
