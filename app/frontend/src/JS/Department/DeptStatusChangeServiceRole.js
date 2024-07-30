import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, checkAccess, toggleStatus } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';

// handler function when service role status change, update data
function handleStatusChange(authToken, role, newStatus, roleData, setRoleData) {
	toggleStatus(authToken, role, newStatus, roleData, setRoleData, 'DeptStatusChangeServiceRole');
};

function DeptStatusChangeServiceRole() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const location = useLocation(); // access current navigation location
	const [roleData, setRoleData] = useState(
		location.state.roleData || { roles: [], rolesCount: 0, perPage: 10, currentPage: 1 }
	); // state management for service role list

	// fetch data when accountLogInType, location.state, authToken changes
	useEffect(() => {
		checkAccess(accountLogInType, navigate, 'department', authToken)
		if (location.state.roleData) {
				const filledRoles = fillEmptyItems(
				location.state.roleData.roles,
				location.state.roleData.perPage
			); // fill empty rows for table format
			setRoleData({ ...location.state.roleData, roles: filledRoles, currentPage: 1 });
		}
	}, [accountLogInType, navigate, location.state, authToken]);

	// set current Roles
	const currentRoles = currentItems(roleData.roles, roleData.currentPage, roleData.perPage);

	return (
		<div className="dashboard">
			<SideBar sideBarType="Department" />
			<div className="container">
				<TopBar />

				<div className="srlist-main" id="role-status-change-test-content">
					<div className="subtitle-role">
						List of Serivce Roles ({roleData.rolesCount} in Database)
						<button className="status-change-button">
							<Link to={`/DeptServiceRoleList`}>Return</Link>
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
									return (
										<tr key={role.id}>
											<td>
												<Link to={`/DeptRoleInformation?roleid=${role.id}`}>{role.name}</Link>
											</td>
											<td>{role.department}</td>
											<td>{role.description}</td>
											<td>
												{role.status !== undefined && (
													<>
														<button
															className={`${
																role.status ? 'active-button' : 'default-button'
															} button`}
															onClick={() => handleStatusChange(authToken, role, true, roleData.roles, setRoleData)} 
															disabled={role.status}>
															Active
														</button>
														<button
															className={`${
																role.status === false ? 'inactive-button' : 'default-button'
															} button`}
															onClick={() => handleStatusChange(authToken, role, false, roleData.roles, setRoleData)} 
															disabled={!role.status}>
															Inactive
														</button>
													</>
												)}
											</td>
										</tr>
									);
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

export default DeptStatusChangeServiceRole;
