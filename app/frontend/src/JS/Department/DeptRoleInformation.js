import React, { useState, useEffect, useRef, useReducer } from 'react';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/DeptRoleInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';import { useAuth } from '../common/AuthContext.js';
import AssignInstructorsModal from '../InsAssignInstructorsModal.js';
import { getCurrentTerm, checkAccess, filterItems, currentItems, handlePageClick } from '../common/utils.js';

const fetchRoleData = async(authToken, serviceRoleId) => {
  const roleRes = await axios.get(`http://localhost:3001/api/roleInfo`, {
    params: { serviceRoleId: serviceRoleId },
    headers: { Authorization: `Bearer ${authToken.token}` },
  });
  roleRes.data.perPage -=1; // Page length is too long so this is to reduce it by 1
  return roleRes.data;
}

const fetchTermResponse = async() => {
  const termResponse = await axios.get("http://localhost:3001/api/terms");
  return termResponse.data;
}

function setTimeState(actualTerm, selectedTerm, setPastState, setFutureState) {
  if (parseInt(actualTerm) > selectedTerm) {
    setPastState(true);

  } else if (parseInt(actualTerm) < selectedTerm) {
    setFutureState(true);
  }
}

const handleEditClick = (setIsEditing, setShowDeactivate) => {
  setIsEditing(true);
  setShowDeactivate(true); // Show deactivate button when editing
};

