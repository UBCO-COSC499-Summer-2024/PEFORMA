import React, { useState, useEffect, useRef } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/DeptRoleInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';import { useAuth } from '../common/AuthContext.js';
import AssignInstructorsModal from '../InsAssignInstructorsModal.js';
import { fillEmptyItems } from '../common/utils.js';

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
  const [pastAssignees, setPastAssignees] = useState({
    past: [{}],
    assigneeCount: 0,
    perPage: 4,
    currentPage: 1
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
      if (!authToken) {
        navigate('/Login');
        return;
      }
      const numericAccountType = Number(accountLogInType);
      if (numericAccountType !== 1 && numericAccountType !== 2) {
        alert('No Access, Redirecting to instructor view');
        navigate('/Dashboard');
      }
      try {
        // Fetch role data
        const roleRes = await axios.get(`http://localhost:3001/api/roleInfo`, {
          params: { serviceRoleId: serviceRoleId },
          headers: { Authorization: `Bearer ${authToken.token}` },
        });
        const roleData = roleRes.data;
        roleData.perPage -=1;
        
        setRoleData((prevData) => ({ ...prevData, ...roleData }));
        setEditData({
          roleName: roleData.roleName,
          roleDescription: roleData.roleDescription,
          department: roleData.department,
        });
        setPastAssignees({...pastAssignees, past:roleData.assignees.filter((assignee) => assignee.year !== roleData.latestYear)});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authToken, accountLogInType, navigate, serviceRoleId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setShowDeactivate(true); // Show deactivate button when editing
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    setShowDeactivate(false); // Hide deactivate button after saving
    const updatedRoleData = { ...roleData, ...editData, isActive };
    setRoleData(updatedRoleData);
    console.log('Updated data:\n', JSON.stringify(updatedRoleData));
    // Here, you would send the updatedRoleData to your backend to save the changes
    try {
      const res = await axios.post('http://localhost:3001/api/updateRoleInfo', updatedRoleData, {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      console.log('Update successful', res.data);
    } catch (error) {
      console.error('Error updating role info', error);
    }
  };
  console.log(pastAssignees.past);
  const handleChange = (e) => {
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

  const handleSwitchChange = () => {
    setIsActive(!isActive);
  };

  const handlePageClick = (data) => {
   
    setRoleData((prevState) => ({
      ...prevState,
      currentPage: data.selected + 1,
    }));
  
  };

  const handlePastPageClick = (data) => {
   
    setPastAssignees((prevState) => ({
      ...prevState,
      currentPage: data.selected + 1,
    }));
  
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
      console.log("received:\n", professors);
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
  };

  const handleCloseInstructorModal = (save) => {
    if (!save) {
      if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
        setInstructorData(JSON.parse(prevInstructors.current));
      } else {
        return;
      }
    } else {
      roleData.assignees = [];
      console.log(roleData);
      for (let i = 0; i < instructorData.instructors.length; i++) {
        if (instructorData.instructors[i].assigned) {
          roleData.assignees.push({
            instructorID: instructorData.instructors[i].id,
            name: instructorData.instructors[i].name,
          });
        }
      }

      updateAssignees();
    }
    setShowInstructorModal(false);
  };

  const updateAssignees = async () => {
    let assignedInstructors = [];
    for (let i = 0; i < instructorData.instructors.length; i++) {
      if (instructorData.instructors[i].assigned === true) {
        assignedInstructors.push(instructorData.instructors[i].id);
      }
    }

    // Submitting new data goes here:
    console.log("Assigned profs are:\n", assignedInstructors, "\nAnd the assigned service Role Id is ", serviceRoleId);
    var div = 0;
    switch (roleData.department) {
      case "Computer Science": div = 1; break;
      case "Mathematics": div = 2; break;
      case "Physics": div = 3; break;
      case "Statistics": div = 4; break;
      default: div = 0;
    }
    const newAssigneeData = {
      profileId: assignedInstructors, // Assuming profileId corresponds to assignedInstructors
      serviceRole: roleData.roleName, // Assuming serviceRole corresponds to roleName
      year: new Date().getFullYear(), // Example: Current year
      division: div // Assuming division corresponds to department
    };

    console.log("Assigned profs are:", assignedInstructors, "\nAnd the assigned service Role Id is", serviceRoleId);

    for (let i = 0; i < assignedInstructors.length; i++) {
      var newAssigneeList = {
        profileId: assignedInstructors[i],
        serviceRole: roleData.roleName,
        year: new Date().getFullYear(),
        division: div
      };
      try {
        console.log("Assigning prof ", i, " in list, id ", newAssigneeList.profileId);
        const res = await axios.post('http://localhost:3001/api/assignInstructorServiceRole', newAssigneeList, {
          headers: { Authorization: `Bearer ${authToken.token}` },
        });
        console.log('Assignee update successful', res.data);
      } catch (error) {
        console.error('Error updating assignees', error);
      }
    }
    window.location.reload();
  };

  const onSearch = (newSearch) => {
    console.log('Searched:', newSearch);
    setSearch(newSearch);
    setRoleData((prevState) => ({ ...prevState, currentPage: 1 }));
  };

  const pageCount = Math.ceil(roleData.assigneeCount / roleData.perPage);
  const pastPageCount = Math.ceil(pastAssignees.past.length / pastAssignees.perPage);

  const filteredAssignees = roleData.assignees.filter(
    (assignee) =>
      (assignee.name?.toString().toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (assignee.instructorID?.toString().toLowerCase() ?? '').includes(search.toLowerCase())
  );

  const currentAssignees = filteredAssignees.slice(
    (roleData.currentPage - 1) * roleData.perPage,
    roleData.currentPage * roleData.perPage
  );

  const currentPastAssignees =  pastAssignees.past.slice(
    (pastAssignees.currentPage - 1) * pastAssignees.perPage,
    pastAssignees.currentPage * pastAssignees.perPage
  );

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
            {isEditing ? null : (
              <span style={{ marginLeft: '10px', color: isActive ? 'green' : 'red' }}>
                ({isActive ? 'Active' : 'De-active'})
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

          {showInstructorModal ? (
            <AssignInstructorsModal
              instructorData={instructorData}
              setInstructorData={setInstructorData}
              handleCloseInstructorModal={handleCloseInstructorModal}
            />
          ) : (
            <button
              type="button"
              data-testid="assign-button"
              className="assign-button"
              onClick={handleShowInstructorModal}
            >
              <span className="plus">+</span> Assign Professors (s)
            </button>
          )}
          <p>Current Assignee's ({roleData.latestYear})</p>
          <input
            type="text"
            id="search"
            placeholder="Search for people assigned to this role."
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="assigneeTable">
            <table>
              <tbody>
              <tr><th>Instructor</th><th>UBC ID</th></tr>
                {currentAssignees.map((assignee, index) => {


										if (assignee.instructorID == '' || assignee.instructorID == null) {
											return (
												<tr key={index}>
													<td></td><td></td>
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
											onPageChange={handlePageClick}
											containerClassName={'pagination'}
											activeClassName={'active'}
										/>
									</td>
								</tr>
							</tfoot>
            </table>
          </div>
          <p>Past Assignee's</p>
					<div className='assigneeTable'>
					<table>
							<tbody>
								<tr>
									<th>Instructor</th><th>UBC ID</th><th>Year of assignment</th>
								</tr>
								{currentPastAssignees.map((assignee, index) => {


										if (assignee.instructorID == '' || assignee.instructorID == null) {

										} else {
                      if (assignee.year !== roleData.latestYear) {
											return (
												<tr key={assignee.instructorID}>
													<td>
														<Link to={`/DeptProfilePage?ubcid=${assignee.instructorID}`}>
															{assignee.name}
														</Link>
													</td>
													<td>{assignee.instructorID}</td>
													<td>{assignee.year}</td>
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
											pageCount={pastPageCount}
											marginPagesDisplayed={3}
											pageRangeDisplayed={0}
											onPageChange={handlePastPageClick}
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