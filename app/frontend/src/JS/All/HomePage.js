import React from 'react';
import "../../CSS/common.css";
import '../../CSS/All/HomePage.css';
import { useNavigate } from 'react-router-dom';

function HomePage () {
  const navigate = useNavigate(); // To be used to navigate to different pages

  // Function to be called when the user clicks the login button
  const handleLogin = () => {
    // Send the user to the login page
    navigate('/Login');
  };

  return (
      <div className="home-container">
        <header className="homepage-header">
          <h2 className='logo'>PEFORMA</h2>
          <nav>
            <button onClick={handleLogin}>Login</button>
          </nav>
        </header>
        <main className="homepage-main">
          <h1 className='descHeader'>Get Professional Performance Feedback</h1>
          <p className='desc'>View your service role assignments, hours, benchmarks, and more, all at a glance.</p>
        </main>
        <footer className="footer">

        </footer>
      </div>
    );
}

export default HomePage;
