import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess, fetchWithAuth, filterItems } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptMemberList.css';

// custom hook for fetching member list
function useAdminMemberList() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const [memberData, setMemberData] = useState({
		members: [{}],
		membersCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [search, setSearch] = useState(''); // state for search
	const [activeMembersCount, setActiveMembersCount] = useState(0); // state for active members count, default to 0

	useEffect(() => {
		const fetchData = async () => {
			try {
				checkAccess(accountLogInType, navigate, 'admin', authToken); // check access with accountLogInType and authToken
				const data = await fetchWithAuth(`http://localhost:3001/api/allInstructors`, authToken, navigate);
				const filledMembers = fillEmptyItems(data.members, data.perPage); // fill empty rows for table format
				const activeCount = filledMembers.filter((member) => member.status).length; // check status of active members 
				setActiveMembersCount(activeCount); // set activeMembersCount that are filtered with status is true
				setMemberData({
					members: filledMembers,
					membersCount: data.membersCount,
					perPage: data.perPage,
					currentPage: 1,
				});
			} catch (error) {
					console.error('Error fetching members: ', error);
			}
		};

		fetchData();
	}, [authToken, accountLogInType, search]);

	// filter member by search function and set all results into filtered members and to current members for final render
	const filteredMembers = filterItems(memberData.members, 'member', search);
	const currentMembers = currentItems(filteredMembers, memberData.currentPage, memberData.perPage);

	return {
		memberData,
		setMemberData,
		setSearch,
		activeMembersCount,
		currentMembers
	};
}

// main component for rendering member list data
function AdminMemberList() {
	const {
		memberData,
		setMemberData,
		setSearch,
		activeMembersCount,
		currentMembers
} = useAdminMemberList(); // use custom hook to fetch and receive
	
	return (
		<div className="dashboard" id="admin-member-list-test-content">
			<SideBar sideBarType="Admin" />
			<div className="container">
				<TopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setMemberData);}} />

				<div className="member-list-main" id="dept-member-list-test-content">
					<div className="subtitle-member">List of Members ({activeMembersCount} Active)
					<button className='status-change-button'><Link to={`/AdminStatusChangeMember`} state={{ memberData }}>Manage Member</Link></button>
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
													member.serviceRole.map((serviceRole, idx) => (
														<React.Fragment key={idx}>
															{serviceRole}
															{idx < member.serviceRole.length - 1 && (
																<>
																	<br />
																	<br />
																</>
															)}
														</React.Fragment>
													))
												) : (
													<>{member.serviceRole}</>
												)
											) : (
												''
											)}
										</td>
										<td>
											{member.status !== undefined ? (member.status ? 'Active' : 'Inactive') : ''}
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

export default AdminMemberList;
