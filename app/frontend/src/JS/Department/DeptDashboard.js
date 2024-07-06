import React, { useEffect } from 'react';
import '../../CSS/Department/DeptDashboard.css';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';

function Dashboard() {
	const navigate = useNavigate();
	const { authToken, accountType } = useAuth();

	useEffect(() => {
		const checkAuth = async () => {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			try {
				const numericAccountType = Number(accountType);
				if (numericAccountType !== 1 && numericAccountType !== 2) {
					alert('No Access, Redirecting to instructor view');
					navigate('/Dashboard');
				}
			} catch (error) {
				console.error('Failed to fetch account type', error);
				navigate('/Login');
			}
		};

		checkAuth();
	}, [authToken, accountType, navigate]);

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />

				<div className="card-container">
					<Link to={'/DeptMemberList'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">View/Edit Profiles</div>
							</div>
							<div className="cardDesc">View and edit various instructor profiles.</div>
						</div>
					</Link>
					<Link to={'/DeptServiceRoleList'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">View/Edit Service Roles</div>
							</div>
							<div className="cardDesc">View and edit service role information.</div>
						</div>
					</Link>
					<Link to={'/DeptDataEntry'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">Data Entry</div>
							</div>
							<div className="cardDesc">Create a new course or service role.</div>
						</div>
					</Link>
					<Link to={'/DeptCourseList'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">View/Edit Courses</div>
							</div>
							<div className="cardDesc">View and edit course information.</div>
						</div>
					</Link>
					<Link to={'/DeptPerformancePage'}>
						<div className="card" role="gridcell">
							<div className="cardTitleBox">
								<div className="cardTitle">Performace</div>
							</div>
							<div className="cardDesc">View department performance information.</div>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
