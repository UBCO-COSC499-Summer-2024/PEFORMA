import React, { useState } from 'react';
import './InstructorProfilePage.css';
import { FaHome, FaSmile } from 'react-icons/fa';

function InstructorProfilePage() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>PEFORMA</h2>
        <hr className="divider" />
        <ul className="menu">
          <li><a href="#"><FaHome className="icon" size={30} /> Dashboard</a></li>
          <li><a href="#"><FaSmile className="icon" size={30} /> Performance</a></li>
        </ul>
      </aside>
      <div className='content'>
        <header>
          <div className="profile">
          </div>
          <button className="logout">Logout</button>
        </header>
      </div>
    </div>
  );
}

export default InstructorProfilePage;