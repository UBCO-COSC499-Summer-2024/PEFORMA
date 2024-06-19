import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Instructor/PerformanceInstructorPage.css';
import CreateSidebar, {
	CreateLeaderboardChart,
	CreateScorePolarChart,
	CreateTopbar,
	CreateWorkingBarChart,
	CreateProgressChart
} from '../commonImports.js';
import { useAuth } from '../AuthContext';

function PerformanceInstructorPage() {
	const navigate = useNavigate();
	//const params = new URLSearchParams(window.location.search);
	//const ubcid = params.get('ubcid');
	//console.log("UBC ID initialized: ",ubcid);
	const { authToken } = useAuth();
	const { profileId } = useAuth();

	const initProfile = {
		roles: [],
		teachingAssignments: [{}],
	};
	const [profile, setProfile] = useState(initProfile);

	
	console.log("asdhaighsdf");
	console.log(profileId);

	useEffect(() => {

		const fetchData = async () => {
		  try {
			if (!authToken) {
			  navigate('/Login');
			  return;
			}
			const response = await axios.get(`http://localhost:3001/api/instructorProfile`, {
			  params: { 
					profileId:profileId 
				}, 
			  headers: { Authorization: `Bearer ${authToken.token}` }
			});
			console.log(response);
	
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
	  }, [authToken, profileId, navigate]);


	return (
		<div className="dashboard-container">
			<CreateSidebar />

			<div className="container">
				<CreateTopbar />
				<div className="greeting">
					<h1>Welcome {profile.name}, check out your performance!</h1>
				</div>

				<div className="info-table">
					<section className="info-section">
						<div className="info">
							<h2 className="subTitle">Your Information</h2>
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
								<strong>Email:</strong> {profile.email}
							</p>
						</div>

						<div className="assignment-table">
							<ul className="teaching-assignments">
								<p className="teaching-margin">
									<h2 className='subTitle'>Teaching Assignments:</h2>
								</p>
								{profile.teachingAssignments.map((teachingAssign) => (
									<li key={teachingAssign.id}>
										<a href="{teachingAssign.link}"> {teachingAssign.assign}</a>
									</li>
								))}
							</ul>
						</div>
					</section>

					<div className="graph-section">
						<h2 className="subTitle">Working Hours</h2>
						<CreateWorkingBarChart />
					</div>
				</div>

				<div className="bottom-section">
					<div className="polarchart-section">
						<h2 className="subTitle">Department Performance</h2>
						<CreateScorePolarChart />
					</div>

					<div className="leaderboard-section">
						<h2 className="subTitle">Leader Board (Updated per month)</h2>
						<CreateLeaderboardChart />
					</div>
				</div>

				<div>
					<h2 className='subTitle'>Progress Chart</h2>
					<CreateProgressChart />
				</div>
			</div>

		</div>
	);
}

export default PerformanceInstructorPage;
