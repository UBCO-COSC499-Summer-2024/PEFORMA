import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { checkAccess, fetchWithAuth } from '../common/utils.js';
import { useAuth } from '../common/AuthContext';
import '../../CSS/Instructor/InsProfilePage.css';

function useInstructorProfilePage() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search);
	const ubcid = params.get('ubcid');
	const initProfile = { roles: [], teachingAssignments: [] };
	const [profile, setProfile] = useState(initProfile);

	useEffect(() => {
		const fetchData = async () => {
			checkAccess(accountLogInType, navigate, 'instructor', authToken);
			try {
				const response = await fetchWithAuth(`http://localhost:3001/api/instructorProfile`, authToken, navigate, { ubcid: ubcid });
				setProfile(response);
			} catch (error) {
				console.error('Error fetching instructor profile:', error);
			}
		};
	
		fetchData();
	}, [accountLogInType, authToken, ubcid, navigate]);
	return {
		profile
	}
}

function InstructorProfilePage() {
	const {
		profile
	} = useInstructorProfilePage();
	

	return (
		<div className="dashboard-container">
			<CreateSideBar sideBarType="Instructor" />
			<div className="container">
				<CreateTopBar />
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
