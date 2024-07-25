import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess, filterItems, toggleStatus } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';

function DeptStatusChangeCourse() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [deptCourseList, setDeptCourseList] = useState(
		location.state.deptCourseList || { courses: [], coursesCount: 0, perPage: 10, currentPage: 1 }
	);
  const [search, setSearch] = useState('');


	useEffect(() => {
		checkAccess(accountLogInType, navigate, 'department', authToken);
		if (location.state.deptCourseList) {
				const filledCourses = fillEmptyItems(
				location.state.deptCourseList.courses,
				location.state.deptCourseList.perPage
			);
			setDeptCourseList({ ...location.state.deptCourseList, courses: filledCourses, currentPage: 1 });
		}
	}, [accountLogInType, navigate, location.state]);

	const handleStatusChange = (course, newStatus) => {
		toggleStatus(authToken, course, newStatus, deptCourseList.courses, setDeptCourseList, 'DeptStatusChangeCourse');
	};

	const filteredCourses = filterItems(deptCourseList.courses, 'course', search);
	const currentCourses = currentItems(filteredCourses, deptCourseList.currentPage, deptCourseList.perPage);

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar searchListType={'DeptCourseList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setDeptCourseList);}} />

				<div className="clist-main" id="course-status-controller-test-content">
					<div className="subtitle-course">List of Courses ({deptCourseList.coursesCount} in Database)
						<button className="status-change-button">
							<Link to={`/DeptCourseList`}>Return</Link>
						</button>
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
												<Link to={`/DeptCourseInformation?courseid=${course.id}`}>{course.courseCode}</Link>
											</td>
											<td>{course.title}</td>
											<td>{course.description}</td>
											<td>
												{course.status !== undefined && (
													<>
														<button
															className={`${
																course.status ? 'active-button' : 'default-button'
															} button`}
															onClick={() => handleStatusChange(course, true)} disabled={course.status}>
															Active
														</button>
														<button
															className={`${
																course.status === false ? 'inactive-button' : 'default-button'
															} button`}
															onClick={() => handleStatusChange(course, false)} disabled={!course.status}>
															Inactive
														</button>
													</>
												)}
											</td>										
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

export default DeptStatusChangeCourse;