import React from 'react';
import '../../CSS/Instructor/Dashboard.css';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';

function Dashboard() {
  return (
    <div className="dashboard">
      <CreateSidebar />
      <div className="container">
      <CreateTopbar />
        <header className='web-head'>
          <input type="search" placeholder="Search by Subject (e.g. CS123) or Instructor name (e.g. Chipinski)" />
          
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
