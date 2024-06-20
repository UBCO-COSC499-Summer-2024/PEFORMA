import React, { useState, useEffect } from 'react';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import '../../CSS/Department/RoleInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function showAssignees(assigneeData, offset){
    if (assigneeData.assigneeCount > 10) {
      return assigneeData.assignees.slice(offset, offset + assigneeData.perPage);
    }
    return assigneeData.assignees;
  }

function RoleInformation() {

const [assigneeData, setAssigneeData] = useState({"assignees":[{}], assigneeCount:0, perPage: 5, currentPage: 1});

  useEffect(() => {
    const fetchData = async() => {
      const url = "http://localhost:3000/assignees.json";
      const res = await axios.get(url);
      const data = res.data;
      const filledAssignees = fillEmptyAssignees(data.assignees, data.perPage);
      setAssigneeData({ ...data, assignees: filledAssignees });
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
  

const onSearch = (newSearch) => {

};

const pageCount = Math.ceil(assigneeData.assigneeCount / assigneeData.perPage);
const offset = (assigneeData.currentPage - 1) * assigneeData.perPage;
const currentAssignees = showAssignees(assigneeData, offset);

  return (

    <div className="dashboard">  
    <CreateSidebarDept />
    <div className='container'>
      <CreateTopbar />
      
      <div className='main'>
        <h1 className='roleName'>SERVICE ROLE NAME</h1>
        <div className='description'>Service role description goes here.</div>
        <p>Department: <span className='bold' role='contentinfo'>DEPARTMENT</span></p>
        <p>Benchmark: <span className='bold' role='contentinfo'>67 hours/month</span></p>
        <div className='buttons'>
            <button role="button" id="edit">Edit Role</button>
            <button role='button' id="deactivate">Deactivate</button>
        </div>

        <h1 className='roleName'>Assignee's</h1>
        <button role='button'>Assign People</button>
        <p>Current Assignee's</p>
        <input type="text" placeholder="Search for people assigned to this role." onChange={e => onSearch(e.target.value)} />

        <table>
            <tbody>
            {currentAssignees.map(assignee => {
                return (
                  <tr key={assignee.instructorID}>
                    <td><Link to={`/DepartmentProfilePage?roleid=${(assignee.instructorID)}`}>{assignee.name}</Link></td>
                  </tr>
                );
              })}
            </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}

export default RoleInformation;