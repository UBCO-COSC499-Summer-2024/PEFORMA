import React from 'react';
import '../../CSS/Instructor/Dashboard.css';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';
import divisions from '../common/divisions.js';
import cardImages from '../common/cardImages.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
	const { profileId } = useAuth();
  const { authToken } = useAuth();
  const navigate = useNavigate();

  if (!authToken) {
    navigate('/Login');
    return;
  }
  return (
    <div className="dashboard">
      <CreateSidebar />
      <div className="container">
      <CreateTopbar />
        
        <div className="card-container">
          {divisions.map(division => {
            return (<Link to={`/CourseList?division=${division.code}&profileId=${profileId}`} key={division.code}><div className="card" role="gridcell">
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
