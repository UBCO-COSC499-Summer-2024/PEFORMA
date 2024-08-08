import React, { useState, useEffect, useRef, useReducer } from 'react';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/DeptRoleInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import AssignInstructorsModal from '../InsAssignInstructorsModal.js';
import { getCurrentTerm, checkAccess, filterItems, currentItems, handlePageClick } from '../common/utils.js';

// Function for recieving role information and assignment data
const fetchRoleData = async(authToken, serviceRoleId) => {
  const roleRes = await axios.get(`http://localhost:3001/api/roleInfo`, {
    params: { serviceRoleId: serviceRoleId },
    headers: { Authorization: `Bearer ${authToken.token}` },
  });
  roleRes.data.perPage -= 1; // Page length is too long so this is to reduce it by 1
  return roleRes.data;
}

// Function for recieving the currently active term
const fetchTermResponse = async() => {
  const termResponse = await axios.get("http://localhost:3001/api/terms");
  return termResponse.data;
}

// Function for setting the time state of the page, i.e. if it's term is before the currently active term, set pastState to true,
// if it's after the currently active term, set futureState to true. If it's the same term, both remain false.
function setTimeState(actualTerm, selectedTerm, setPastState, setFutureState) {
  if (parseInt(actualTerm) > selectedTerm) {
    setPastState(true);
  } else if (parseInt(actualTerm) < selectedTerm) {
    setFutureState(true);
  }
}

// Function to be called when the user clicks the edit button
const handleEditClick = (setIsEditing, setShowDeactivate) => {
  setIsEditing(true); // Set edit state to true
  setShowDeactivate(true); // Show deactivate button when editing
};


