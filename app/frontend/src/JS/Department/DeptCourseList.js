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
import '../../CSS/Department/DeptCourseList.css';

function DeptCourseList() {

	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const [deptCourseList, setDeptCourseList] = useState({
		courses: [{}],
		coursesCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [search, setSearch] = useState('');
	const [activeCoursesCount, setActiveCoursesCount] = useState(0);

	useEffect(() => {
		const fetchAllCourses = async () => {
			try {
				checkAccess(accountLogInType, navigate, 'department', authToken);
				// Fetch course data with Axios, adding token to header
				const res = await axios.get(`http://localhost:3001/api/all-courses`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				const filledCourses = fillEmptyItems(res.data.courses, res.data.perPage);
				setActiveCoursesCount(filledCourses.filter(course => course.status).length); 
				setDeptCourseList({ ...res.data, courses: filledCourses });
			} catch (error) {
				// Handle 401 (Unauthorized) error and other errors
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('authToken'); // Clear invalid token
					navigate('/Login');
				} else {
					console.error('Error fetching courses:', error);
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

				<div className="srlist-main">
					<div className="subtitle-course">List of Courses ({activeCoursesCount} Active in current)
					<button className='status-change-button'><Link to={`/DeptStatusChangeCourse`} state={{ deptCourseList }}>Manage Course</Link></button>

					</div>

					<div className="dcourse-table">
						<table>
							<thead>
								<tr>
									<th>Course</th>
									<th>Title</th>
									<th>Description</th>
									<th>Status</th>
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
											<td>{course.status !== undefined ? (course.status ? 'Active' : 'Inactive') : ''}</td>
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
