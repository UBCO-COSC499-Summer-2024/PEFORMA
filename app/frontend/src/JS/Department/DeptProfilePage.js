import React, { useState, useEffect, useRef, useReducer } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import WorkHoursBarChart from './../Instructor/InsPerformanceImports/InsWorkHoursBarChart.js'
import '../../CSS/Department/DeptProfilePage.css';
import AssignCoursesModal from '../DeptAssignCoursesModal.js';
import AssignRolesModal from '../DeptAssignRolesModal.js';
import { fillEmptyItems, checkAccess } from '../common/utils.js';

function useDeptProfilePage() {
    const navigate = useNavigate(); // For navigating to different pages
    // Get ubcid from the URL
    const params = new URLSearchParams(window.location.search);
    const ubcid = params.get('ubcid');
    const { authToken, accountLogInType } = useAuth();
    // Variables containing original role and course assignments, in the case of the user clicking cancel on any form
    const prevRoles = useRef({});
    const prevCourses = useRef({});
    // For forcing the page to update
    const [, reactUpdate] = useReducer(i => i + 1, 0);
    // State variables
    const initProfile = { roles: [], teachingAssignments: [], name:"N/A", ubcid:ubcid, benchmark:"N/A", phoneNum:"N/A", email:"N/A", office:"N/A" };
    const [profile, setProfile] = useState(initProfile);
    const [editState, setEditState] = useState(false);
    const [benchmark, setBenchmark] = useState(0);
    const [courseData, setCourseData] = useState({
        courses: [{}],
        courseCount: 0,
        perPage: 8,
        currentPage: 1,
    });
    const [roleData, setRoleData] = useState({
        roles: [{}],
        roleCount: 0,
        perPage: 8,
        currentPage: 1,
    });
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [showRolesModal, setShowRolesModal] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showCoursesModal, setShowCoursesModal] = useState(false);
  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
        try {
            checkAccess(accountLogInType, navigate, 'department', authToken);
            let profileData = await fetchProfileData(authToken, ubcid, setProfile, setBenchmark);
            // profileData contains : {profileId, name, email, ubcid, benchmark, office, phoneNum, roles, teachingAssignments}
            // profileData.roles is an array of : {roleTitle, roleid}
            // teachingAssignments is an array of {courseid, assign}
            // Set up Course assignments
            let allCourses = await fetchAllCourses(authToken);
            formatCourses(allCourses, profileData, setSelectedCourses, setCourseData);
            // Set up Role assignments
            let allRoles = await fetchAllRoles(authToken);
            formatRoles(allRoles, profileData, setSelectedRoles, setRoleData);
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
}, [authToken, ubcid, navigate, accountLogInType]);

return {
    navigate,
    ubcid,
    authToken,
    profile, setProfile,
    editState, setEditState,
    benchmark, setBenchmark,
    reactUpdate,
    courseData, setCourseData,
    roleData, setRoleData,
    selectedRoles, setSelectedRoles,
    showRolesModal, setShowRolesModal,
    selectedCourses, setSelectedCourses,
    showCoursesModal, setShowCoursesModal,
    prevRoles, prevCourses
}
}

// Function for getting and formatting assigned courses
function formatCourses(allCourses, profileData, setSelectedCourses, setCourseData) {
    // Format all courses list
    allCourses.courses = formatListData(allCourses.courses, profileData.teachingAssignments)
    // set selected courses to all courses that have assigned=true
    setSelectedCourses(allCourses.courses.filter((course) => course.assigned));
    // Show only active courses for course modal
    const filledCourses = fillEmptyItems(allCourses.courses.filter((course) => course.status), allCourses.perPage);
    setCourseData({...allCourses, courseCount: filledCourses.length, courses: filledCourses});
    return;
}

// Function for getting and formatting assigned roles
function formatRoles(allRoles, profileData, setSelectedRoles, setRoleData) {
    // Format all roles list
    allRoles.roles = formatListData(allRoles.roles, profileData.roles);
    // set selected roles to all courses that have assigned=true
    setSelectedRoles(allRoles.roles.filter((role) => role.assigned));
    // Show only active roles for role modal
    const filledRoles = fillEmptyItems(allRoles.roles.filter((role) => role.status), allRoles.perPage);
    setRoleData({...allRoles, roleCount: filledRoles.length, roles: filledRoles});
    return;
}

