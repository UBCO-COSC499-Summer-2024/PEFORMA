import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptServiceRoleList.css';

function ServiceRoleList() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const [roleData, setRoleData] = useState({
		roles: [{}],
		rolesCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [activeRolesCount, setActiveRolesCount] = useState(0);


	useEffect(() => {
		const fetchServiceRoles = async () => {
			try {
				if (!authToken) {
					// Redirect to login if no token
					navigate('/Login'); // Use your navigation mechanism
					return;
				}
				const numericAccountType = Number(accountLogInType);
				if (numericAccountType !== 1 && numericAccountType !== 2) {
					alert('No Access, Redirecting to instructor view');
					navigate('/InsDashboard');
				}
				// Fetch course data with Axios, adding token to header
				const res = await axios.get(`http://localhost:3001/api/service-roles`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				const data = res.data;
				const filledRoles = fillEmptyItems(data.roles, data.perPage);
				const activeRoles = filledRoles.filter(role => role.status); // Filter active roles
				setActiveRolesCount(activeRoles.length); // Update state with active roles count
				setRoleData({ ...data, roles: filledRoles });
			} catch (error) {
				// Handle 401 (Unauthorized) error and other errors
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('authToken'); // Clear invalid token
					navigate('/Login');
				} else {
					console.error('Error fetching service roles:', error);
				}
			}
		};
		fetchServiceRoles();
	}, [authToken]);

	const currentRoles = currentItems(roleData.roles, roleData.currentPage, roleData.perPage);

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />

				<div className="srlist-main" id="dept-service-role-list-test-content">
					<div className="subtitle-role">
						List of Serivce Roles ({activeRolesCount} Active)
						<button className="status-change-button">
							<Link to={`/DeptStatusChangeServiceRole`} state={{ roleData }}>
								Manage Service Role
							</Link>
						</button>
					</div>

					<div className="role-table">
						<table>
							<thead>
								<tr>
									<th>Role</th>
									<th>Department</th>
									<th>Description</th>
									<th>Status</th>
								</tr>
							</thead>

							<tbody>
								{currentRoles.map((role) => {
									if (role.status !== undefined) {
										return (
											<tr key={role.id}>
												<td><Link to={`/DeptRoleInformation?roleid=${role.id}`}>{role.name}</Link></td>
													<td>{role.department}</td>
													<td>{role.description}</td>
													<td>{role.status ? 'Active' : 'Inactive'}</td>
												</tr>
											);
										} else {
											return (
												<tr key={role.id}>
													<td><Link to={`/DeptRoleInformation?roleid=${role.id}`}>{role.name}</Link></td>
													<td>{role.department}</td>
													<td>{role.description}</td>
													<td></td>
											</tr>
											);
										}
								})}
							</tbody>
						</table>

						<tfoot>
							<ReactPaginate
								previousLabel={'<'}
								nextLabel={'>'}
								breakLabel={'...'}
								pageCount={pageCount(roleData.rolesCount, roleData.perPage)}
								marginPagesDisplayed={3}
								pageRangeDisplayed={0}
								onPageChange={(data) => handlePageClick(data, setRoleData)}
								containerClassName={'pagination'}
								activeClassName={'active'}
							/>
						</tfoot>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ServiceRoleList;
