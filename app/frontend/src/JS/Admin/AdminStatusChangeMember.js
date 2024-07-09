import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';

function AdminStatusChangeMember() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [memberData, setMemberData] = useState(
		location.state.memberData || { members: [], rolesCount: 0, perPage: 10, currentPage: 1 }
	);
  const [search, setSearch] = useState('');


	useEffect(() => {
		checkAccess(accountLogInType, navigate, 'department');
		if (location.state.memberData) {
			const filledMembers = fillEmptyItems(
				location.state.memberData.members,
				location.state.memberData.perPage
			);
			setMemberData({ ...location.state.memberData, members: filledMembers, currentPage: 1 });
		}
	}, [location.state]);

	const toggleStatus = async (member, newStatus) => {
		const updatedMember = { ...member, status: newStatus };
		const updatedMembers = memberData.members.map((m) => (m.id === m.ubcid ? updatedMember : m));
		console.log("request\n",  { member: member.ubcid, newStatus })
		try {
			const response = await axios.post(///////////////////////////////////////////////////////////////////////////fix this this this this 
				`http://localhost:3001/api/DeptStatusChangeServiceRole`, //// fix this Subaru //////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////// tfiszbfnsdifgubs;GJs":DGjs'ZJgzsmf'gjn zsBjt;zd,fjtgvlzdmljtgm]p[ ]
				{
					memberId: member.ubcid,
					newStatus: newStatus,
				},
				{
					headers: { Authorization: `Bearer ${authToken.token}` },
				}
			);
			if (response.status === 200) {
				setMemberData((prevState) => {
					const filledMembers = fillEmptyItems(updatedMembers, prevState.perPage);
					return {
						...prevState,
						members: filledMembers,
					};
				});
			} else {
				console.error('Error updating member status:', response.statusText);
			}
		} catch (error) {
			console.error('Error updating member status:', error);
		}
	};

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
			<CreateSideBar sideBarType="Admin" />
			<div className="container">
        <CreateTopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setMemberData);}} />

				<div className="srlist-main" id="dept-member-list-test-content">
					<div className="subtitle-member">
						List of Members ({memberData.membersCount} in Database)
						<button className="status-change-button">
							<Link to={`/AdminMemberList`}>Return</Link>
						</button>
					</div>

					<div className="member-table">
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>UBC ID</th>
									<th>Service Role</th>
									<th>Status</th>
								</tr>
							</thead>

							<tbody>
								{currentMembers.map((member) => {
									return (
										<tr key={member.ubcid}>
											<td>
												<Link to={`/DeptRoleInformation?roleid=${member.ubcid}`}>{member.name}</Link>
											</td>
											<td>{member.ubcid}</td>
											<td>{member.serviceRole ? (
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
												)}</td>
											<td>
												{member.status !== undefined && (
													<>
														<button
															className={`${
																member.status ? 'active-button' : 'default-button'
															} button`}
															onClick={() => toggleStatus(member, true)} disabled={member.status}>
															Active
														</button>
														<button
															className={`${
																member.status === false ? 'inactive-button' : 'default-button'
															} button`}
															onClick={() => toggleStatus(member, false)} disabled={!member.status}>
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

export default AdminStatusChangeMember;