// function for fetching all roles
const fetchAllRoles = async(authToken) => {
    const rolesResponse = await axios.get(`http://localhost:3001/api/service-roles`, {
        headers: { Authorization: `Bearer ${authToken.token}` },
    });
    rolesResponse.data.perPage = 8; // Set amount of roles to be displayed per page in modal to 8
    return rolesResponse.data;
}

// Function for handling any null profile data and setting it to N/A
function handleNullData(data) {
    if (data.benchmark === null) {
        data.benchmark = "N/A";
    }
    if (data.phoneNum === "" || data.phoneNum === null) {
        data.phoneNum = "N/A";
    }
    if (data.office === null+" "+null || data.office === null) {
        data.office = "N/A";
    }
    return data;
}

// Function for properly formatting list of roles or courses to work with this page. Mainly by setting an 'assigned' attribute
// to true if that item in the role or course list exists within the assignItems list
function formatListData(list, assignedItems) {
    // Set all list items assigned value to false
    for (let i = 0; i < list.length; i++) {
        list[i].assigned = false;
        list[i].originallyAssigned = false;
    }
    
    // If list of assigned people matches element in list of all people, set them to assigned
    for (let i = 0; i < assignedItems.length; i++) {
        for (let j = 0; j < list.length; j++) {
            if (list[j].id === assignedItems[i].courseid || list[j].id === assignedItems[i].roleid) {
                list[j].assigned = true;
                list[j].originallyAssigned = true;
            }
        }
    }
    return list;
}

// Function for requesting profile info from backend
const fetchProfileData = async(authToken, ubcid, setProfile, setBenchmark) => {
    const profileResponse = await axios.get(`http://localhost:3001/api/instructorProfile`, {
        params: { ubcid: ubcid },
        headers: { Authorization: `Bearer ${authToken.token}` },
    });
    let profileData = handleNullData(profileResponse.data);
    // If profileData exists, set corresponding state variables to the recieved data
    if (profileData) {
        setProfile(profileData);
        setBenchmark(profileData.benchmark);
    }
    return profileData;
}

// Function for requesting all courses from the backend
const fetchAllCourses = async(authToken) => {
    const coursesResponse = await axios.get(`http://localhost:3001/api/all-courses`, {
        headers: { Authorization: `Bearer ${authToken.token}` },
    });
    coursesResponse.data.perPage = 8; // Set amount of courses to be displayed per page in modal to 8
    return coursesResponse.data;
}

// Function to be called when saving an edited profile. Sends a request to the backend to update the user's benchmark
const updateBenchmark = async(authToken, ubcid, benchmark, profile) => {
    await axios.put('http://localhost:3001/api/dept-profile/benchmark', {
        ubcId: ubcid,
        benchmark: benchmark
    }, {
        headers: { Authorization: `Bearer ${authToken.token}` },
    });
    // Set current benchmark to newly changed benchmark
    profile.benchmark = benchmark;
}

// Function for sending newly assigned roles to the backend to be updated
const sendRoles = async(ubcid, roleChanges, authToken) => {
    await axios.put('http://localhost:3001/api/dept-profile/service-roles', {
        ubcId: ubcid,
        serviceRoles: roleChanges
    }, {
        headers: { Authorization: `Bearer ${authToken.token}` },
    });
}

// Helper function called when the user assigns new roles to this profile
const updateRoles = async(roleData, ubcid, authToken, setRoleData, setSelectedRoles) => {
    const roleChanges = roleData.roles
    // Get list of newly assigned roles
    .filter(role => role.assigned !== role.originallyAssigned)
    .map(role => ({
        serviceRoleId: role.id,
        year: new Date().getFullYear(),
        action: role.assigned ? 'add' : 'remove'
    }));
    // Submit roles to database
    await sendRoles(ubcid, roleChanges, authToken);
    // Update page to show newly assigned roles
    setRoleData(prevData => ({
        ...prevData,
        roles: prevData.roles.map(role => ({ ...role, originallyAssigned: role.assigned }))
    }));
    // Set current role assignment list to be equal to all assigned roles
    setSelectedRoles(roleData.roles.filter(role => role.assigned));
}

