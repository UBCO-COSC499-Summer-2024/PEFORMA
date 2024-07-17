import React, { useState } from 'react';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
  );
};

export default NewPassword;
