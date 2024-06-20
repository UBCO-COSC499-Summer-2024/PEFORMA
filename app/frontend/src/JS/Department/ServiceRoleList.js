import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import '../../CSS/Department/ServiceRoleList.css';
import { Link, useNavigate } from 'react-router-dom';
import '../common/divisions.js';
import axios from 'axios';

function showRoles(roleData, offset){
  if (roleData.rolesCount > 10) {
    return roleData.roles.slice(offset, offset + roleData.perPage);
  }
  return roleData.roles;
}

function ServiceRoleList() {

  const [roleData, setRoleData] = useState({"roles":[{}], rolesCount:0, perPage: 10, currentPage: 1});
  

  useEffect(() => {
    const fetchData = async() => {
      const url = "http://localhost:3000/serviceRoles.json";
      const res = await axios.get(url);
      const data = res.data;
      const filledRoles = fillEmptyRoles(data.roles, data.perPage);
      setRoleData({ ...data, roles: filledRoles });
    }
    fetchData();
  }, []);

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
                  <tr key={role.name}>
                    <td>{role.name}</td>
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