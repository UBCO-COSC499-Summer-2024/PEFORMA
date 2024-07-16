import React, { useState, useEffect, useRef, useReducer } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar, CreateWorkingBarChart } from '../common/commonImports.js';
import '../../CSS/Department/DeptProfilePage.css';
import AssignCoursesModal from '../DeptAssignCoursesModal.js';
import AssignRolesModal from '../DeptAssignRolesModal.js';
import { fillEmptyItems } from '../common/utils.js';

function DeptProfilePage() {
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search);
	const ubcid = params.get('ubcid');
	const { authToken, accountLogInType } = useAuth();
	const initProfile = { roles: [], teachingAssignments: [] };
	const [profile, setProfile] = useState(initProfile);
	const [editState, setEditState] = useState(false);
	const [name, setName] = useState('');
	const [benchmark, setBenchmark] = useState(0);
	const [email, setEmail] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [office, setOffice] = useState('');
	const [, forceUpdate] = useReducer(x => x + 1, 0);
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
				const numericAccountType = Number(accountLogInType);
				if (numericAccountType !== 1 && numericAccountType !== 2) {
					alert('No Access, Redirecting to instructor view');
					navigate('/Dashboard');
				}
				const response = await axios.get(`http://localhost:3001/api/instructorProfile`, {
					params: { ubcid: ubcid }, // Add ubcid as query parameter
					headers: { Authorization: `Bearer ${authToken.token}` },
				});

				if (response.data) {
					setProfile(response.data);
					setName(response.data.name);
					setBenchmark(response.data.benchmark);
					setEmail(response.data.email);
					setPhoneNumber(response.data.phoneNum);
					setOffice(response.data.office);
				}
				// Set up Course assignments
				const response2 = await axios.get(`http://localhost:3001/api/all-courses`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				response2.data.perPage = 8;
				
				for (let i = 0; i < response2.data.courses.length; i++) {
					response2.data.courses[i].assigned = false;
				}
				
				for (let i = 0; i < response.data.teachingAssignments.length; i++) {

					for (let j = 0; j < response2.data.courses.length; j++) {
						if (response2.data.courses[j].id === response.data.teachingAssignments[i].courseid) {
							response2.data.courses[j].assigned = true;
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
				}
				for (let i = 0; i < response.data.roles.length; i++) {

					for (let j = 0; j < response3.data.roles.length; j++) {
						if (response3.data.roles[j].id === response.data.roles[i].roleid) {
							response3.data.roles[j].assigned = true;	
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
	}, [authToken, ubcid, navigate]);

	const submitChanges = async(event) => {
		event.preventDefault();
		const formData = {
			ubcid: ubcid,
			name: name,
			benchmark: benchmark,
			phoneNum: phoneNumber,
			email: email,
			office: office,
			teachingAssignments:selectedCourses,
			roles:selectedRoles
		}

		if(window.confirm("Confirm changes?")) {
			//axios.post("").then(()=> {// put BE here
				setEditState(false);
				setProfile(formData);
			//}); 
		}
	}

	const handleEditState = (edit) => {
		if (edit) {
			setEditState(true);
			originalCourses.current = JSON.stringify(selectedCourses);
			originalCourseData.current = JSON.stringify(courseData);
			originalRoles.current = JSON.stringify(selectedRoles);
			originalRoleData.current = JSON.stringify(roleData);
		}
	}

	const cancelChanges = () => {
		if(window.confirm("Cancel changes?")) {
			setName(profile.name);
			setBenchmark(profile.benchmark);
			setEmail(profile.email);
			setPhoneNumber(profile.phoneNum);
			setOffice(profile.office);
			setEditState(false);
			setSelectedCourses(JSON.parse(originalCourses.current));
			setCourseData(JSON.parse(originalCourseData.current));
			setSelectedRoles(JSON.parse(originalRoles.current));
			setRoleData(JSON.parse(originalRoleData.current));
		}
	}
	const prevCourses = useRef({});
	const originalCourses = useRef({});
	const originalCourseData = useRef({});
	const handleShowCoursesModal = () => {
		prevCourses.current = JSON.stringify(courseData);
		setShowCoursesModal(true);
	};

	const prevRoles = useRef({});
	const originalRoles = useRef({});
	const originalRoleData = useRef({});
	const handleShowRolesModal = () => {
		prevRoles.current = JSON.stringify(roleData);
		setShowRolesModal(true);
	};

	const handleCloseCoursesModal = (save) => {
		if (!save) {
			if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
				setCourseData(JSON.parse(prevCourses.current));
			} else {
				return;
			}
		} else {
			var selected = courseData.courses.filter((course) => course.assigned);
			setSelectedCourses(selected);

		}
		courseData.currentPage = 1;
		setShowCoursesModal(false);
	};

	const handleCloseRolesModal = (save) => {
		if (!save) {
			if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
				setRoleData(JSON.parse(prevRoles.current));
			} else {
				return;
			}
		} else {
			var selected = roleData.roles.filter((role) => role.assigned);
			setSelectedRoles(selected);

		}
		roleData.currentPage = 1;
		setShowRolesModal(false);
	};


	return (
		<div className="deptProfile-container">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				
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
						{!editState && (
							<section className="information">
							<button className='edit-button' onClick={() => handleEditState(true)}>Edit Profile</button>
							<p>
								<strong>Name:</strong>
									{profile.name}
							</p>
							<p>
								<strong>UBC ID:</strong> {profile.ubcid}
							</p>
							<p>
								<strong>Service Role Assignments:</strong> {selectedRoles.map((role, index) => <span><Link to={"/DeptRoleInformation?roleid="+role.id} key={index}>{role.name}</Link>
				  {index < selectedRoles.length - 1 && (', ')}
				  </span>)}
							</p>
							<p>
								<strong>Monthly Hours Benchmark:</strong> {profile.benchmark}
							</p>
							<p>
								<strong>Phone Number:</strong> {profile.phoneNum}
							</p>
							<p>
								<strong>Email:</strong> {profile.email}
							</p>
							<p>
								<strong>Office Location:</strong> {profile.office}
							</p>
							<p>
								<strong>Teaching Assignments: </strong>
								{selectedCourses
									.map((teachingAssign, index) => (
					  <span>
										<Link key={index} to={"/DeptCourseInformation?courseid="+teachingAssign.id}>{teachingAssign.courseCode}</Link>
					  {index < selectedCourses.length - 1 && (', ')}
					  </span>
									))}
									
							</p>
					<p><strong>Service Hours:</strong></p>
					<CreateWorkingBarChart profileid={ubcid} height={400} width={500} className='performance-chart'/>
				
						</section>
						)}


						{editState && (
							<section className="information">
							<button className='save-button' onClick={submitChanges}>Save Changes</button>
							<button className='cancel-button' onClick={() => cancelChanges()}>Cancel Changes</button>
							<p className='formInput'>
								<strong>Name:</strong>
								<input placeholder={profile.name} onChange={(e) => setName(e.target.value)} type="text" />		 
							</p>
							<p>
								<strong>Service Role Assignments:</strong> {selectedRoles.map((role, index) => <span>{role.name}
				  {index < selectedRoles.length - 1 && (', ')}
				  </span>)}
							</p>
							<button
									className="assign-button"
									data-testid="assign-button"
									type="button"
									onClick={handleShowRolesModal}>
									<span className="plus">+</span> Assign Service Role(s)
							</button>
							<p className='formInput'>
								<strong>Monthly Hours Benchmark:</strong>
								<input placeholder={profile.benchmark} onChange={(e) => setBenchmark(e.target.value)} type="number" />	
							</p>
							<p className='formInput'>
								<strong>Phone Number:</strong> 
								<input placeholder={profile.phoneNum} onChange={(e) => setPhoneNumber(e.target.value)} type="text" />	
							</p>
							<p className='formInput'>
								<strong>Email:</strong>
								<input placeholder={profile.email} onChange={(e) => setEmail(e.target.value)} type="email" />
							</p>
							<p className='formInput'>
								<strong>Office Location:</strong> 
								<input placeholder={profile.office} onChange={(e) => setOffice(e.target.value)} type="text" />
							</p>
							<p>
								<strong>Teaching Assignments: </strong>
								{selectedCourses
									.map((teachingAssign, index) => (
					  <span>
										{teachingAssign.courseCode}
					  {index < selectedCourses.length - 1 && (', ')}
					  </span>
									))}
									
							</p>
							<button
									className="assign-button"
									data-testid="assign-button"
									type="button"
									onClick={handleShowCoursesModal}>
									<span className="plus">+</span> Assign Course(s)
							</button>
						</section>
						)}
						
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
