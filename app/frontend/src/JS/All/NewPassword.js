import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../CSS/All/NewPassword.css';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const emailFromUrl = query.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.")
      return;
    }
    
    const response = await fetch(`http://localhost:3001/api/update-password?email=${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (data.message === "success") {
      setSuccess(true);
    } else {
      alert("Error: Email is not associated with an account.");
    }
  };

  return (
    <div className="forgot-container">
    <header className="forgot-header">
    <h2 className="logo"><Link to="/">PEFORMA</Link></h2>
    </header>
    <div className="forgot-form-container">
    
      {!success && (
    <form onSubmit={handleSubmit}>    
    <p>Set new password for <strong>{email}</strong>: </p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        required
      />
      <button className="send-button" type="submit">Update Password</button>
    </form>
      )}
      {success && (
        <form className="success-message">
          <p>Password reset successfully!</p>
          <Link to="/Login"><button className="send-button" type="button">Return to Login</button></Link>
        </form>
      )}
      
    </div>
    </div>
  );
};

export default NewPassword;