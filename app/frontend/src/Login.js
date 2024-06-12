import React, { useState } from 'react';
import './Login.css'; // 引入样式文件

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
        <div className="logo">PEFORMA</div>
        <nav>
          <a href="#support">Support</a>
          <button href="#login">Login</button>
        </nav>
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
          <a href="#forgot">Forgot password?</a>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
