import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, 
	handlePageClick, 
	pageCount, 
	currentItems,
	handleSearchChange
 } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';

import '../../CSS/Department/DeptCourseList.css';

function DeptCourseList() {

	const { authToken, accountType } = useAuth();
	const navigate = useNavigate();
	const [deptCourseList, setDeptCourseList] = useState({
		courses: [{}],
		coursesCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [search, setSearch] = useState('');


	useEffect(() => {
		const fetchAllCourses = async () => {
			try {
				if (!authToken) {
					// Redirect to login if no token
					navigate('/Login'); // Use your navigation mechanism
					return;
				}
				const numericAccountType = Number(accountType);
				if (numericAccountType !== 1 && numericAccountType !== 2) {
					alert('No Access, Redirecting to instructor view');
					navigate('/InsDashboard');
				}
				// Fetch course data with Axios, adding token to header
				const res = await axios.get(`http://localhost:3001/api/all-courses`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				const data = res.data;
				const filledCourses = fillEmptyItems(data.courses, data.perPage);
				setDeptCourseList({ ...data, courses: filledCourses });
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
		fetchAllCourses();
	}, [authToken]);

	const filteredCourses = deptCourseList.courses.filter(
    (course) =>
        (course.courseCode?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
        (course.title?.toLowerCase() ?? '').includes(search.toLowerCase())
);

	const currentCourses = currentItems(filteredCourses, deptCourseList.currentPage, deptCourseList.perPage);

	return (
		<div className="dashboard" id="dept-course-list-test-content">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
			<CreateTopBar searchListType={'DeptCourseList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setDeptCourseList);}} />
				
				<div className="main">
					<div className="subtitle-course">
						List of Course Lists ({deptCourseList.coursesCount} Active){' '}
					</div>

					<div className="dcourse-table">
						<table>
							<thead>
								<tr>
									<th>Course</th>
									<th>Title</th>
									<th>Description</th>
								</tr>
							</thead>

							<tbody>
								{currentCourses.map((course) => {
									return (
										<tr key={course.id}>
											<td>
												<Link
													to={`http://localhost:3000/DeptCourseInformation?courseid=${course.id}`}>
													{course.courseCode}
												</Link>
											</td>
											<td>{course.title}</td>
											<td>{course.description}</td>
										</tr>
									);
								})}
							</tbody>

							<tfoot>
								<ReactPaginate
									previousLabel={'<'}
									nextLabel={'>'}
									breakLabel={'...'}
									pageCount={pageCount(deptCourseList.coursesCount, deptCourseList.perPage)}
									marginPagesDisplayed={3}
									pageRangeDisplayed={0}
									onPageChange={(data) => handlePageClick(data, setDeptCourseList)}
									containerClassName={'pagination'}
									activeClassName={'active'}
									forcePage={deptCourseList.currentPage - 1}
								/>
							</tfoot>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeptCourseList;
