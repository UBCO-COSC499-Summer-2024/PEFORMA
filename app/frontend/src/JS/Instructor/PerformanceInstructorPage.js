import React from 'react';
import '../../CSS/Instructor/PerformanceInstructorPage.css';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';


function UserProfile() {
  return (
    <div className="dashboard-container">
      <CreateSidebar />

      <div className="container">
          <CreateTopbar />

        <div className="profile-details">
          <div className="profile-info">
          <h1>Billy Guy's Profile</h1>
            <p>Name: Billy Guy</p>
            <p>UBC ID: 123413234</p>
            <p>Service Role: Professor</p>
            <p>Monthly Hours Benchmark: 1192</p>
            <p>Email: billyguy123@ubc.ca</p>
            <p>Phone Number: 250-123-1234</p>
            <p>Office Location: Alaska</p>
            <p>Teaching Courses:</p>
            
            <p>MATH 064<br/>MATH 745</p>
            {/* change course by data↑ */}

            <div className="score">
              <h2>Billy Guy's Score:</h2>
              <h2 className='compare'>85.7 </h2>
              <h2 className='compare'> ↑ </h2>
            </div>
          </div>
          <div className="graph-section">
            <img src='temp.png' className='graph'/>
            <button>Graph Options</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
