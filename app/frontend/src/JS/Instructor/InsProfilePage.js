import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../../CSS/Instructor/InsProfilePage.css';

function InstructorProfilePage() {
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search);
	const ubcid = params.get('ubcid');
	const { authToken, accountLogInType } = useAuth();
	const initProfile = { roles: [], teachingAssignments: [] };
	const [profile, setProfile] = useState(initProfile);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!authToken) {
					navigate('/Login');
					return;
				}
				const numericAccountType = Number(accountLogInType);
				if (numericAccountType !== 3) {
					alert('No Access, Redirecting to department view');
					navigate('/DeptDashboard');
				}
				const response = await axios.get(`http://localhost:3001/api/instructorProfile`, {
					params: { ubcid: ubcid }, // Add ubcid as query parameter
					headers: { Authorization: `Bearer ${authToken.token}` },
				});

				if (response.data) {
					setProfile(response.data);
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

	return (
		<div className="dashboard-container">
			<CreateSideBar sideBarType="Instructor" />
			<div className="container">
				<CreateTopBar />
				<div className="main-content" id="text-content">
					<section className="information">
						<h1>{profile.name}'s Profile</h1>
						<p>
							<strong>Name:</strong> {profile.name}
						</p>
						<p>
							<strong>UBC ID:</strong> {profile.ubcid}
						</p>
						<p>
							<strong>Service Roles:</strong> {profile.roles.map((role) => role).join(', ')}
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
										{teachingAssign.assign}
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
