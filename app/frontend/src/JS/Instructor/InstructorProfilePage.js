import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/Instructor/InstructorProfilePage.css';
//import { FaHome, FaChartLine } from 'react-icons/fa';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';

function InstructorProfilePage() {
  const params = new URLSearchParams(window.location.search);
  const ubcid = params.get('ubcid');

  const initProfile = {"roles":[],"teachingAssignments":[{}]};
  const [profile, setProfile] = useState(initProfile);

  useEffect(() => {
    const fetchData = async() => {
      const res = await axios.get('http://localhost:3000/profileSample.json?ubcid=' + ubcid); //replace it to api
      return res.data;
    }

    fetchData().then(res => setProfile(res));
  }, []);

  // const profile = {"name":"Billy Guy", "id":"18592831", "benchmark":"1300", "roles":["Role1", "Role2"], "email":"billyGuy@instructor.ubc.ca", "phone":"778-333-2222", "office":"SCI 300", "teachingAssignments":[{"assign":"COSC 211","link":"abc.com"},{"assign":"COSC 304","link":"def.com"}]};

  return (
    <div className="dashboard-container">
      
      <CreateSidebar />
        <div className='container'>
        <CreateTopbar />
        <div className="main-content">
          <section className='information'>
            <h1> {profile.name}'s Profile</h1>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>UBC ID:</strong> {profile.ubcid}</p>
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
    </div>
  );
}

export default InstructorProfilePage;