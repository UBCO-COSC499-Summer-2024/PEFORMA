import React from 'react';
import '../../CSS/Instructor/Dashboard.css';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';
import divisions from '../common/divisions.js';
import cardImages from '../common/cardImages.js';
import { Link } from 'react-router-dom';

function Dashboard() {
  
  return (
    <div className="dashboard">
      <CreateSidebar />
      <div className="container">
      <CreateTopbar />
        
        <div className="card-container">
          {divisions.map(division => {
            return (<Link to={"/CourseList?division="+division.code} key={division.code}><div className="card">
                      <img src={cardImages[division.code]} alt={division.label} />
                      <div className='cardTitle'>{division.label}</div>
                    </div></Link>
                    );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
