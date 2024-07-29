import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { checkAccess, fetchWithAuth } from '../common/utils.js';
import { useAuth } from '../common/AuthContext';
import '../../CSS/Instructor/InsProfilePage.css';

// custom hook for fetching instructor profile data
function useInstructorProfilePage() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search); // parse url query parameters
	const ubcid = params.get('ubcid'); // get ubcid parameter from url
	const initProfile = { roles: [], teachingAssignments: [] }; // initial profile state
	const [profile, setProfile] = useState(initProfile);

	useEffect(() => { // fetch data when components in dependency array changes
		const fetchData = async () => {
			checkAccess(accountLogInType, navigate, 'instructor', authToken); // check access with accountLogInType and authToken is valid
			try {
				const response = await fetchWithAuth(`http://localhost:3001/api/instructorProfile`, authToken, navigate, { ubcid: ubcid });
				setProfile(response);
			} catch (error) {
				console.error('Error fetching instructor profile:', error);
			}
		};
	
		fetchData();
	}, [accountLogInType, authToken, ubcid, navigate]);
	return { // return profile data 
		profile
	}
}

// main component for rendering instructor's profile data
function InstructorProfilePage() {
	const {
		profile
	} = useInstructorProfilePage(); // use custom hook to receive profile data
	

	return (
		<div className="dashboard-container">
			<SideBar sideBarType="Instructor" />
			<div className="container">
				<TopBar />
				<div className="main-content" id="profile-test-content">
					<section className="information">
						<h1>{profile.name}'s Profile</h1>
						<p>
							<strong>Name:</strong> {profile.name}
						</p>
						<p>
							<strong>UBC ID:</strong> {profile.ubcid}
						</p>
						<p>
							<strong>Service Roles:</strong> {profile.roles.map((role, index) => (
								<span key={role.roleid}>
									<Link to={`/InsRoleInformation?roleid=${role.roleid}`}>{role.roleTitle}</Link>
									{index < profile.roles.length - 1 && ', '}
								</span>
							))}
						</p>
						<p>
							<strong>Monthly Hours Benchmark:</strong> {profile.benchmark}
						</p>
						<p>
							<strong>Phone Number:</strong> {profile.phone}
						</p>
						<p>
							<strong>Email:</strong> {profile.email}
						</p>
						<p>
							<strong>Office Location:</strong> {profile.office}
						</p>
						<p>
							<strong>Teaching Assignments:</strong>
							{profile.teachingAssignments
								.map((teachingAssign, index) => (
									<a key={index} href={teachingAssign.link}>
										{' '}
										<Link to={`/InsCourseHistory?courseid=${teachingAssign.courseid}`}>{teachingAssign.assign}</Link>
									</a>
								))
								.reduce((prev, curr) => [prev, ', ', curr], [])}
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}

export default InstructorProfilePage;
