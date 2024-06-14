import React, { useEffect } from 'react';
import '../../CSS/Instructor/Dashboard.css';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';
import divisions from '../common/divisions.js';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  let navigate = useNavigate();
  
  
  
  return (
    <div className="dashboard">
      <CreateSidebar />
      <div className="container">
      <CreateTopbar />
        
        <div className="card-container">
          {divisions.map(division => {
            return (<Link to={"/CourseList?division="+division.code} key={division.code}><div className="card">
                  
                      <img src="./temp.png" alt={division.label} />
                      <div>{division.label}</div>
                    </div></Link>
                    );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
