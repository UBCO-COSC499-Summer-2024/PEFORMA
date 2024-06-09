import React, { useState } from 'react';
import './InstructorProfilePage.css';

function InstructorProfilePage() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>PEFORMA</h2>
        <ul className="menu">
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Performance</a></li>
        </ul>
      </aside>
      <div className='top'>
        <button className="logout">Logout</button>
      </div>

      
    </div>
    
    
  );
}

export default InstructorProfilePage;