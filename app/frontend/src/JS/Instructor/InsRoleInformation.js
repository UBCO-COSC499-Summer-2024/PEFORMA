import React, { useState, useEffect } from 'react';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import '../../CSS/Department/DeptRoleInformation.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkAccess } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';

function InsRoleInformation() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const [roleData, setRoleData] = useState({
		assignees: [{}],
		assigneeCount: 0,
		perPage: 5,
		currentPage: 1,
	});

	const params = new URLSearchParams(window.location.search);
	const serviceRoleId = params.get('roleid');

	useEffect(() => {
		const fetchData = async () => {
			checkAccess(accountLogInType, navigate, 'instructor', authToken);
			const res = await axios.get(`http://localhost:3001/api/roleInfo`, {
				params: { serviceRoleId: serviceRoleId },
				headers: { Authorization: `Bearer ${authToken.token}` },
			});
			const data = res.data;
			setRoleData(data);
		};
		fetchData();
	}, []);

	return (
		<div className="dashboard">
			<SideBar sideBarType="Instructor" />
			<div className="container">
				<TopBar />
                <button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
				<div className="ri-main" data-testid="ri-main">
					<h1 className="roleName">{roleData.roleName}</h1>
					<div className="description">{roleData.roleDescription}</div>
					<p>
						Department:{' '}
						<span className="bold" role="contentinfo">
							{roleData.department}
						</span>
					</p>


				</div>
			</div>
		</div>
	);
}

export default InsRoleInformation;
