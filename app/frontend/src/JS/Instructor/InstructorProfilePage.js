import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import CreateSidebar, { CreateTopbar } from '../commonImports';
import '../../CSS/Instructor/InstructorProfilePage.css';

function InstructorProfilePage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const ubcid = params.get('ubcid');
  const { authToken } = useAuth();
  const initProfile = { roles: [], teachingAssignments: [] };
  const [profile, setProfile] = useState(initProfile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authToken) {
          navigate('/Login');
          return;
        }
        const response = await axios.get(`http://localhost:3001/api/instructorProfile`, {
          params: {ubcid:ubcid }, // Add ubcid as query parameter
          headers: { Authorization: `Bearer ${authToken.token}` }
        });
        console.log(response);

        if (response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/Login');
        } else {
          console.error('Error fetching instructor profile:', error);
        }
      }
    };

    fetchData();
  }, [authToken, ubcid, navigate]);
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
              )).reduce((prev, curr) => [prev, ', ', curr],[])}
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}

export default InstructorProfilePage;