import React, { useEffect } from 'react';
import '../../CSS/Department/DeptDashboard.css';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import { checkAccess } from '../common/utils.js';

function Dashboard() {
	const navigate = useNavigate();
	const { authToken, accountLogInType } = useAuth();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				checkAccess(accountLogInType, navigate, 'department');

			} catch (error) {
				console.error('Failed to fetch account type', error);
				navigate('/Login');
			}
		};

		checkAuth();
	}, [authToken, navigate]);

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />

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
								<div className="cardTitle">Creation</div>
							</div>
							<div className="cardDesc">Create a new course, service role, import files</div>
						</div>
					</Link>
					<Link to={'/DeptDataEntry'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">SEI Data Entry</div>
							</div>
							<div className="cardDesc">Evaluate course and instructor.</div>
						</div>
					</Link>
					
					
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
