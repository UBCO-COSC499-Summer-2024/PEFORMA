import React from 'react';
import "../../CSS/common.css";
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
