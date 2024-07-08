import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';

function DeptStatusChangeServiceRole() {
	const authToken = useAuth();
	const location = useLocation();
	const [roleData, setRoleData] = useState(
		location.state.roleData || { roles: [], rolesCount: 0, perPage: 10, currentPage: 1 }
	);

	useEffect(() => {
		if (location.state.roleData) {
			const filledRoles = fillEmptyItems(
				location.state.roleData.roles,
				location.state.roleData.perPage
			);
			setRoleData({ ...location.state.roleData, roles: filledRoles, currentPage: 1 });
		}
	}, [location.state]);

	const currentRoles = currentItems(roleData.roles, roleData.currentPage, roleData.perPage);

	const toggleStatus = async (role, newStatus) => {
		const updatedRole = { ...role, status: newStatus };
		const updatedRoles = roleData.roles.map((r) => (r.id === role.id ? updatedRole : r));

		try {
			const response = await axios.post(
				`http://localhost:3001/api/DeptStatusChangeServiceRole`,
				{
					roleId: role.id,
					newStatus: newStatus,
				},
				{
					headers: { Authorization: `Bearer ${authToken.token}` },
				}
			);
			if (response.status === 200) {
				setRoleData({ ...roleData, roles: updatedRoles });
			} else {
				console.error('Error updating role status:', response.statusText);
			}
		} catch (error) {
			console.error('Error updating role status:', error);
		}
	};

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />

				<div className="srlist-main" id="dept-service-role-list-test-content">
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
															onClick={() => toggleStatus(role, true)}>
															Active
														</button>
														<button
															className={`${
																role.status === false ? 'inactive-button' : 'default-button'
															} button`}
															onClick={() => toggleStatus(role, false)}>
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
