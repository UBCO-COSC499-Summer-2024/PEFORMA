import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar, CreateWorkingBarChart } from '../common/commonImports.js';
import '../../CSS/Department/DeptProfilePage.css';
import AssignCoursesModal from '../DeptAssignCoursesModal.js';
import AssignRolesModal from '../DeptAssignRolesModal.js';
import { fillEmptyItems, checkAccess } from '../common/utils.js';

function DeptProfilePage() {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const ubcid = params.get('ubcid');
    const { authToken, accountLogInType } = useAuth();
    const initProfile = { roles: [], teachingAssignments: [] };
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

    useEffect(() => {
        
        const fetchData = async () => {
            
            try {
                if (!authToken) {
                    navigate('/Login');
                    return;
                }
                checkAccess(accountLogInType, navigate, 'department', authToken);
                const response = await axios.get(`http://localhost:3001/api/instructorProfile`, {
                    params: { ubcid: ubcid },
                    headers: { Authorization: `Bearer ${authToken.token}` },
                });
                
                if (response.data.benchmark == null) {
                    response.data.benchmark = "N/A";
                }
                console.log("A");
                if (response.data.phoneNum == "" || response.data.phoneNum == null) {
                    response.data.phoneNum = "N/A";
                }
                if (response.data.office == null+" "+null || response.data.office == null) {
                    response.data.office = "N/A";
                }
                
                if (response.data) {
                    setProfile(response.data);
                    setBenchmark(response.data.benchmark);
                }
                
                // Set up Course assignments
                const response2 = await axios.get(`http://localhost:3001/api/all-courses`, {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                });
                response2.data.perPage = 8;
                
                for (let i = 0; i < response2.data.courses.length; i++) {
                    response2.data.courses[i].assigned = false;
                    response2.data.courses[i].originallyAssigned = false;
                }
                
                for (let i = 0; i < response.data.teachingAssignments.length; i++) {
                    for (let j = 0; j < response2.data.courses.length; j++) {
                        if (response2.data.courses[j].id === response.data.teachingAssignments[i].courseid) {
                            response2.data.courses[j].assigned = true;
                            response2.data.courses[j].originallyAssigned = true;
                        }
                    }
                }
                setSelectedCourses(response2.data.courses.filter((course) => course.assigned));
                
                const filledCourses = fillEmptyItems(response2.data.courses, response2.data.perPage);
                setCourseData({...response2.data, courses:filledCourses});
                
                // Set up Role assignments
                const response3 = await axios.get(`http://localhost:3001/api/service-roles`, {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                });

                response3.data.perPage = 8;
                for (let i = 0; i < response3.data.roles.length; i++) {
                    response3.data.roles[i].assigned = false;
                    response3.data.roles[i].originallyAssigned = false;
                }
                for (let i = 0; i < response.data.roles.length; i++) {
                    for (let j = 0; j < response3.data.roles.length; j++) {
                        if (response3.data.roles[j].id === response.data.roles[i].roleid) {
                            response3.data.roles[j].assigned = true;    
                            response3.data.roles[j].originallyAssigned = true;
                        }
                    }
                }
                setSelectedRoles(response3.data.roles.filter((role) => role.assigned));
                const filledRoles = fillEmptyItems(response3.data.roles, response3.data.perPage);
                setRoleData({...response3.data, roles:filledRoles});

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

    const submitChanges = async(event) => {
		event.preventDefault();
		if(window.confirm("Confirm changes?")) {
			try {
				// Update benchmark
				await axios.put('http://localhost:3001/api/dept-profile/benchmark', {
					ubcId: ubcid,
					benchmark: benchmark
				}, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
	
				// Update service roles
				const roleChanges = roleData.roles
					.filter(role => role.assigned !== role.originallyAssigned)
					.map(role => ({
						serviceRoleId: role.id,
						year: new Date().getFullYear(),
						action: role.assigned ? 'add' : 'remove'
					}));
				
				console.log('Sending role changes:', roleChanges); // Log the data being sent
				
				const roleResponse = await axios.put('http://localhost:3001/api/dept-profile/service-roles', {
					ubcId: ubcid,
					serviceRoles: roleChanges
				}, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				
				console.log('Server response for roles:', roleResponse.data); // Log the server's response
	
				// Update course assignments
				const courseChanges = courseData.courses
					.filter(course => course.assigned !== course.originallyAssigned)
					.map(course => ({
						courseId: course.id,
						term: course.term,
						action: course.assigned ? 'add' : 'remove'
					}));
				
				console.log('Sending course changes:', courseChanges); // Log the data being sent
				
				const courseResponse = await axios.put('http://localhost:3001/api/dept-profile/course-assignments', {
					ubcId: ubcid,
					courses: courseChanges
				}, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				
				console.log('Server response for courses:', courseResponse.data); // Log the server's response
	
				setEditState(false);
				// Update the local state to reflect the changes
				setRoleData(prevData => ({
					...prevData,
					roles: prevData.roles.map(role => ({ ...role, originallyAssigned: role.assigned }))
				}));
				setCourseData(prevData => ({
					...prevData,
					courses: prevData.courses.map(course => ({ ...course, originallyAssigned: course.assigned }))
				}));
				setSelectedRoles(roleData.roles.filter(role => role.assigned));
				setSelectedCourses(courseData.courses.filter(course => course.assigned));
				
				alert('Profile updated successfully!');
			} catch (error) {
				console.error('Error updating profile:', error.response?.data || error.message);
				alert('Failed to update profile. Please check the console for more details.');
			}
		}
	}
	
    const handleEditState = (edit) => {
        if (edit) {
            setEditState(true);
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

    return (
        <div className="deptProfile-container">
            <CreateSideBar sideBarType="Department" />
            <div className="container" data-testid="main-container">
                <CreateTopBar />
                <div className='outside'>
                    {!editState && (
                        <button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
                    )}
                    {editState && (
                        <div className='space'></div>
                    )}
                    <h1>{profile.name}'s Profile</h1>
                </div>
                <div className="main-content" id="text-content"> 
                    <section className="information">
                        {!editState && (
                            <button className='edit-button' onClick={() => handleEditState(true)}>Edit Profile</button>
                        )}
                        {editState && (
                            <>
                                <button className='save-button' onClick={submitChanges}>Save Changes</button>
                                <button className='cancel-button' onClick={() => cancelChanges()}>Cancel Changes</button>
                            </>
                        )}
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>UBC ID:</strong> {profile.ubcid}</p>
                        <p>
                            <strong>Service Role Assignments: </strong> 
                            {selectedRoles.length === 0 && (
                                <span>N/A</span>
                            )}
                            {selectedRoles.map((role, index) => (
                                <span key={role.id}>
                                    <Link to={`/DeptRoleInformation?roleid=${role.id}`}>{role.name}</Link>
                                    {index < selectedRoles.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        {editState && (
                            <button
                                className="assign-button"
                                data-testid="assign-button"
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
                                <span key={teachingAssign.id}>
                                    <Link to={`/DeptCourseInformation?courseid=${teachingAssign.id}`}>
                                        {teachingAssign.courseCode}
                                    </Link>
                                    {index < selectedCourses.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        {editState && (
                            <button
                                className="assign-button"
                                data-testid="assign-button"
                                type="button"
                                onClick={handleShowCoursesModal}>
                                <span className="plus">+</span> Assign Course(s)
                            </button>
                        )}
                        
                        <p><strong>Service Hours:</strong></p>
                        <CreateWorkingBarChart profileid={profile.profileId} height={400} width={500} className='performance-chart'/>
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