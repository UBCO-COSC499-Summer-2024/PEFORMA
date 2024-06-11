import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InstructorProfilePage.css';
import { FaHome, FaSmile } from 'react-icons/fa';

function InstructorProfilePage() {
  const [profile, setProfile] = useState({"roles":[],"teachingAssignments":[{}]});

  useEffect(() => {
    const fetchData = async() => {
      const res = await axios.get('http://localhost:3000/profileSample.json'); //replace it to api
      return res.data;
    }

    fetchData().then(res => setProfile(res));
  });

  // const profile = {"name":"Billy Guy", "id":"18592831", "benchmark":"1300", "roles":["Role1", "Role2"], "email":"billyGuy@instructor.ubc.ca", "phone":"778-333-2222", "office":"SCI 300", "teachingAssignments":[{"assign":"COSC 211","link":"abc.com"},{"assign":"COSC 304","link":"def.com"}]};

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
          <h1> {profile.name}'s Profile</h1>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>UBC ID:</strong> {profile.id}</p>
          <p><strong>Service Roles:</strong> {profile.roles.map(role => role).join(', ')}</p>
          <p><strong>Monthly Hours Benchmark:</strong> {profile.benchmark}</p>
          <p><strong>Phone Number:</strong> {profile.phone}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Office Location:</strong> {profile.office}</p>
          <p><strong>Teaching Assignments:</strong> 
            {profile.teachingAssignments.map(teachingAssign => (
            <a href='{teachingAssign.link}'> {teachingAssign.assign}</a>
            )).reduce((prev, curr) => [prev, ', ', curr])}
          </p>
        </section>
      </div>
    </div>
  );
}

export default InstructorProfilePage;