// Function for sending newly assigned courses to the backend to be updated.
const sendCourses = async(ubcid, authToken, courseChanges) => {
    await axios.put('http://localhost:3001/api/dept-profile/course-assignments', {
        ubcId: ubcid,
        courses: courseChanges
    }, {
        headers: { Authorization: `Bearer ${authToken.token}` },
    });
}

// Helper function called when the user assigns new roles to this profile
const updateCourses = async(courseData, ubcid, authToken, setCourseData, setSelectedCourses) => {
    const courseChanges = courseData.courses
    // Get list of newly assigned courses
    .filter(course => course.assigned !== course.originallyAssigned)
    .map(course => ({
        courseId: course.id,
        term: course.term,
        action: course.assigned ? 'add' : 'remove'
    }));
    // Submit courses to database
    await sendCourses(ubcid, authToken, courseChanges);
    // Update page to show newly assigned courses
    setCourseData(prevData => ({
        ...prevData,
        courses: prevData.courses.map(course => ({ ...course, originallyAssigned: course.assigned }))
    }));
    // Set current course assignment list to be equal to all assigned courses
    setSelectedCourses(courseData.courses.filter(course => course.assigned));
}

// Function to be called upon clicking the save button when editing a profile.
const submitChanges = async(event, authToken, ubcid, benchmark, profile, roleData, setRoleData, setSelectedRoles, courseData, setCourseData, setSelectedCourses, setEditState) => {
    event.preventDefault();
    // Ask the user to confirm their changes
    if(window.confirm("Confirm changes?")) {
        // If yes:
        try {
            // Update all profile details
            await updateBenchmark(authToken, ubcid, benchmark, profile);
            await updateRoles(roleData, ubcid, authToken, setRoleData, setSelectedRoles);
            await updateCourses(courseData, ubcid, authToken, setCourseData, setSelectedCourses);
            // Set editing state to false
            setEditState(false);
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
            alert('Failed to update profile. Please check the console for more details.');
        }
    }
}

// Function to be called when the user clicks the edit profile button
const handleEditState = (edit, setEditState, prevRoles, prevCourses, selectedRoles, selectedCourses) => {
    if (edit) {
        // If edit button was clicked, set edit state to true
        setEditState(true);
        // Save previously assigned roles and courses so it can easily be reset if the user cancels.
        prevRoles.current = JSON.stringify(selectedRoles);
        prevCourses.current = JSON.stringify(selectedCourses); 
    }
}

// Function to be called when the user clicks the cancel button when editing
const cancelChanges = (profile, setBenchmark, setEditState, setRoleData, setSelectedRoles, setSelectedCourses, setCourseData, prevRoles, prevCourses) => {
    // Set everything back to it's original state if the user clicks confirm
    if(window.confirm("Cancel changes?")) {
        setBenchmark(profile.benchmark); // Set benchmark back
        setEditState(false); // Set edit state to false
        // Revert role assignemnts back to their original state
        setRoleData(prevData => ({
            ...prevData,
            roles: prevData.roles.map(role => ({ ...role, assigned: role.originallyAssigned }))
        }));
        setSelectedRoles(JSON.parse(prevRoles.current)); // Set selected role assignments back to its original state
        setSelectedCourses(JSON.parse(prevCourses.current)); // Set selected course assignments back to its original state
        // Set assigned courses back to it's original state
        setCourseData(prevData => ({
            ...prevData,
            courses: prevData.courses.map(course => ({ ...course, assigned: course.originallyAssigned }))
        }));
    }
}

// Function to be called when the user clicks 'assign courses'
const handleShowCoursesModal = (setShowCoursesModal) => {
    setShowCoursesModal(true); // Display courses modal
};

// Function to be called when the user clicks 'assign roles'
const handleShowRolesModal = (setShowRolesModal) => {
    setShowRolesModal(true); // Display roles modal
};

