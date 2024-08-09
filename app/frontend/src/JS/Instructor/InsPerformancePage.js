import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import WorkHoursBarChart from './InsPerformanceImports/InsWorkHoursBarChart.js';
import DeptPerformancePieChart from './InsPerformanceImports/InsPerformancePolarChart.js';
import LeaderBoard from './InsPerformanceImports/InsLeaderBoard.js';
import ServiceHoursProgressChart from './InsPerformanceImports/InsServiceHoursProgressChart.js'
import { checkAccess, fetchWithAuth } from '../common/utils.js'
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Instructor/InsPerformancePage.css';

// custom hook for fetching instructor profile data
function useFetchInstructorProfile( authToken, accountLogInType, profileId, navigate ) {
	const [profile, setProfile] = useState({
			roles: [],
			teachingAssignments: [{}],
	});

	useEffect(() => { // fetch data when authToken, profileId, and accountLogInType changes
			const date = new Date();
			const currentMonth = date.getMonth() + 1; // setting currentMonth to send BE 

			const fetchData = async () => { 
					try {
							checkAccess(accountLogInType, navigate, 'instructor', authToken); // check access with accountLogInType and authToken
							const data = await fetchWithAuth(`http://localhost:3001/api/instructorProfile`, authToken, navigate, {
									profileId: profileId,
									currentMonth: currentMonth,
							});
							setProfile(data); // set profile data with data from api response
					} catch (error) {
							console.error('Error fetching instructor profile:', error);
					}
			};

			fetchData();
	}, [authToken, profileId, navigate, accountLogInType]);

	return profile; // return updated profile data
}

// main component to render a profile information
function PerformanceInstructorPage() {
	const navigate = useNavigate();
	const { authToken, accountLogInType, profileId } = useAuth();
	// use custom hook for profile 
	const profile = useFetchInstructorProfile( authToken, accountLogInType, profileId, navigate );

	return (
		<div className="dashboard-container">
			<SideBar sideBarType="Instructor" />

			<div className="container" id="info-test-content">
				<TopBar />
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
								<strong>Service Roles:</strong> {profile.roles.map((role, index) => <span><Link to={"/InsRoleInformation?roleid="+role.roleid}>{role.roleTitle}</Link>
              {index < profile.roles.length - 1 && (', ')}
              </span>)}
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
									<h2 className="subTitle">Teaching Assignments:</h2>
								</p>
								{profile.teachingAssignments.map((teachingAssign) => (
									<li key={teachingAssign.id}>
										<Link to={`/InsCourseHistory?courseid=${teachingAssign.courseid}`}>{teachingAssign.assign}</Link>
									</li>
								))}
							</ul>
						</div>
					</section>

					<div className="graph-section">
						<h2 className="subTitle">Service Hours</h2>
						<WorkHoursBarChart profileid={profileId} height={600} authToken={authToken} navigate={navigate} />
					</div>
				</div>

				<div className="bottom-section">
					<div className="polarchart-section">
						<h2 className="subTitle">Department Performance</h2>
						<DeptPerformancePieChart authToken={authToken} navigate={navigate} />
					</div>

					<div className="leaderboard-section">
						<h2 className="subTitle">Leader Board</h2>
						<LeaderBoard authToken={authToken} navigate={navigate} />
					</div>
				</div>

				<div className="under-bottom-section">
					<div className="progress-section">
						<h2 className="subTitle">Progress Chart</h2>
						<ServiceHoursProgressChart authToken={authToken} navigate={navigate} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default PerformanceInstructorPage;
