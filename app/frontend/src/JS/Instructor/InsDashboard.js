import React, { useEffect } from 'react';
import '../../CSS/Instructor/InsDashboard.css';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import divisions from '../common/divisions.js';
import cardImages from '../common/cardImages.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { checkAccess } from '../common/utils.js'


function Dashboard() {
	const { profileId, accountLogInType, authToken } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			try {
				checkAccess(accountLogInType, navigate, 'instructor', authToken);

			} catch (error) {
				console.error('Failed to fetch account type', error);
				navigate('/Login');
			}
		};

		checkAuth();
	}, [authToken, navigate]);

	return (
		<div className="dashboard">
			<SideBar sideBarType="Instructor" />
			<div className="container">
				<TopBar />

				<div className="card-container">
					{divisions.map((division) => {
						return (
							<Link
								to={`/InsCourseList?division=${division.code}&profileId=${profileId}`}
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
