import React, { useState, useEffect } from 'react';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/RoleInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';



function RoleInformation() {

const [roleData, setRoleData] = useState({"assignees":[{}], assigneeCount:0, perPage: 5, currentPage: 1});
const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async() => {
      const url = "http://localhost:3000/assignees.json";
      const res = await axios.get(url);
      const data = res.data;
      const filledAssignees = fillEmptyAssignees(data.assignees, data.perPage);
      setRoleData({ ...data, assignees: filledAssignees });
    }
    fetchData();
  }, []);

  const fillEmptyAssignees = (assignees, perPage) => {
    const filledAssignees = [...assignees];
    const currentCount = assignees.length;
    const fillCount = perPage - (currentCount % perPage);
    if (fillCount < perPage) {
      for (let i  = 0; i < fillCount; i++) {
        filledAssignees.push({});
      }
    }
    return filledAssignees;
  }

  function showAssignees(assigneeData, offset){
    if (assigneeData.assigneeCount > roleData.perPage) {
      return assigneeData.assignees.slice(offset, offset + assigneeData.perPage);
    }
    return assigneeData.assignees;
  }
  
  const handlePageClick = (data) => {
    setRoleData(prevState => ({
      ...prevState,
      currentPage: data.selected + 1
    }))
  };



const onSearch = (newSearch) => {
  console.log("Searched:", newSearch);
  setSearch(newSearch);
  setRoleData(prevState => ({ ...prevState, currentPage: 1 }));
};

const pageCount = Math.ceil(roleData.assigneeCount / roleData.perPage);
const offset = (roleData.currentPage - 1) * roleData.perPage;


const filteredAssignees = roleData.assignees.filter(assignee =>
  (assignee.name?.toString().toLowerCase() ?? "").includes(search.toLowerCase()) ||
  (assignee.instructorID?.toString().toLowerCase() ?? "").includes(search.toLowerCase())
);


const currentAssignees = filteredAssignees.slice(
  (roleData.currentPage - 1) * roleData.perPage,
  roleData.currentPage * roleData.perPage
);
let i = 0;
  return (

    <div className="dashboard">  
    <CreateSidebarDept />
    <div className='container'>
      <CreateTopbar />
      
      <div className='main'>
        <h1 className='roleName'>{roleData.roleName}</h1>
        <div className='description'>{roleData.roleDescription}</div>
        <p>Department: <span className='bold' role='contentinfo'>{roleData.department}</span></p>
        <p>Benchmark: <span className='bold' role='contentinfo'>{roleData.benchmark} hours/month</span></p>
        <div className='buttons'>
            <button role="button" id="edit">Edit Role</button>
            <button role='button' id="deactivate">Deactivate</button>
        </div>

        <h1 className='roleName'>Assignee's</h1>
        <button role='button' id="assign"><span className="plus">+</span>Assign People</button>
        <p>Current Assignee's</p>
        <input type="text" placeholder="Search for people assigned to this role." onChange={e => onSearch(e.target.value)} />
        <div className='assigneeTable'>
        <table>
            <tbody>
              
            {currentAssignees.map(assignee => {
              i++;
              if (assignee.instructorID == null) {
                return (
                  <tr key={i}>
                    <td>
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr key={assignee.instructorID}>
                    <td>
                      <Link to={`/DepartmentProfilePage?roleid=${(assignee.instructorID)}`}>{assignee.name} ID:{assignee.instructorID}</Link>
                    </td>
                  </tr>
                );
              }
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>
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
              </td>
              </tr>
            </tfoot>
        </table>
        
          </div>
      </div>
    </div>
  </div>
  );
}

export default RoleInformation;