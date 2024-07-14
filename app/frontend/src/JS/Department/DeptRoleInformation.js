import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import AssignInstructorsModal from '../InsAssignInstructorsModal.js';
import { useAuth } from '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, currentItems, pageCount, checkAccess } from '../common/utils.js';

import '../../CSS/Department/DeptRoleInformation.css';

function RoleInformation() {
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate();

  const [roleData, setRoleData] = useState({
    assignees: [{}],
    assigneeCount: 0,
    perPage: 5,
    currentPage: 1,
    roleName: '',
    roleDescription: '',
    department: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    roleName: '',
    roleDescription: '',
    department: '',
  });

  const [search, setSearch] = useState('');
  const [instructorData, setInstructorData] = useState({
    instructors: [{}],
    instructorCount: 0,
    perPage: 8,
    currentPage: 1,
  });

  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const serviceRoleId = params.get('roleid');

  useEffect(() => {
    const fetchData = async () => {
      checkAccess(accountLogInType, navigate, 'department');
      try {
        const roleRes = await axios.get(`http://localhost:3001/api/roleInfo`, {
          params: { serviceRoleId },
          headers: { Authorization: `Bearer ${authToken.token}` },
        });
        const roleData = roleRes.data;
        setRoleData((prevData) => ({ ...prevData, ...roleData }));
        setEditData({
          roleName: roleData.roleName,
          roleDescription: roleData.roleDescription,
          department: roleData.department,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authToken, serviceRoleId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setShowDeactivate(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    setShowDeactivate(false);

    const updatedRoleData = { ...roleData, ...editData, isActive };
    setRoleData(updatedRoleData);

    try {
      await axios.post('http://localhost:3001/api/updateRoleInfo', updatedRoleData, {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      console.log('Update successful');
    } catch (error) {
      console.error('Error updating role info', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    adjustInputSize(e, name, value);
  };

  const adjustInputSize = (e, name, value) => {
    if (name === 'roleName') {
      e.target.style.width = `${Math.max(value.length + 1, 20)}ch`;
    } else if (name === 'roleDescription') {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleSwitchChange = () => {
    setIsActive(!isActive);
  };

  const prevInstructors = useRef({});

  const handleShowInstructorModal = async () => {
    prevInstructors.current = JSON.stringify(instructorData);
    setShowInstructorModal(true);

    try {
      const res = await axios.get('http://localhost:3001/api/instructors', {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      const professors = res.data.instructors;
      if (Array.isArray(professors)) {
        setInstructorData((prevData) => ({
          ...prevData,
          instructors: professors,
          instructorCount: professors.length,
        }));
      } else {
        throw new Error('Expected an array but got: ' + professors);
      }
    } catch (error) {
      console.error('Error fetching professors:', error);
      setInstructorData((prevData) => ({
        ...prevData,
        instructors: [],
        instructorCount: 0,
      }));
    }
  };

  const handleSaveAssignedInstructors = (assignedInstructors) => {
    const newAssignees = assignedInstructors.map(instr => ({
      instructorID: instr.id,
      name: instr.name
    }));
    setRoleData(prevData => ({
      ...prevData,
      assignees: newAssignees,
      assigneeCount: newAssignees.length
    }));
    updateAssignees(newAssignees);
  };

  const handleCloseInstructorModal = (save) => {
    if (!save && !window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
      return;
    }
    setShowInstructorModal(false);
  };

  const updateAssignees = async (newAssignees) => {
    const assignedInstructors = newAssignees.map(instr => instr.instructorID);
    console.log("Assigned profs are:", assignedInstructors, "And the assigned service Role Id is", serviceRoleId);

    const div = getDivision(roleData.department);

    for (const id of assignedInstructors) {
      const newAssigneeList = {
        profileId: id,
        serviceRole: roleData.roleName,
        year: new Date().getFullYear(),
        division: div,
      };

      try {
        await axios.post('http://localhost:3001/api/assignInstructorServiceRole', newAssigneeList, {
          headers: { Authorization: `Bearer ${authToken.token}` },
        });
      } catch (error) {
        console.error('Error updating assignees', error);
      }
    }
    window.location.reload();
  };

  const getDivision = (department) => {
    switch (department) {
      case "Computer Science": return 1;
      case "Mathematics": return 2;
      case "Physics": return 3;
      case "Statistics": return 4;
      default: return 0;
    }
  };

  const onSearch = (newSearch) => {
    setSearch(newSearch);
    setRoleData((prevState) => ({ ...prevState, currentPage: 1 }));
  };

  const filteredAssignees = roleData.assignees.filter(
    (assignee) =>
      (assignee.name?.toString().toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (assignee.instructorID?.toString().toLowerCase() ?? '').includes(search.toLowerCase())
  );

  const currentAssignees = currentItems(filteredAssignees, roleData.currentPage, roleData.perPage);
  
  return (
    <div className="dashboard">
      <CreateSideBar sideBarType="Department" />
      <div className="container">
        <CreateTopBar />
        <div className="ri-main">
          <h1 className="roleName">
            {isEditing ? (
              <input
                type="text"
                name="roleName"
                value={editData.roleName}
                onChange={handleChange}
                className="editable-input"
                style={{ minWidth: '200px', width: `${Math.max(editData.roleName.length + 1, 20)}ch`, height: 'auto' }}
              />
            ) : (
              roleData.roleName
            )}
          </h1>
          <div className="description" style={{ whiteSpace: isEditing ? 'pre-wrap' : '' }}>
            {isEditing ? (
              <textarea
                name="roleDescription"
                value={editData.roleDescription}
                onChange={handleChange}
                className="editable-textarea"
                style={{ minHeight: '80px', height: 'auto', overflow: 'hidden' }}
              />
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }}>{roleData.roleDescription}</p>
            )}
          </div>
          <p>
            Department:{' '}
            {isEditing ? (
              <select
                name="department"
                value={editData.department}
                onChange={handleChange}
                className="editable-select"
                style={{ height: 'auto' }}
              >
                <option value="Computer Science">Computer Science (COSC)</option>
                <option value="Mathematics">Mathematics (MATH)</option>
                <option value="Physics">Physics (PHYS)</option>
                <option value="Statistics">Statistics (STAT)</option>
              </select>
            ) : (
              <span className="bold" role="contentinfo">
                {roleData.department}
              </span>
            )}
          </p>
          <div className="buttons">
            {isEditing ? (
              <button role="button" onClick={handleSaveClick}>
                Save
              </button>
            ) : (
              <button role="button" id="edit" onClick={handleEditClick}>
                Edit Role
              </button>
            )}
            {showDeactivate && (
              <label className="switch">
                <input type="checkbox" checked={isActive} onChange={handleSwitchChange} />
                <span className="slider round"></span>
                {isActive ? 'Active' : 'De-active'}
              </label>
            )}
          </div>
          <h1 className="roleName">Assignee's</h1>
          <button
            type="button"
            data-testid="assign-button"
            className="assign-button"
            onClick={handleShowInstructorModal}
          >
            <span className="plus">+</span> Assign Professors (s)
          </button>
          <p>Current Assignee's</p>
          <input
            type="text"
            id="search"
            placeholder="Search for people assigned to this role."
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="assigneeTable">
            <table>
              <tbody>
                {currentAssignees.map((assignee, index) => (
                  <tr key={index}>
                    {assignee.instructorID ? (
                      <td>
                        <Link to={`/DeptProfilePage?ubcid=${assignee.instructorID}`}>
                          {assignee.name} ID:{assignee.instructorID}
                        </Link>
                      </td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <ReactPaginate
                      previousLabel={'<'}
                      nextLabel={'>'}
                      breakLabel={'...'}
                      pageCount={pageCount(roleData.assigneeCount, roleData.perPage)}
                      marginPagesDisplayed={3}
                      pageRangeDisplayed={0}
                      onPageChange={(data) => handlePageClick(data, setRoleData)}
                      containerClassName={'pagination'}
                      activeClassName={'active'}
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {showInstructorModal && (
            <AssignInstructorsModal
              instructorData={instructorData}
              setInstructorData={setInstructorData}
              handleCloseInstructorModal={handleCloseInstructorModal}
              handleSaveAssignedInstructors={handleSaveAssignedInstructors}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleInformation;
