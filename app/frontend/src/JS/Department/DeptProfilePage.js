import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar, CreateWorkingBarChart } from '../common/commonImports.js';
import '../../CSS/Department/DeptProfilePage.css';

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
	const [editedTeachingAssignments, setEditedTeachingAssignments] = useState([]);
	const [editedRoles, setEditedRoles] = useState([]);

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
					setEditedTeachingAssignments(response.data.teachingAssignments);
					setEditedRoles(response.data.roles);
				}
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
	// const profile = {"name":"Billy Guy", "id":"18592831", "benchmark":"1300", "roles":["Role1", "Role2"], "email":"billyGuy@instructor.ubc.ca", "phone":"778-333-2222", "office":"SCI 300", "teachingAssignments":[{"assign":"COSC 211","link":"abc.com"},{"assign":"COSC 304","link":"def.com"}]};

	const submitChanges = async(event) => {
		event.preventDefault();
		const formData = {
			ubcid: ubcid,
			name: name,
			benchmark: benchmark,
			phoneNum: phoneNumber,
			email: email,
			office: office,
			teachingAssignments:editedTeachingAssignments,
			roles:editedRoles 
		}

		if(window.confirm("Confirm changes?")) {
			//axios.post("").then(()=> {// put BE here
				setEditState(false);
				setProfile(formData);
			//}); 
		}
	}

	const cancelChanges = () => {
		if(window.confirm("Cancel changes?")) {
			setName(profile.name);
			setBenchmark(profile.benchmark);
			setEmail(profile.email);
			setPhoneNumber(profile.phoneNum);
			setOffice(profile.office);
			setEditedTeachingAssignments(profile.teachingAssignments);
			setEditedRoles(profile.roles);
			setEditState(false);
		}
	}

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
					<div><br/><br/></div>
				)}
				
					<h1>{profile.name}'s Profile</h1>
				</div>
				<div className="main-content" id="text-content">
						{!editState && (
							<section className="information">
							<button className='edit-button' onClick={() => setEditState(true)}>Edit Profile</button>
							<p>
								<strong>Name:</strong>
									{profile.name}
							</p>
							<p>
								<strong>UBC ID:</strong> {profile.ubcid}
							</p>
							<p>
								<strong>Service Role Assignments:</strong> {profile.roles.map((role, index) => <span><Link to={"/DeptRoleInformation?roleid="+role.roleid} key={index}>{role.roleTitle}</Link>
				  {index < profile.roles.length - 1 && (', ')}
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
								{profile.teachingAssignments
									.map((teachingAssign, index) => (
					  <span>
										<Link key={index} to={"/DeptCourseInformation?courseid="+teachingAssign.courseid}>{teachingAssign.assign}</Link>
					  {index < profile.teachingAssignments.length - 1 && (', ')}
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
								<strong>Service Role Assignments:</strong> {profile.roles.map((role, index) => <span>{role.roleTitle}
				  {index < profile.roles.length - 1 && (', ')}
				  </span>)}
							</p>
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
								{profile.teachingAssignments
									.map((teachingAssign, index) => (
					  <span>
										{teachingAssign.assign}
					  {index < profile.teachingAssignments.length - 1 && (', ')}
					  </span>
									))}
									
							</p>
						</section>
						)}
				</div>
			</div>
		</div>
	);
}

export default DeptProfilePage;
