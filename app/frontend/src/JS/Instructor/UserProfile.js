import React from 'react';
import '../../CSS/Instructor/UserProfile.css';


function UserProfile() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#performance">Performance</a>
        </nav>
      </aside>
      <div className="profile-container">
        <header>
          <h1>Billy Guy's Profile</h1>
          <button onClick={() => console.log('Logging out...')} className="logout-button">Logout</button>
        </header>
        <div className="profile-details">
          <div className="profile-info">
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
