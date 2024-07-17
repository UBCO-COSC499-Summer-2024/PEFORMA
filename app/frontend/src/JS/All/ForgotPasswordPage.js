import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/All/ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email);
    setSent(true);
    axios.post("http://localhost:3001/api/reset-password", {email});
  };

  const handleLogin = () => {
    // add login jump-to-page logic here
    console.log('Login button clicked');
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
