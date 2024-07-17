import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../CSS/All/NewPassword.css';
import axios from 'axios';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  

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
    
      setMessage('Passwords do not match!');
      return;
    }
    console.log("Restting password for email:\n\t"+email+"\n with new password:\n\t"+password);
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
    setMessage(data.message);
    alert(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set New Password for account {email} </h2>
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
      <button type="submit">Update Password</button>
    </form>
      )}
      {success && (
        <form className="success-message">
          <p>Password reset successfully!</p>
          <Link to="/Login"><button className="return" type="button">Return to Login</button></Link>
        </form>
      )}
      
    </div>
    </div>
  );
};

export default NewPassword;