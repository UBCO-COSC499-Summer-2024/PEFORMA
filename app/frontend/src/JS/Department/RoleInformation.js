import React, { useState, useEffect, useRef } from 'react';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/RoleInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

import AssignInstructorsModal from '../assignInstructorsModal.js';

import { useAuth } from '../AuthContext';



function RoleInformation() {
const { authToken } = useAuth();
const [roleData, setRoleData] = useState({"assignees":[{}], assigneeCount:0, perPage: 5, currentPage: 1});
const [search, setSearch] = useState('');

const [instructorData, setInstructorData] = useState({"instructors":[{}], instructorCount:0, perPage: 8, currentPage: 1});
const [showInstructorModal, setShowInstructorModal] = useState(false);

const params = new URLSearchParams(window.location.search);
const serviceRoleId = params.get('roleid');


  useEffect(() => {
    const fetchData = async() => {
      const res = await axios.get(`http://localhost:3001/api/roleInfo`, {
        params: {serviceRoleId: serviceRoleId},
        headers: { Authorization: `Bearer ${authToken.token}` }
      });
      const data = res.data;
      const filledAssignees = fillEmptyAssignees(data.assignees, data.perPage);
      setRoleData({ ...data, assignees: filledAssignees });

      const url2 = "http://localhost:3000/assignInstructors.json"; // Gets from temporary JSON file. Should be replaced with backend.
          const res2 = await axios.get(url2);
          const data2 = res2.data;
          const filledInstructors = fillEmptyAssignees(data2.instructors, data2.perPage);
          setInstructorData({ ...data2, instructors: filledInstructors });
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

  const prevInstructors = useRef({});

  const handleShowInstructorModal = () => {

      prevInstructors.current = JSON.stringify(instructorData);
      setShowInstructorModal(true);
  };


  const handleCloseInstructorModal = (save) => {
      if (!save) {
          if (window.confirm("If you exit, your unsaved data will be lost. Are you sure?")) {
              setInstructorData(JSON.parse(prevInstructors.current));
          } else {
            
              return;
          }
      } else {
      roleData.assignees = [];
            console.log(roleData);
            for (let i = 0; i < instructorData.instructors.length; i++) {
              if (instructorData.instructors[i].assigned) {
                roleData.assignees.push({"instructorID":instructorData.instructors[i].id, "name":instructorData.instructors[i].name});
              }
            }

      updateAssignees();
      }
      setShowInstructorModal(false);
      
  };

const updateAssignees = async() => {
  let assignedInstructors = [];
  for (let i = 0; i < instructorData.instructors.length; i++) {
      if (instructorData.instructors[i].assigned === true) {
          assignedInstructors.push(instructorData.instructors[i].id);
      }
  }
  
  // Submitting new data goes here:
}

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
      
      <div className='ri-main'>
        <h1 className='roleName'>{roleData.roleName}</h1>
        <div className='description'>{roleData.roleDescription}</div>
        <p>Department: <span className='bold' role='contentinfo'>{roleData.department}</span></p>
        <p>Benchmark: <span className='bold' role='contentinfo'>{roleData.benchmark} hours/month</span></p>
        <div className='buttons'>
            <button role="button" id="edit">Edit Role</button>
            <button role='button' id="deactivate">Deactivate</button>
        </div>

        <h1 className='roleName'>Assignee's</h1>
        <button type="button" data-testid="assign-button" className="assign-button" onClick={handleShowInstructorModal}><span className="plus">+</span> Assign Professors(s)</button>
        <p>Current Assignee's</p>
        <input type="text" placeholder="Search for people assigned to this role." onChange={e => onSearch(e.target.value)} />
        <div className='assigneeTable'>
        <table>
            <tbody>
              
            {currentAssignees.map(assignee => {
              i++;
              if (assignee.instructorID == "" || assignee.instructorID == null) {
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
                      <Link to={`/DepartmentProfilePage?ubcid=${(assignee.instructorID)}`}>{assignee.name} ID:{assignee.instructorID}</Link>
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
          {showInstructorModal && (
                <AssignInstructorsModal instructorData={instructorData} setInstructorData={setInstructorData} handleCloseInstructorModal={handleCloseInstructorModal}/>
            )}
      </div>
    </div>
  </div>
  );
}

export default RoleInformation;