// Function to be called when the user closes the course modal
const handleCloseCoursesModal = (save, [setCourseData, setSelectedCourses, courseData, setShowCoursesModal]) => {
    // If they clicked cancel, show a confirmation message
    if (!save) {
        if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
            // If yes, set the assigned courses back to their original state
            setCourseData(prevData => ({
                ...prevData,
                courses: prevData.courses.map(course => ({ ...course, assigned: course.originallyAssigned }))
            }));
        } else {
            // If no, return to the modal
            return;
        }
    } else {
        // If they clicked save, set the newly assigned courses
        setSelectedCourses(courseData.courses.filter((course) => course.assigned));
    }
    // Put the course modal back to page 1
    setCourseData(prevData => ({...prevData, currentPage: 1}));
    // Close the modal
    setShowCoursesModal(false);
};

// Function to be called when the user closes the role modal
const handleCloseRolesModal = (save, [setRoleData, setSelectedRoles, roleData, setShowRolesModal]) => {
    if (!save) {
        // If they clicked cancel, show a confirmation message
        if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
            // If yes, set the assigned roles back to their original state
            setRoleData(prevData => ({
                ...prevData,
                roles: prevData.roles.map(role => ({ ...role, assigned: role.originallyAssigned }))
            }));
        } else {
            // If no, return to the modal
            return;
        }
    } else {
        // If they clicked save, set the newly assigned roles
        setSelectedRoles(roleData.roles.filter((role) => role.assigned));
    }
    // Put the role modal back to page 1
    setRoleData(prevData => ({...prevData, currentPage: 1}));
    // Close the modal
    setShowRolesModal(false);
};

// Function to be called when the user clicks an 'x' button next to a course or role assignment.
// Unassigns that course or role
const unassign = async (id, index, type, selectedCourses, courseData, selectedRoles, roleData, reactUpdate) => {
    let dataList;
    // Depending on the item type, remove selected item from it's coresponding list 
    if (type === "course") {
        selectedCourses.splice(index, 1);
        dataList = courseData.courses;
    } else {
        selectedRoles.splice(index, 1);
        dataList = roleData.roles;
    }
    // Find the id of the removed item from list of data and remove it
    for (let i = 0; i < dataList.length; i++) {
        if (id === dataList[i].id) {
          dataList[i].assigned = false;
          break;
        }
      }
      // Depending on item type, set displayed list to the newly created list
      if (type === "course") {
        courseData.courses = dataList;
      } else {
        roleData.roles = dataList;
      }
    // Force the page to update
      reactUpdate();
}

