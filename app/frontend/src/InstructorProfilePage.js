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
        <section className='information'>
          <h1>Billy Guy's Profile</h1>
          <p><strong>Name:</strong> Billy Guy</p>
          <p><strong>UBC ID:</strong>18592830</p>
          <p><strong>Service Roles:</strong> Undergradute Advisor</p>
          <p><strong>Monthly Hours Benchmark:</strong> 1200</p>
          <p><strong>Email:</strong> billyguy@instructor.ubc.ca</p>
          <p><strong>Phone Number:</strong> 778-381-2581</p>
          <p><strong>Office Location:</strong> SCI 200</p>
          <p><strong>Teaching Assignments:</strong> 
            <a href='#'>COSC 211</a>,
            <a href='#'> COSC 304</a>
          </p>
          <div className='service-roles'>
            <label htmlFor='current-service-roles'>Current Service Roles</label>
            <select id='current-service-roles'>
              <option>Select Role</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InstructorProfilePage;