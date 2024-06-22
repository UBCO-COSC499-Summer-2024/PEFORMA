import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import '../../CSS/Department/ServiceRoleList.css';
import { Link, useNavigate } from 'react-router-dom';
import '../common/divisions.js';
import axios from 'axios';
import '../AuthContext.js';
import { useAuth } from '../AuthContext.js';

function showRoles(roleData, offset){
  if (roleData.rolesCount > 10) {
    return roleData.roles.slice(offset, offset + roleData.perPage);
  }
  return roleData.roles;
}

function ServiceRoleList() {

  const { authToken } = useAuth();

  const navigate = useNavigate();

  const [roleData, setRoleData] = useState({"roles":[{}], rolesCount:0, perPage: 10, currentPage: 1});

  useEffect(() => {
    const fetchServiceRoles = async () => {
      try {
        if (!authToken) {
          // Redirect to login if no token
          navigate('/Login'); // Use your navigation mechanism
          return;
        }

        // Fetch course data with Axios, adding token to header
        const res = await axios.get(`http://localhost:3001/api/service-roles`, {
          headers: { Authorization: `Bearer ${authToken.token}` } 
        });
        const data = res.data;
        const filledRoles = fillEmptyRoles(data.roles, data.perPage);
        setRoleData({ ...data, roles: filledRoles });
      } catch (error) {
        // Handle 401 (Unauthorized) error and other errors
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken'); // Clear invalid token
          navigate('/Login'); 
        } else {
          console.error('Error fetching service roles:', error);
        }
      }
    };
    fetchServiceRoles();
  }, [authToken]); 

  const fillEmptyRoles = (roles, perPage) => {
    const filledRoles = [...roles];
    const currentCount = roles.length;
    const fillCount = perPage - (currentCount % perPage);
    if (fillCount < perPage) {
      for (let i  = 0; i < fillCount; i++) {
        filledRoles.push({});
      }
    }
    return filledRoles;
  }

  const handlePageClick = (data) => {
    setRoleData(prevState => ({
      ...prevState,
      currentPage: data.selected + 1
    }))
  };

  const pageCount = Math.ceil(roleData.rolesCount / roleData.perPage);
  const offset = (roleData.currentPage - 1) * roleData.perPage;
  const currentRoles = showRoles(roleData, offset);
  console.log(currentRoles);

  return (

    <div className="dashboard">  
    <CreateSidebarDept />
    <div className='container'>
      <CreateTopbar />
      
      <div className='main'>

        <div className='subtitle-role'>List of Serivce Roles ({roleData.rolesCount} Active) </div>
        
        <div className="role-table">
          <table>

            <thead>
              <tr>
                <th>Role</th>
                <th>Department</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>

            {currentRoles.map(role => {
                return (
                  <tr key={role.id}>
                    <td><Link to={`http://localhost:3000/RoleInformation?roleid=${(role.id)}`}>{role.name}</Link></td>
                    <td>{role.department}</td>
                    <td>{role.description}</td>
                  </tr>
                );
              })}

            </tbody>
          </table>

          <tfoot>
              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={3}
                pageRangeDisplayed={0}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
              />
            </tfoot>

        </div>

      </div>
    </div>
  </div>
  );
}

export default ServiceRoleList;