import React, { useEffect } from 'react';
import '../../CSS/Instructor/Dashboard.css';
import CreateSidebar, { CreateTopbar } from '../common/commonImports.js';
import divisions from '../common/divisions.js';
import cardImages from '../common/cardImages.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
	const { profileId, accountType, authToken } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			try {
				const numericAccountType = Number(accountType);
				if (numericAccountType !== 3) {
					alert('No Access, Redirecting to department view');
					navigate('/DeptDashboard');
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
			<CreateSidebar />
			<div className="container">
				<CreateTopbar />

				<div className="card-container">
					{divisions.map((division) => {
						return (
							<Link
								to={`/CourseList?division=${division.code}&profileId=${profileId}`}
								key={division.code}>
								<div className="card" role="gridcell">
									<img src={cardImages[division.code]} alt={division.label} />
									<div className="cardTitle">{division.label}</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
