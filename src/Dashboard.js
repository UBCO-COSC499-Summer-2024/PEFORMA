import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
      <div className='sidebar-header'>
        <h1>PERFORMA</h1>
        <hr/>
      </div>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#performance">Performance</a>
        </nav>
      </aside>
      <div className="dashboard-main-content">
        <header className='web-head'>
          <input type="search" placeholder="Search by Subject (e.g. CS123) or Instructor name (e.g. Chipinski)" />
          <img src='temp.png' alt=''/>
          <button onClick={() => console.log('Logout')}>Logout</button>
        </header>
        <div className="card-container">
          <div className="card">
            {/* image path replace needed , total 4,saved in public folder*/} 
            <img src="./temp.png" alt="Computer Science" />
            <div>Computer Science</div>
          </div>

          <div className="card">
            <img src="./temp.png" alt="Mathematics" />
            <div>Mathematics</div>
          </div>

          <div className="card">
            <img src="./temp.png" alt="Physics" />
            <div>Physics</div>
          </div>

          <div className="card">
            <img src="./temp.png" alt="Statistics" />
            <div>Statistics</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