function useRoleInformation() {
// Get role id from the URL
  const params = new URLSearchParams(window.location.search);
  const serviceRoleId = params.get('roleid');
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate(); // For navigating to different pages
  // State variables
  const [active, setActive] = useState(true);
  const prevInstructors = useRef({});
  const [roleData, setRoleData] = useState({
    assignees: [],
    assigneeCount: 0,
    perPage: 5,
    currentPage: 1,
    roleName: '',
    roleDescription: '',
    department: '',
    currentInstructors: [], // Add this line to store current instructor information
  });
  const [pastState, setPastState] = useState(false);
  const [futureState, setFutureState] = useState(false);
  const [termString, setTermString] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    roleName: '',
    roleDescription: '',
    department: '',
  });
  const [search, setSearch] = useState('');
  const [instructorData, setInstructorData] = useState({
    instructors: [],
    instructorCount: 0,
    perPage: 8,
    currentPage: 1,
  });
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [isActive, setIsActive] = useState(true);
  // For forcing the page to update
  const [, reactUpdate] = useReducer(i => i + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      checkAccess(accountLogInType, navigate, 'department', authToken);
      try {
        const roleData = await fetchRoleData(authToken, serviceRoleId);
        // roleData contains : {currentPage, perPage, roleID, assigneeCount, exists, roleName, roleDescription, department, assignees, latestYear, isActive}
	      // roleData.assignees is an array containing : {instructorID, name, year}
        
	      // Get actual current term
        const currentTerm = getCurrentTerm();
        // Get currently active term
        const termData = await fetchTermResponse();
        roleData.latestYear = termData.currentTerm.toString().slice(0, 4); // Set latestYear to proper value
        setTimeState(currentTerm, termData.currentTerm, setPastState, setFutureState);
        
        // Separate current and past instructors
        roleData.currentInstructors = roleData.assignees.filter((assignee) => assignee.year == roleData.latestYear); // Set assignees to only show ones for the selected term
        roleData.assignees = roleData.assignees.filter((assignee) => assignee.year != roleData.latestYear);
        
        setTermString(roleData.latestYear); // Set term string for currently active term to be displayed to the user
        setRoleData((prevData) => ({ ...prevData, ...roleData })); // Set role information
        setEditData({ // Set edit information to be equal to current role information
          roleName: roleData.roleName,
          roleDescription: roleData.roleDescription,
          department: roleData.department,
        });
        // For clarification, isActive is determined by the isActive column of the ServiceRole table. Active is determined
      	// by the presence of role assignments.
        setIsActive(roleData.isActive);
        // Set active state to false if role is inactive
        if (!roleData.exists) {
          setActive(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [authToken, accountLogInType, navigate, serviceRoleId]);

  return {
    roleData, setRoleData,
    pastState, setPastState,
    futureState, setFutureState,
    termString, setTermString,
    isEditing, setIsEditing,
    editData, setEditData,
    search, setSearch,
    instructorData, setInstructorData,
    showInstructorModal, setShowInstructorModal,
    showDeactivate, setShowDeactivate,
    isActive, setIsActive,
    reactUpdate,
    navigate,
    authToken,
    prevInstructors,
    serviceRoleId,
    active, setActive
  }
}

// Function to be called when the user clicks the save button. Sends a request to the backend to update that role's information
const handleSaveClick = async (setIsEditing, setShowDeactivate, roleData, setRoleData, editData, isActive, authToken) => {
  setIsEditing(false); // Set edit state to false
  setShowDeactivate(false); // Hide deactivate button after saving
  const updatedRoleData = { ...roleData, ...editData, isActive };
  setRoleData(updatedRoleData); // Set current role info to newly changed role info
  // Send new info the the backend
  try {
    await axios.post('http://localhost:3001/api/updateRoleInfo', updatedRoleData, {
      headers: { Authorization: `Bearer ${authToken.token}` },
    });
  } catch (error) {
    console.error('Error updating role info', error);
  }
};

// Function to be called when the user changes a value when editing.
const handleChange = (e, setEditData) => {
  const { name, value } = e.target;
  // Change edited data to reflect the new change
  setEditData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
  // Depending on the changed section, alter the styling of the edit boxes to match
  if (name === 'roleName') {
    e.target.style.width = (value.length + 1) * 8 + 'px';
  } else if (name === 'roleDescription') {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }
};

// Function to be called when the 'active' checkbox is changed.
const handleSwitchChange = (isActive, setIsActive) => {
  setIsActive(!isActive); // Sets isActive variable to the opposite boolean
};

// Function for recieving all instructors from the backend
const fetchInstructors = async(authToken, setInstructorData) => {
  try {
    // Get all instructors
    const res = await axios.get('http://localhost:3001/api/instructors', {
      headers: { Authorization: `Bearer ${authToken.token}` },
    });
    // res.data contains: {instructors, instructorCount, perPage, currentPage}
    const professors = res.data.instructors;
    // Handle different possible backend responses, if a good response is recieved, set the instructor list to the received data
    if (Array.isArray(professors)) {
      setInstructorData((prevData) => ({
        ...prevData,
        instructors: professors,
        instructorCount: professors.length,
      }));
    } else {
      setInstructorData((prevData) => ({
        ...prevData,
        instructors: [],
        instructorCount: 0,
      }));
      console.error('Expected an array but got:', professors);
    }
  } catch (error) {
    console.error('Error fetching professors:', error);
    setInstructorData((prevData) => ({
      ...prevData,
      instructors: [],
      instructorCount: 0,
    }));
  }
}

// Function to be called when the user clicks the assign instructors button
const handleShowInstructorModal = async (instructorData, setInstructorData, setShowInstructorModal, authToken, prevInstructors) => {
    // Save currently assigned instructors in the case of the user cancelling    
    prevInstructors.current = JSON.stringify(instructorData);
    // Show modal
    setShowInstructorModal(true);
    // fetch all instructors
    await fetchInstructors(authToken, setInstructorData);
};

// Function to be called when the user attempts to close the assign modal
// The parameters are formatted as [] so it can be used easily by the InsAssignInstructorsModal file
const handleCloseInstructorModal = (save, [instructorData, setInstructorData, roleData, setShowInstructorModal, prevInstructors, authToken]) => {
    // If cancel button was clicked, show a confirmation message
    if (!save) {
      if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
        // If yes, set currently assigned instructors back to the previously assigned ones
        setInstructorData(JSON.parse(prevInstructors.current));
      } else {
        // If no, return to the modal
        return;
      }
    } else {
      // If save was clicked, call the updateAssignees function, a helper function for updating the UI and sending a backend request
      updateAssignees(instructorData, roleData, authToken);
    }
    // Close the modal
    setShowInstructorModal(false);
};

// function for finding all currently assigned instructors
function getAssignedInstructors(instructorData, roleData) {
  // Create necessary variables
  let assignedInstructors = [];
  roleData.assignees = [];
  // For each instructor in the list, check if the assigned attribute is true. If it is, add that instructor to the assignedInstructors array and the roleData.assignees array
  for (let i = 0; i < instructorData.instructors.length; i++) {
    if (instructorData.instructors[i].assigned === true) {
      assignedInstructors.push(instructorData.instructors[i]);
      roleData.assignees.push({
        instructorID: instructorData.instructors[i].profileId,
        name: instructorData.instructors[i].name,
      });
    }
  }
  return assignedInstructors;
}

// Function for getting the Digit (1, 2, 3, or 4) associated with the department 
function getDivisionDigit(roleData) {
  let div = 0;
  switch (roleData.department) {
    case "Computer Science": div = 1; break;
    case "Mathematics": div = 2; break;
    case "Physics": div = 3; break;
    case "Statistics": div = 4; break;
    default: div = 0;
  }
  return div;
}

// Function to be called during the assigning process. Sends the newly assigned instructors to the backend to be added to the database
const sendAssignees = async(assignedInstructors, roleData, authToken, div) => {
  // For each newly assigned instructor send them to the backend to be assigned
  for (let i = 0; i < assignedInstructors.length; i++) {
   // Format data
    var newAssigneeList = {
      profileId: assignedInstructors[i].profileId,
      serviceRole: roleData.roleName,
      year: roleData.latestYear,
      division: div
    };
    try {
      await axios.post('http://localhost:3001/api/assignInstructorServiceRole', newAssigneeList, {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
    } catch (error) {
      console.error('Error updating assignees', error);
    }
  }
}

// Helper function for updating the currently assigned instructors
const updateAssignees = async (instructorData, roleData, authToken) => {
  // Get assigned instructors, the division digit, then send them to the backend
  let assignedInstructors = getAssignedInstructors(instructorData, roleData);
  let div = getDivisionDigit(roleData);
  await sendAssignees(assignedInstructors, roleData, authToken, div);
  window.location.reload(); // Reload the page so the changes are reflected
};

// Function to be called when the user enters a search query for the table
const onSearch = (newSearch, setSearch, setRoleData) => {
    // Set search to newly entered string
    setSearch(newSearch);
    // Set currently selected page to 1
    setRoleData((prevState) => ({ ...prevState, currentPage: 1 }));
};

// Function to be called when the user clicks the 'x' button next to a currently assigned instructor
function removeInstructorFromRoleData(roleData, instructorData, index, id, reactUpdate) {
// Remove the instructor at the index that the user clicked
  roleData.currentInstructors.splice(index, 1);
  // For each instructor in the instructors list, check if their id matches the one of the removed instructor. If it does, set that instructor's assign attribute to false
  for (let i = 0; i < instructorData.instructors.length; i++) {
    if (id === instructorData.instructors[i].id) {
      instructorData.instructors[i].assigned = false;
      break;
    }
  }
  reactUpdate(); // Force the page to update
}

// Function for sending a newly un-assigned instructor to the backend to be reflected in the database
const sendRemovedInstructor = async(serviceRoleId, id, authToken) => {
  try {
    await axios.post('http://localhost:3001/api/removeInstructorRole', {serviceRoleId, id}, {
      headers: { Authorization: `Bearer ${authToken.token}` },
    });
  } catch (error) {
    window.alert("Delete error:\n",error.message);
  }
}

// Helper function for removing an instructor. Called when the user clicks the 'x' next to an assigned instructor's name
const removeInstructor = async (id, index, roleData, instructorData, authToken, reactUpdate, serviceRoleId) => {
    // Removes the instructor from the UI, then sends a backend request to unassign them in the database 
    removeInstructorFromRoleData(roleData, instructorData, index, id, reactUpdate);
    await sendRemovedInstructor(serviceRoleId, id, authToken);
}

function RoleInformation() {
  // Get necessary variables
  const {
      roleData, setRoleData,
      pastState, setPastState,
      futureState, setFutureState,
      termString, setTermString,
      isEditing, setIsEditing,
      editData, setEditData,
      search, setSearch,
      instructorData, setInstructorData,
      showInstructorModal, setShowInstructorModal,
      showDeactivate, setShowDeactivate,
      isActive, setIsActive,
      reactUpdate,
      navigate,
      authToken,
      prevInstructors,
      serviceRoleId,
      active, setActive
  } = useRoleInformation();

  const pageCount = Math.ceil(roleData.assigneeCount / roleData.perPage);
  const filteredAssignees = filterItems(roleData.assignees, 'assignee', search);
  const currentAssignees = currentItems(filteredAssignees, roleData.currentPage, roleData.perPage);
  // Variables to be used with the assign modal, used when calling handleCloseInstructorModal
  const closeModalVars = [instructorData, setInstructorData, roleData, setShowInstructorModal, prevInstructors, authToken];
  
  return (
    <div className="dashboard">
      <SideBar sideBarType="Department" />
      <div className="container">
        <TopBar />
        <div className="ri-main" data-testid="ri-main">
          <button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>

          <h1 className="roleName">
            {isEditing ? (
              <input
                type="text"
                name="roleName"
                data-testid="roleName"
                value={editData.roleName}
                onChange={(e)=>handleChange(e, setEditData)}
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
                data-testid="roleDescription"
                value={editData.roleDescription}
                onChange={(e)=>handleChange(e, setEditData)}
                className="editable-textarea"
                style={{ minHeight: '80px', height: 'auto', overflow: 'hidden' }}
              />
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }}>{roleData.roleDescription}</p>
            )}
          </div>
          <p>
            Department: 
            {isEditing ? (
              <select
                data-testid="department"
                name="department"
                value={editData.department}
                onChange={(e)=>handleChange(e, setEditData)}
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
            {isEditing ? null : (
              <span style={{ marginLeft: '10px', color: isActive ? 'green' : 'red' }}>
                ({isActive ? 'Active' : 'De-active'})
              </span>
            )}
          </p>
          <div className="buttons">
            {isEditing ? (
              <button role="button" data-testid="save" onClick={()=>handleSaveClick(setIsEditing, setShowDeactivate, roleData, setRoleData, editData, isActive, authToken)}>
                Save
              </button>
            ) : (
              <button role="button" id="edit" data-testid="edit" onClick={()=>handleEditClick(setIsEditing, setShowDeactivate)}>
                Edit Role
              </button>
            )}
            {showDeactivate && (
              <label className="switch">
                <input type="checkbox" checked={isActive} onChange={()=>handleSwitchChange(isActive, setIsActive)} />
                <span className="slider round"></span>
                {isActive ? 'Active' : 'De-active'}
              </label>
            )}
            {(!pastState && active) && (
              <button
                type="button"
                data-testid="assign-button"
                className="assign-button"
                onClick={()=>handleShowInstructorModal(instructorData, setInstructorData, setShowInstructorModal, authToken, prevInstructors)}
              >
                <span className="plus">+</span> Assign Instructor(s)
              </button>
            )}
            {!active && (
              <button className='assign-button inactive'>
                <span>Assign Unavailable</span>
              </button>
            )}
          </div>
          <div className="current-instructors">
            <p>Current Instructors: </p>
            {roleData.currentInstructors.length === 0 && (
              <strong>N/A</strong>
            )}
            {roleData.currentInstructors.length !== 0 && (
              roleData.currentInstructors.map((instructor, index) => {
                return (
                  <div key={instructor.instructorID}>
                    - <Link to={`/DeptProfilePage?ubcid=${instructor.instructorID}`}><strong>{instructor.name}</strong></Link>
                    <button type="button" className='remove-instructor' onClick={(e) => { removeInstructor(instructor.instructorID, index, roleData, instructorData, authToken, reactUpdate, serviceRoleId) }}>X</button>
                  </div>
                );
              })
            )}
          </div>
          <div id="history">
            <p className="bold">Instructor History</p>
            <input
              type="text"
              id="search"
              placeholder="Search for past instructors."
              onChange={(e) => onSearch(e.target.value, setSearch, setRoleData)}
            />
            <div className="assigneeTable">
              <table>
                <thead>
                  <tr><th>Instructor</th><th>UBC ID</th><th>Year</th></tr>
                </thead>
                <tbody>
                  {currentAssignees.length === 0 && (
                    <tr><td colSpan={3}>There are no past instructors for this role.</td></tr>
                  )}
                  {currentAssignees.map((assignee, index) => (
                    <tr key={assignee.instructorID}>
                      <td>
                        <Link to={`/DeptProfilePage?ubcid=${assignee.instructorID}`}>
                          {assignee.name}
                        </Link>
                      </td>
                      <td>{assignee.instructorID}</td>
                      <td>{assignee.year}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3">
                      <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        pageCount={pageCount}
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
          </div>
        </div>
      </div>
      {showInstructorModal && (
        <AssignInstructorsModal
          instructorData={instructorData}
          setInstructorData={setInstructorData}
          handleCloseInstructorModal={handleCloseInstructorModal}
          closeModalVars={closeModalVars}
        />
      )}
    </div>
  );
}

export default RoleInformation;
