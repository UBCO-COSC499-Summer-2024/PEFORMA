import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../CSS/Instructor/PerformanceInstructorPage.css';
import CreateSidebar, { CreateLeaderboardChart, CreateScorePolarChart, CreateTopbar, CreateWorkingBarChart } from '../commonImports.js';


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
          <div className='greeting'>
            <h1>Welcome {profile.name}!</h1>
            <h2>Check out your performance!</h2>
          </div>
          

          <div className='info-table'>
            <section className='info-section'>
              <h2 className='subTitle'>Your Information</h2>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>UBC ID:</strong> {profile.ubcid}</p>
              <p><strong>Service Roles:</strong> {profile.roles.map(role => role).join(', ')}</p>
              <p><strong>Monthly Hours Benchmark:</strong> {profile.benchmark}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p className='teaching-margin'><strong>Teaching Assignments:</strong></p>
              <ul className='teaching-assignments'>
                {profile.teachingAssignments.map(teachingAssign => (
                  <li key={teachingAssign.id}>
                    <a href='{teachingAssign.link}'> {teachingAssign.assign}</a>
                  </li>
                ))}
              </ul>
            </section>

            <div className="graph-section">
              <h2 className='subTitle'>Working Hours</h2>
              <CreateWorkingBarChart />
            </div>
          </div>

        <div className='bottom-section'>

          <div className='polarchart-section'>
            <h2 className='subTitle'>Department Performance</h2>
            <CreateScorePolarChart />
          </div>

          <div className='leaderboard-section'>
            <h2 className='subTitle'>Leader Board (Updated per month)</h2>
            <CreateLeaderboardChart />
          </div>
        </div>
          
      </div>
    </div>
  );
}

export default UserProfile;
