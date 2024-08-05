import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess, filterItems, toggleStatus} from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';

// handler function when member status change, update data
function handleStatusChange(authToken, member, newStatus, memberData, setMemberData) {
  toggleStatus(authToken, member, newStatus, memberData, setMemberData, 'adminStatusChangeMembers');
};

function AdminStatusChangeMember() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [memberData, setMemberData] = useState(
		location.state.memberData || { members: [], membersCount: 0, perPage: 10, currentPage: 1 }
	);
  const [search, setSearch] = useState('');

	useEffect(() => {
		checkAccess(accountLogInType, navigate, 'admin', authToken); // check access with accountLogInType and authToken if valid
		if (location.state.memberData) {
				const filledMembers = fillEmptyItems(location.state.memberData.members, location.state.memberData.perPage); // fill empty rows
				setMemberData({ ...location.state.memberData, members: filledMembers, currentPage: 1 }); // set member data with filled rows member list
		} // state management for member list 
	}, [accountLogInType, navigate, location.state.memberData]);

	// filter member by search function and set all results into filteredMembers and to currentMembers for render
	const filteredMembers = filterItems(memberData.members, 'member', search);
  const currentMembers = currentItems(filteredMembers, memberData.currentPage, memberData.perPage);

	return (
		<div className="dashboard">
			<SideBar sideBarType="Admin" />
			<div className="container">
				<TopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => { setSearch(newSearch); handleSearchChange(setMemberData); }} />

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
										<td>{member.name}</td>
										<td>{member.ubcid}</td>
										<td>
											{member.serviceRole ? (
												Array.isArray(member.serviceRole) ? (
													member.serviceRole.map((serviceRole, index) => (
														<React.Fragment key={index}>
															{serviceRole}
															{index < member.serviceRole.length - 1 && <><br /><br /></>}
														</React.Fragment>
													))
												) : (
													member.serviceRole
												)
											) : ('')}
										</td>
										<td>
											{member.status !== undefined && (
												<>
													<button
														className={`${member.status ? 'active-button' : 'default-button'} button`}
														onClick={() => handleStatusChange(authToken, member, true, memberData.members, setMemberData)}
														disabled={member.status}>
														Active
													</button>
													<button
														className={`${!member.status ? 'inactive-button' : 'default-button'} button`}
														onClick={() => handleStatusChange(authToken, member, false, memberData.members, setMemberData)}
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