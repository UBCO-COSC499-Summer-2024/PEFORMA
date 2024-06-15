import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../CSS/Instructor/PerformanceInstructorPage.css';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';


function UserProfile() {
  const params = new URLSearchParams(window.location.search);
  const ubcid = params.get('ubcid');

  const initProfile = {"roles":[],"teachingAssignments":[{}]};
  const [profile, setProfile] = useState(initProfile)

  useEffect(() => {
    const fetchData = async() => {
      const res = await axios.get('http://localhost:3000/profileSample.json?ubcid=' + ubcid); //replace it to api
      return res.data;    
    }
    fetchData().then(res => setProfile(res));
  }, []);

  return (
    <div className="dashboard-container">
      <CreateSidebar />

      <div className="container">
          <CreateTopbar />
          <div className='info-table'>
            <section className='information'>
              <h1>Welcome {profile.name}!</h1>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>UBC ID:</strong> {profile.ubcid}</p>
              <p><strong>Service Roles:</strong> {profile.roles.map(role => role).join(', ')}</p>
              <p><strong>Monthly Hours Benchmark:</strong> {profile.benchmark}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Teaching Assignments:</strong> 
                {profile.teachingAssignments.map(teachingAssign => (
                <a href='{teachingAssign.link}'> {teachingAssign.assign}</a>
                )).reduce((prev, curr) => [prev, ', ', curr])}
              </p>
            </section>

            <div className="graph-section">
            
            </div>
          </div>

        <div className="profile-details">
          <div className="profile-info">
            <div className="score">
              <h2>Billy Guy's Score:</h2>
              <h2 className='compare'>85.7 </h2>
              <h2 className='compare'> ↑ </h2>
            </div>
          </div>
        </div>
        
        <div className='dept-info'>
          <h1>Department Performance</h1>

        </div>
          
      </div>
    </div>
  );
}

export default UserProfile;
