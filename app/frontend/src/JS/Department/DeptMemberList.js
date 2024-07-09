import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptMemberList.css';


function DeptMemberList() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const [memberData, setMemberData] = useState({
		members: [{}],
		membersCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [search, setSearch] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!authToken) {
					// Redirect to login if no token
					navigate('/Login'); // Use your navigation mechanism
					return;
				}
				checkAccess(accountLogInType, navigate, 'department');
				const res = await axios.get(`http://localhost:3001/api/allInstructors`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				const filledMembers = fillEmptyItems(res.data.members, res.data.perPage);
				setMemberData({ ...res.data, members: filledMembers });
			} catch (error) {
				// Handle 401 (Unauthorized) error and other errors
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('authToken'); // Clear invalid token
					navigate('/Login');
				} else {
					console.error('Error fetching members:', error);
				}
			}
		};

		fetchData();
	}, [authToken]);

	const filteredMembers = memberData.members.filter(
		(member) =>
			(member.ubcid?.toString().toLowerCase() ?? '').includes(search.toLowerCase()) ||
			(member.name?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
			(Array.isArray(member.serviceRole)
				? member.serviceRole.some((role) => role.toLowerCase().includes(search.toLowerCase()))
				: (member.serviceRole?.toLowerCase() ?? '').includes(search.toLowerCase()))
	);

	const currentMembers = currentItems(filteredMembers, memberData.currentPage, memberData.perPage);

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setMemberData);}} />

				<div className="member-list-main" id="dept-member-list-test-content">
					<div className="subtitle-member">List of Members ({memberData.membersCount} Active)
					</div>


					<div className="member-table">
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>UBC ID</th>
									<th>Service Role</th>
									<th>Department</th>
									<th>Email</th>
								</tr>
							</thead>

							<tbody>
								{currentMembers.map((member) => {
									return (
										<tr key={member.ubcid}>
											<td>
												<Link to={`/DeptProfilePage?ubcid=${member.ubcid}`}>{member.name}</Link>
											</td>
											<td>{member.ubcid}</td>
											<td>
												{member.serviceRole ? (
													Array.isArray(member.serviceRole) ? (
														member.serviceRole.map((serviceRole, index) => (
															<React.Fragment key={member.ubcid[index]}>
																<Link to={`/DeptRoleInformation?roleid=${member.roleid[index]}`}>
																	{serviceRole}
																</Link>
																{index < member.serviceRole.length - 1 ? (
																	<>
																		<br />
																		<br />
																	</>
																) : null}
															</React.Fragment>
														))
													) : (
														<Link to={`/DeptRoleInformation?ubcid=${member.roleid}`}>
															{member.roleid}
														</Link>
													)
												) : (
													''
												)}
											</td>
											<td>{member.department}</td>
											<td>{member.email}</td>
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
								pageCount={pageCount(memberData.membersCount, memberData.perPage)}
								marginPagesDisplayed={3}
								pageRangeDisplayed={0}
								onPageChange={(data) => handlePageClick(data, setMemberData)}
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

export default DeptMemberList;
