import React, { useState } from 'react';
import '../../CSS/All/Login.css';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // login logic function call below (BE)
    // .......
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h2 className="logo">PEFORMA</h2>
      </header>
      <div className="login-form-container">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <a id="forgot" href="#forgot">Forgot password?</a>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
