import React, { Component } from 'react';
import '../../CSS/All/HomePage.css';
import { useNavigate } from 'react-router-dom';

function HomePage () {
  const navigate = useNavigate();
  // process login button event
  const handleLogin = () => {
    // add login jump-to-page logic here
    console.log('Login button clicked');
    navigate('/Login');
  };

  return (
      <div className="home-container">
        <header className="homepage-header">
          <div className="logo">PEFORMA</div>
          <nav>
            <a href="#support">Support</a>
            <button onClick={handleLogin}>Login</button>
          </nav>
        </header>
        <main className="main-content">
          <h1>Get professional performance feedback</h1>
          <p>Join to see the teaching assignment with individual performance of each months</p>
        </main>
        <footer className="footer">
          <a href="#about">ABOUT US</a>
          <a href="#terms">TERMS OF USE</a>
          <a href="#copy">Copyright</a>
        </footer>
      </div>
    );
}

export default HomePage;