function useRoleInformation() {
  const params = new URLSearchParams(window.location.search);
  const serviceRoleId = params.get('roleid');
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState(true);
  const prevInstructors = useRef({});
  const [roleData, setRoleData] = useState({
    assignees: [{}],
    assigneeCount: 0,
    perPage: 5,
    currentPage: 1,
    roleName: '',
    roleDescription: '',
    department: '',
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
    instructors: [{}],
    instructorCount: 0,
    perPage: 8,
    currentPage: 1,
  });
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [, reactUpdate] = useReducer(i => i + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      checkAccess(accountLogInType, navigate, 'department', authToken);
      try {
        const roleData = await fetchRoleData(authToken, serviceRoleId);
        const currentTerm = getCurrentTerm();
        
        const termData = await fetchTermResponse();
        roleData.latestYear = termData.currentTerm.toString().slice(0,4); // Set latestYear to proper value
        setTimeState(currentTerm, termData.currentTerm, setPastState, setFutureState);
        
        roleData.assignees = roleData.assignees.filter((assignee) => assignee.year == roleData.latestYear); // Set assignees to only show ones for the selected term
        setTermString(roleData.latestYear);
        setRoleData((prevData) => ({ ...prevData, ...roleData }));
        setEditData({
          roleName: roleData.roleName,
          roleDescription: roleData.roleDescription,
          department: roleData.department,
        });
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

const handleSaveClick = async (setIsEditing, setShowDeactivate, roleData, setRoleData, editData, isActive, authToken) => {
  setIsEditing(false);
  setShowDeactivate(false); // Hide deactivate button after saving
  const updatedRoleData = { ...roleData, ...editData, isActive };
  setRoleData(updatedRoleData);
  try {
    await axios.post('http://localhost:3001/api/updateRoleInfo', updatedRoleData, {
      headers: { Authorization: `Bearer ${authToken.token}` },
    });
  } catch (error) {
    console.error('Error updating role info', error);
  }
};

const handleChange = (e, setEditData) => {
  const { name, value } = e.target;
  setEditData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
  if (name === 'roleName') {
    e.target.style.width = (value.length + 1) * 8 + 'px';
  } else if (name === 'roleDescription') {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }
};

const handleSwitchChange = (isActive, setIsActive) => {
  setIsActive(!isActive);
};

const fetchInstructors = async(authToken, setInstructorData) => {
  try {
    const res = await axios.get('http://localhost:3001/api/instructors', {
      headers: { Authorization: `Bearer ${authToken.token}` },
    });
    const professors = res.data.instructors;
    // Handle different possible backend responses
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

const handleShowInstructorModal = async (instructorData, setInstructorData, setShowInstructorModal, authToken, prevInstructors) => {
    prevInstructors.current = JSON.stringify(instructorData);
    setShowInstructorModal(true);
    await fetchInstructors(authToken, setInstructorData);
};

const handleCloseInstructorModal = (save, [instructorData, setInstructorData, roleData, setShowInstructorModal, prevInstructors, authToken]) => {
    if (!save) {
      if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
        setInstructorData(JSON.parse(prevInstructors.current));
      } else {
        return;
      }
    } else {
      updateAssignees(instructorData, roleData, authToken);
    }
    setShowInstructorModal(false);
};

function getAssignedInstructors(instructorData, roleData) {
  let assignedInstructors = [];
  roleData.assignees = [];
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

const sendAssignees = async(assignedInstructors, roleData, authToken, div) => {
  for (let i = 0; i < assignedInstructors.length; i++) {
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

const updateAssignees = async (instructorData, roleData, authToken) => {
  let assignedInstructors = getAssignedInstructors(instructorData, roleData);
  let div = getDivisionDigit(roleData);
  await sendAssignees(assignedInstructors, roleData, authToken, div);
  window.location.reload();
};

const onSearch = (newSearch, setSearch, setRoleData) => {
    setSearch(newSearch);
    setRoleData((prevState) => ({ ...prevState, currentPage: 1 }));
};

function removeInstructorFromRoleData(roleData, instructorData, index, id, reactUpdate) {
  roleData.assignees.splice(index, 1);
  for (let i = 0; i < instructorData.instructors.length; i++) {
    if (id === instructorData.instructors[i].id) {
      instructorData.instructors[i].assigned = false;
      break;
    }
  }
  reactUpdate();
}

const sendRemovedInstructor = async(serviceRoleId, id, authToken) => {
  try {
    await axios.post('http://localhost:3001/api/removeInstructorRole', {serviceRoleId, id}, {
      headers: { Authorization: `Bearer ${authToken.token}` },
    });
  } catch (error) {
    window.alert("Delete error:\n",error.message);
  }
}

const removeInstructor = async (id, index, roleData, instructorData, authToken, reactUpdate, serviceRoleId) => {
    removeInstructorFromRoleData(roleData, instructorData, index, id, reactUpdate);
    await sendRemovedInstructor(serviceRoleId, id, authToken);
}

function RoleInformation() {
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
            Department:{' '}
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
          </div>
            {(!pastState && active) && (
              <>
            {showInstructorModal ? (
              <AssignInstructorsModal
                instructorData={instructorData}
                setInstructorData={setInstructorData}
                handleCloseInstructorModal={handleCloseInstructorModal}
                closeModalVars={closeModalVars}
              />
            ) : (
            <button
              type="button"
              data-testid="assign-button"
              className="assign-button"
              onClick={()=>handleShowInstructorModal(instructorData, setInstructorData, setShowInstructorModal, authToken, prevInstructors)}
            >
              <span className="plus">+</span> Assign Instructor(s)
            </button>
          )}
              </>
              
            )}
            {!active && (
                  <button className='assign-button inactive'>
                    <span>Role inactive</span>
                  </button>
                )}
          {pastState || futureState ? (
            <p>Assignees for {termString}</p>
          ) : (
            <p>Current Assignees ({termString})</p>
          )}
          <input
            type="text"
            id="search"
            placeholder="Search for people assigned to this role."
            onChange={(e) => onSearch(e.target.value, setSearch, setRoleData)}
          />
          <div className="assigneeTable">
            <table>
              <tbody>
              <tr><th>Instructor</th><th>UBC ID</th></tr>
              {currentAssignees.length === 0 && (
                <tr><td colSpan={3}>There are no assigned instructors for this year</td></tr>
              )}
                {currentAssignees.map((assignee, index) => {
										if (assignee.instructorID == '' || assignee.instructorID == null) {
											return (
												<tr key={index}>
													<td colSpan={3}>There are no currently assigned instructors.</td>
												</tr>
											);
										} else {
                      if (assignee.year == roleData.latestYear) {
											return (
												<tr key={assignee.instructorID}>
													<td>
														<Link to={`/DeptProfilePage?ubcid=${assignee.instructorID}`}>
															{assignee.name}
														</Link>
                            {!pastState && (
                              <button type="button" className='remove-instructor' onClick={(e) => { removeInstructor(assignee.instructorID, index, roleData, instructorData, authToken, reactUpdate, serviceRoleId) }}>X</button>
                            )}
													</td>
													<td>{assignee.instructorID}</td>
												</tr>
											);
										}
                  }
								})}
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
											onPageChange={(data)=>handlePageClick(data, setRoleData)}
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