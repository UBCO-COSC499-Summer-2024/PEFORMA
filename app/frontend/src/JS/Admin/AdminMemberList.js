import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess, fetchWithAuth, filterItems } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptMemberList.css';

function useAdminMemberList() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const [memberData, setMemberData] = useState({
		members: [{}],
		membersCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [search, setSearch] = useState('');
	const [activeMembersCount, setActiveMembersCount] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				checkAccess(accountLogInType, navigate, 'admin', authToken);
				const data = await fetchWithAuth(`http://localhost:3001/api/allInstructors`, authToken);
				const filledMembers = fillEmptyItems(data.members, data.perPage);
				const activeCount = filledMembers.filter((member) => member.status).length;
				setActiveMembersCount(activeCount);
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

	return {
		memberData,
		setMemberData,
		search,
		setSearch,
		activeMembersCount
	};
}

// remove after merging
// function filterMembers(members, search) {
// 	return members.filter((member) =>
// 		(member.ubcid?.toString().toLowerCase().includes(search.toLowerCase()) || false) ||
// 		(member.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
// 		(Array.isArray(member.serviceRole)
// 			? member.serviceRole.some(role => role?.toLowerCase().includes(search.toLowerCase()))
// 			: (member.serviceRole?.toLowerCase().includes(search.toLowerCase()) || false))
// 	);
// }


function AdminMemberList() {
	const {
		memberData,
		setMemberData,
		setSearch,
		activeMembersCount,
		search  
} = useAdminMemberList();
	
// const filteredMembers = filterMembers(memberData.members, search);
const filteredMembers = filterItems(memberData.members, 'member', search);
const currentMembers = currentItems(filteredMembers, memberData.currentPage, memberData.perPage);

	return (
		<div className="dashboard" id="admin-member-list-test-content">
			<CreateSideBar sideBarType="Admin" />
			<div className="container">
				<CreateTopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setMemberData);}} />

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
