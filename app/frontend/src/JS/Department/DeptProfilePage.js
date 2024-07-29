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

function DeptProfilePage() {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const ubcid = params.get('ubcid');
    const { authToken, accountLogInType } = useAuth();
    const initProfile = { roles: [], teachingAssignments: [], name:"N/A", ubcid:ubcid, benchmark:"N/A", phoneNum:"N/A", email:"N/A", office:"N/A" };
    const [profile, setProfile] = useState(initProfile);
    const [editState, setEditState] = useState(false);
    const [benchmark, setBenchmark] = useState(0);
    const [, reactUpdate] = useReducer(i => i + 1, 0);
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

    function handleNullData(data) {
        if (data.benchmark == null) {
            data.benchmark = "N/A";
        }
        if (data.phoneNum == "" || data.phoneNum == null) {
            data.phoneNum = "N/A";
        }
        if (data.office == null+" "+null || data.office == null) {
            data.office = "N/A";
        }
        return data;
    }

    const fetchProfileData = async() => {
        const response = await axios.get(`http://localhost:3001/api/instructorProfile`, {
            params: { ubcid: ubcid },
            headers: { Authorization: `Bearer ${authToken.token}` },
        });
        response.data = handleNullData(response.data);
        
        if (response.data) {
            setProfile(response.data);
            setBenchmark(response.data.benchmark);
        }
        return response.data;
    }

    const fetchAllCourses = async() => {
        const response2 = await axios.get(`http://localhost:3001/api/all-courses`, {
            headers: { Authorization: `Bearer ${authToken.token}` },
        });
        response2.data.perPage = 8;
        return response2.data;
    }

    const fetchAllRoles = async() => {
        const response3 = await axios.get(`http://localhost:3001/api/service-roles`, {
            headers: { Authorization: `Bearer ${authToken.token}` },
        });

        response3.data.perPage = 8;
        return response3.data;
    }

    function formatListData(list, assignedItems) {
        for (let i = 0; i < list.length; i++) {
            list[i].assigned = false;
            list[i].originallyAssigned = false;
        }
        
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

    // Fetch all data
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!authToken) {
                    navigate('/Login');
                    return;
                }
                checkAccess(accountLogInType, navigate, 'department', authToken);
                let profileData = await fetchProfileData();
                
                // Set up Course assignments
                let allCourses = await fetchAllCourses();
                
                allCourses.courses = formatListData(allCourses.courses, profileData.teachingAssignments)
                setSelectedCourses(allCourses.courses.filter((course) => course.assigned));
                
                const filledCourses = fillEmptyItems(allCourses.courses, allCourses.perPage);
                setCourseData({...allCourses, courses:filledCourses});
                
                // Set up Role assignments
                let allRoles = await fetchAllRoles();

                allRoles.roles = formatListData(allRoles.roles, profileData.roles);

                setSelectedRoles(allRoles.roles.filter((role) => role.assigned));
                const filledRoles = fillEmptyItems(allRoles.roles, allRoles.perPage);
                setRoleData({...allRoles, roles:filledRoles});

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

    const updateBenchmark = async() => {
        await axios.put('http://localhost:3001/api/dept-profile/benchmark', {
            ubcId: ubcid,
            benchmark: benchmark
        }, {
            headers: { Authorization: `Bearer ${authToken.token}` },
        });
        profile.benchmark = benchmark;
    }

    const updateRoles = async() => {
        const roleChanges = roleData.roles
        .filter(role => role.assigned !== role.originallyAssigned)
        .map(role => ({
            serviceRoleId: role.id,
            year: new Date().getFullYear(),
            action: role.assigned ? 'add' : 'remove'
        }));
    
        const roleResponse = await axios.put('http://localhost:3001/api/dept-profile/service-roles', {
            ubcId: ubcid,
            serviceRoles: roleChanges
        }, {
            headers: { Authorization: `Bearer ${authToken.token}` },
        });

        setRoleData(prevData => ({
            ...prevData,
            roles: prevData.roles.map(role => ({ ...role, originallyAssigned: role.assigned }))
        }));
        setSelectedRoles(roleData.roles.filter(role => role.assigned));
    }

    const updateCourses = async() => {
        const courseChanges = courseData.courses
        .filter(course => course.assigned !== course.originallyAssigned)
        .map(course => ({
            courseId: course.id,
            term: course.term,
            action: course.assigned ? 'add' : 'remove'
        }));
    
        const courseResponse = await axios.put('http://localhost:3001/api/dept-profile/course-assignments', {
            ubcId: ubcid,
            courses: courseChanges
        }, {
            headers: { Authorization: `Bearer ${authToken.token}` },
        });

        setCourseData(prevData => ({
            ...prevData,
            courses: prevData.courses.map(course => ({ ...course, originallyAssigned: course.assigned }))
        }));
        
        setSelectedCourses(courseData.courses.filter(course => course.assigned));
    }

    const submitChanges = async(event) => {
		event.preventDefault();
		if(window.confirm("Confirm changes?")) {
			try {
                await updateBenchmark();
				await updateRoles();
				await updateCourses();
				
				setEditState(false);
				
				alert('Profile updated successfully!');
			} catch (error) {
				console.error('Error updating profile:', error.response?.data || error.message);
				alert('Failed to update profile. Please check the console for more details.');
			}
		}
	}

    const prevRoles = useRef({});
    const prevCourses = useRef({});
    const handleEditState = (edit) => {
        if (edit) {
            setEditState(true);
            prevRoles.current = JSON.stringify(selectedRoles);
            prevCourses.current = JSON.stringify(selectedCourses); 
        }
    }

    const cancelChanges = () => {
        if(window.confirm("Cancel changes?")) {
            setBenchmark(profile.benchmark);
            setEditState(false);
            // Revert to original assignment state
            setRoleData(prevData => ({
                ...prevData,
                roles: prevData.roles.map(role => ({ ...role, assigned: role.originallyAssigned }))
            }));
            setSelectedRoles(JSON.parse(prevRoles.current));
            setSelectedCourses(JSON.parse(prevCourses.current));
            setCourseData(prevData => ({
                ...prevData,
                courses: prevData.courses.map(course => ({ ...course, assigned: course.originallyAssigned }))
            }));
        }
    }

    const handleShowCoursesModal = () => {
        setShowCoursesModal(true);
    };

    const handleShowRolesModal = () => {
        setShowRolesModal(true);
    };

    const handleCloseCoursesModal = (save) => {
        if (!save) {
            if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
                setCourseData(prevData => ({
                    ...prevData,
                    courses: prevData.courses.map(course => ({ ...course, assigned: course.originallyAssigned }))
                }));
            } else {
                return;
            }
        } else {
            setSelectedCourses(courseData.courses.filter((course) => course.assigned));
        }
        setCourseData(prevData => ({...prevData, currentPage: 1}));
        setShowCoursesModal(false);
    };

    const handleCloseRolesModal = (save) => {
        if (!save) {
            if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
                setRoleData(prevData => ({
                    ...prevData,
                    roles: prevData.roles.map(role => ({ ...role, assigned: role.originallyAssigned }))
                }));
            } else {
                return;
            }
        } else {
            setSelectedRoles(roleData.roles.filter((role) => role.assigned));
        }
        setRoleData(prevData => ({...prevData, currentPage: 1}));
        setShowRolesModal(false);
    };

    const unassign = async (id, index, type) => {
        let dataList;
        if (type == "course") {
            selectedCourses.splice(index, 1);
            dataList = courseData.courses;
        } else {
            selectedRoles.splice(index, 1);
            dataList = roleData.roles;
        }

        for (let i = 0; i < dataList.length; i++) {
            if (id === dataList[i].id) {
              dataList[i].assigned = false;
              break;
            }
          }
          
          if (type == "course") {
            courseData.courses = dataList;
          } else {
            roleData.roles = dataList;
          }
          reactUpdate();
    }
    
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
                            <button className='edit-button' data-testid="edit-button" onClick={() => handleEditState(true)}>Edit Profile</button>
                        ) : (
                            <>
                                <button className='save-button' data-testid="save-button" onClick={submitChanges}>Save Changes</button>
                                <button className='cancel-button' data-testid="cancel-button" onClick={() => cancelChanges()}>Cancel Changes</button>
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
                                        <button type="button" className='remove-instructor' onClick={(e) => { unassign(role.id, index, "role") }}>X</button>
                                    )}
                                </div>
                            ))}
                        </p>
                        {editState && (
                            <button
                                className="assign-button"
                                data-testid="assign-roles"
                                type="button"
                                onClick={handleShowRolesModal}>
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
                            {selectedCourses.length == 0 && (
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
                                        <button type="button" className='remove-instructor' onClick={(e) => { unassign(teachingAssign.id, index, "course") }}>X</button>
                                    )}
                                </div>
                            ))}
                        </p>
                        {editState ? (
                            <button
                                className="assign-button"
                                data-testid="assign-courses"
                                type="button"
                                onClick={handleShowCoursesModal}>
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
                        />
                    )}
                    {showRolesModal && (
                        <AssignRolesModal
                            roleData={roleData}
                            setRoleData={setRoleData}
                            handleCloseRolesModal={handleCloseRolesModal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeptProfilePage;