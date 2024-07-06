import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { CreateSidebarDept, CreateTopBar } from '../common/commonImports.js';
import '../../CSS/Department/ServiceRoleList.css';
import { Link, useNavigate } from 'react-router-dom';
import '../common/divisions.js';
import axios from 'axios';
import '../common/AuthContext.js';
import { useAuth } from '../common/AuthContext.js';

function DeptMemberList() {
	const { authToken, accountType } = useAuth();
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
				const numericAccountType = Number(accountType);
				if (numericAccountType !== 1 && numericAccountType !== 2) {
					alert('No Access, Redirecting to instructor view');
					navigate('/Dashboard');
				}
				const res = await axios.get(`http://localhost:3000/memberList.json`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				const filledMembers = fillEmptyMembers(res.data.members, res.data.perPage);
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

	const fillEmptyMembers = (members, perPage) => {
		const filledMembers = [...members];
		const currentCount = members.length;
		const fillCount = perPage - (currentCount % perPage);
		if (fillCount < perPage) {
			for (let i = 0; i < fillCount; i++) {
				filledMembers.push({});
			}
		}
		return filledMembers;
	};

	const filteredMembers = memberData.members.filter(
		(member) =>
			(member.ubcid?.toString().toLowerCase() ?? '').includes(search.toLowerCase()) ||
			(member.name?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
			(Array.isArray(member.serviceRole)
				? member.serviceRole.some((role) => role.toLowerCase().includes(search.toLowerCase()))
				: (member.serviceRole?.toLowerCase() ?? '').includes(search.toLowerCase()))
	);

	const currentMembers = filteredMembers.slice(
		(memberData.currentPage - 1) * memberData.perPage,
		memberData.currentPage * memberData.perPage
	);

	const handleSearchChange = (newSearch) => {
		setSearch(newSearch);
		setMemberData((prevState) => ({ ...prevState, currentPage: 1 }));
	};

	const handlePageClick = (data) => {
		setMemberData((prevState) => ({
			...prevState,
			currentPage: data.selected + 1,
		}));
	};

	const pageCount = Math.ceil(memberData.membersCount / memberData.perPage);

	return (
		<div className="dashboard">
			<CreateSidebarDept />
			<div className="container">
				<CreateTopBar searchListType={'DeptMemberList'} onSearch={handleSearchChange} />

				<div className="member-list-main" id="dept-member-list-test-content">
					<div className="subtitle-role">List of Member ({memberData.membersCount} Active)</div>

					<div className="role-table">
						<table>
							<thead>
								<tr>
									<th>UBC ID</th>
									<th>Name</th>
									<th>Service Role</th>
								</tr>
							</thead>

							<tbody>
								{currentMembers.map((member) => {
									return (
										<tr key={member.ubcid}>
											<td>{member.ubcid}</td>
											<td>
												<Link to={`/DeptProfilePage?ubcid=${member.ubcid}`}>{member.name}</Link>
											</td>
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
								pageCount={pageCount}
								marginPagesDisplayed={3}
								pageRangeDisplayed={0}
								onPageChange={handlePageClick}
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
