import React, { useEffect } from 'react';
import '../../CSS/Department/DeptDashboard.css';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import { checkAccess } from '../common/utils.js';

function Dashboard() {
	const navigate = useNavigate(); // For navigating to different pages
	const { authToken, accountLogInType } = useAuth();
	// Upon entering the page, check if the user has access
	useEffect(() => {
		const checkAuth = async () => {
			try {
				checkAccess(accountLogInType, navigate, 'department', authToken);
			} catch (error) {
				console.error('Failed to fetch account type', error);
				navigate('/Login');
			}
		};
		checkAuth();
	}, [authToken, navigate]);

	return (
		<div className="dashboard">
			<SideBar sideBarType="Department" />
			<div className="container">
				<TopBar />

				<div className="card-container">
					<Link to={'/DeptPerformancePage'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">Performace</div>
							</div>
							<div className="cardDesc">View department performance information.</div>
						</div>
					</Link>
					<Link to={'/DeptTeachingAssignment'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">Teaching Assignment</div>
							</div>
							<div className="cardDesc">View teaching assignment for current term.</div>
						</div>
					</Link>
					<Link to={'/DeptCourseList'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">Manage Courses</div>
							</div>
							<div className="cardDesc">View and edit course information.</div>
						</div>
					</Link>
					<Link to={'/DeptServiceRoleList'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">Manage Service Roles</div>
							</div>
							<div className="cardDesc">View and edit service role information.</div>
						</div>
					</Link>
					<Link to={'/DeptMemberList'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">View Members</div>
							</div>
							<div className="cardDesc">View and edit various instructor profiles.</div>
						</div>
					</Link>
					<Link to={'/DeptDataEntry'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">Create New Course/Role</div>
							</div>
							<div className="cardDesc">Create a new course, service role, import files</div>
						</div>
					</Link>
					<Link to={'/DeptSEIPage'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">SEI Data Entry</div>
							</div>
							<div className="cardDesc">Evaluate course and instructor.</div>
						</div>
					</Link>
					<Link to={'/DeptMeetingManagement'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">Meeting log</div>
							</div>
							<div className="cardDesc">Export todays meeting</div>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