function DeptProfilePage() {
    // Get variables
    const {
        navigate,
        ubcid,
        authToken,
        profile, setProfile,
        editState, setEditState,
        benchmark, setBenchmark,
        reactUpdate,
        courseData, setCourseData,
        roleData, setRoleData,
        selectedRoles, setSelectedRoles,
        showRolesModal, setShowRolesModal,
        selectedCourses, setSelectedCourses,
        showCoursesModal, setShowCoursesModal,
        prevRoles, prevCourses
    } = useDeptProfilePage();
    
    // Variable lists for use with the modals
    const closeCourseModalVars = [setCourseData, setSelectedCourses, courseData, setShowCoursesModal];
    const closeRoleModalVars = [setRoleData, setSelectedRoles, roleData, setShowRolesModal];

    return (
        <div className="deptProfile-container">
            <SideBar sideBarType="Department" />
            <div className="container" data-testid="main-container">
                <TopBar />
                <div className='outside'>
                    {!editState ? (
                        <button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
                    ) : (
                        <div className='space'></div>
                    )}
                    <h1>
                        {editState && (
                            <span>Edit </span>
                        )}
                        {profile.name}'s Profile
                    </h1>
                </div>
                <div className="main-content" id="text-content"> 
                    <section className="information">
                        {!editState ? (
                            <button className='edit-button' data-testid="edit-button" onClick={() => handleEditState(true, setEditState, prevRoles, prevCourses, selectedRoles, selectedCourses)}>Edit Profile</button>
                        ) : (
                            <>
                                <button className='save-button' data-testid="save-button" onClick={(e)=>submitChanges(e, authToken, ubcid, benchmark, profile, roleData, setRoleData, setSelectedRoles, courseData, setCourseData, setSelectedCourses, setEditState)}>Save Changes</button>
                                <button className='cancel-button' data-testid="cancel-button" onClick={() => cancelChanges(profile, setBenchmark, setEditState, setRoleData, setSelectedRoles, setSelectedCourses, setCourseData, prevRoles, prevCourses)}>Cancel Changes</button>
                            </>
                        )}
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>UBC ID:</strong> {profile.ubcid}</p>
                        <p data-testid="selected-roles">
                            <strong>Service Role Assignments: </strong> 
                            {selectedRoles.length === 0 && (
                                <span>N/A</span>
                            )}
                            {selectedRoles.map((role, index) => (
                                <div key={role.id}>
                                    {!editState ? (
                                        <Link to={`/DeptRoleInformation?roleid=${role.id}`}>- {role.name}</Link>
                                    ) : (
                                        <span>- {role.name}</span>
                                    )}
                                    {editState && (
                                        <button type="button" className='remove-instructor' onClick={(e) => { unassign(role.id, index, "role", selectedCourses, courseData, selectedRoles, roleData, reactUpdate) }}>X</button>
                                    )}
                                </div>
                            ))}
                        </p>
                        {editState && (
                            <button
                                className="assign-button"
                                data-testid="assign-roles"
                                type="button"
                                onClick={()=>handleShowRolesModal(setShowRolesModal)}>
                                <span className="plus">+</span> Assign Service Role(s)
                            </button>
                        )}
                        <p>
                            <strong>Monthly Hours Benchmark:</strong>
                            {editState ? (
                                <input 
                                    value={benchmark} 
                                    onChange={(e) => setBenchmark(e.target.value)} 
                                    type="number"
                                    data-testid="benchmark"
                                />
                            ) : (
                                ` ${profile.benchmark}`
                            )}
                        </p>
                        <p><strong>Phone Number:</strong> {profile.phoneNum}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Office Location:</strong> {profile.office}</p>
                        <p>
                            <strong>Teaching Assignments: </strong>
                            {selectedCourses.length === 0 && (
                                <span>N/A</span>
                            )}
                            {selectedCourses.map((teachingAssign, index) => (
                                <div key={teachingAssign.id}>
                                    {!editState ? (
                                        <Link to={`/DeptCourseInformation?courseid=${teachingAssign.id}`}>
                                        - {teachingAssign.courseCode}
                                        </Link>
                                    ) : (
                                        <span>- {teachingAssign.courseCode}</span>
                                    )}
                                    {editState && (
                                        <button type="button" className='remove-instructor' onClick={(e) => { unassign(teachingAssign.id, index, "course", selectedCourses, courseData, selectedRoles, roleData, reactUpdate) }}>X</button>
                                    )}
                                </div>
                            ))}
                        </p>
                        {editState ? (
                            <button
                                className="assign-button"
                                data-testid="assign-courses"
                                type="button"
                                onClick={()=>handleShowCoursesModal(setShowCoursesModal)}>
                                <span className="plus">+</span> Assign Course(s)
                            </button>
                        ) : (
                        <div>
                        <p className='chart'><strong>Service Hours:</strong></p>
                        <WorkHoursBarChart profileid={profile.profileId} height={400} width={500} className='performance-chart' authToken={authToken}/>
                        </div>
                        )}
                    </section>
                    {showCoursesModal && (
                        <AssignCoursesModal
                            courseData={courseData}
                            setCourseData={setCourseData}
                            handleCloseCoursesModal={handleCloseCoursesModal}
                            closeCourseModalVars = {closeCourseModalVars}
                        />
                    )}
                    {showRolesModal && (
                        <AssignRolesModal
                            roleData={roleData}
                            setRoleData={setRoleData}
                            handleCloseRolesModal={handleCloseRolesModal}
                            closeRoleModalVars={closeRoleModalVars}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeptProfilePage;
