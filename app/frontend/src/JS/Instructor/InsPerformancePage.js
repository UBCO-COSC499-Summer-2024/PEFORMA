import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../CSS/Instructor/InsPerformancePage.css';
import CreateSideBar, {
	CreateLeaderboardChart,
	CreateScorePolarChart,
	CreateTopBar,
	CreateWorkingBarChart,
	CreateProgressChart,
} from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { checkAccess } from '../common/utils.js'

function PerformanceInstructorPage() {
	const navigate = useNavigate();
	const { authToken, accountLogInType, profileId } = useAuth();

	const initProfile = {
		roles: [],
		teachingAssignments: [{}],
	};
	const [profile, setProfile] = useState(initProfile);

	useEffect(() => {
		const date = new Date();
		const currentMonth = date.getMonth() + 1;

		const fetchData = async () => {
			try {

				checkAccess(accountLogInType, navigate, 'instructor', authToken);
				const response = await axios.get(`http://localhost:3001/api/instructorProfile`, {
					params: {
						profileId: profileId,
						currentMonth: currentMonth,
					},
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
	}, [authToken, profileId, navigate]);

	return (
		<div className="dashboard-container">
			<CreateSideBar sideBarType="Instructor" />

			<div className="container" id="info-test-content">
				<CreateTopBar />
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
						<h2 className="subTitle">Working Hours</h2>
						<CreateWorkingBarChart profileid={profileId} height={600}/>
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

				<div className="under-bottom-section">
					<div className="progress-section">
						<h2 className="subTitle">Progress Chart (Year)</h2>
						<CreateProgressChart />
					</div>
				</div>
			</div>
		</div>
	);
}

export default PerformanceInstructorPage;
