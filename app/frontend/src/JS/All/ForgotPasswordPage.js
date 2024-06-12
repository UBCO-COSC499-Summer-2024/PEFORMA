import React, { useState } from 'react';
import '../../CSS/All/ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Request to reset password sent for:', email);
    // logic function (BE) for reset password below
    // .....
  };

  return (
    <div className="forgot-container">
      <header className="forgot-header">
        <div className="logo">PEFORMA</div>
        <nav>
          <a href="#support">Support</a>
          <button href="#login">Login</button>
        </nav>
      </header>
      <div className="forgot-form-container">
        <form onSubmit={handleSubmit}>
          <h1>Forgot Email/Password?</h1>
          <p>Your Email is University Instructor Email</p>
          <p>We will send you an email with instructions on how to reset your password.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <button type="submit">Email Me</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
