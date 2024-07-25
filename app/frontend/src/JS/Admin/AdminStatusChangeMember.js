import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess, filterItems} from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';

function AdminStatusChangeMember() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [memberData, setMemberData] = useState(
		location.state.memberData || { members: [], membersCount: 0, perPage: 10, currentPage: 1 }
	);
  const [search, setSearch] = useState('');

	useEffect(() => {
		checkAccess(accountLogInType, navigate, 'admin', authToken); 		
		if (location.state.memberData) {
				const filledMembers = fillEmptyItems(location.state.memberData.members, location.state.memberData.perPage);
				setMemberData({ ...location.state.memberData, members: filledMembers, currentPage: 1 });
		}
	}, [accountLogInType, navigate, location.state.memberData]);
	

	const toggleStatus = async (member, newStatus) => {
		const updatedMember = { ...member, status: newStatus };
		const updatedMembers = memberData.members.map((m) => (m.ubcid === member.ubcid ? updatedMember : m));
		try {
			const response = await axios.post(
				`http://localhost:3001/api/adminStatusChangeMembers`, 
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
					const filledMembers = fillEmptyItems(updatedMembers, memberData.perPage);
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

	const filteredMembers = filterItems(memberData.members, 'member', search);
  const currentMembers = currentItems(filteredMembers, memberData.currentPage, memberData.perPage);

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Admin" />
			<div className="container">
				<CreateTopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => { setSearch(newSearch); handleSearchChange(setMemberData); }} />

				<div className="srlist-main" id="admin-status-controller-test-content">
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
								{currentMembers.map((member, index) => (
									<tr key={index}>
										<td>
											<Link to={`/AdminProfilePage?ubcid=${member.ubcid}`}>{member.name}</Link>
										</td>
										<td>{member.ubcid}</td>
										<td>
											{member.serviceRole ? (
												Array.isArray(member.serviceRole) ? (
													member.serviceRole.map((serviceRole, index) => (
														<React.Fragment key={index}>
															<Link to={`/AdminRoleInformation?roleid=${member.roleid[index]}`}>
																{serviceRole}
															</Link>
															{index < member.serviceRole.length - 1 && <><br /><br /></>}
														</React.Fragment>
													))
												) : (
													<Link to={`/AdminRoleInformation?roleid=${member.roleid}`}>
														{member.serviceRole}
													</Link>
												)
											) : ('')}
										</td>
										<td>
											{member.status !== undefined && (
												<>
													<button
														className={`${member.status ? 'active-button' : 'default-button'} button`}
														onClick={() => toggleStatus(member, true)}
														disabled={member.status}>
														Active
													</button>
													<button
														className={`${!member.status ? 'inactive-button' : 'default-button'} button`}
														onClick={() => toggleStatus(member, false)}
														disabled={!member.status}>
														Inactive
													</button>
												</>
											)}
										</td>
									</tr>
								))}
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