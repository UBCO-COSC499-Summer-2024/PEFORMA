import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange } from '../common/utils.js';
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
		// add checkAccess here
		if (location.state.deptCourseList) {
				const filledCourses = fillEmptyItems(
				location.state.deptCourseList.courses,
				location.state.deptCourseList.perPage
			);
			setDeptCourseList({ ...location.state.deptCourseList, courses: filledCourses, currentPage: 1 });
		}
	}, [location.state]);

	const toggleStatus = async (course, newStatus) => {
		const updatedCourse = { ...course, status: newStatus };
		const updatedCourses = deptCourseList.courses.map((c) => (course.id === c.id ? updatedCourse : c));
		console.log("request\n",  { courseid : course.id, newStatus })
		try {
			const response = await axios.post(
				`http://localhost:3001/api/adminStatusChangeMembers`, // URL 수정됨
				{
					courseid: course.id,
					newStatus: newStatus,
				},
				{
					headers: { Authorization: `Bearer ${authToken.token}` },
				}
			);
			if (response.status === 200) {
				setDeptCourseList((prevState) => {
					const filledCourses = fillEmptyItems(updatedCourses, prevState.perPage);
					return {
						...prevState,
						courses: filledCourses,
					};
				});
			} else {
				console.error('Error updating course status:', response.statusText);
			}
		} catch (error) {
			console.error('Error updating course status:', error);
		}
	};

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

				<div className="clist-main">
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
												<Link
													to={`http://localhost:3000/DeptCourseInformation?courseid=${course.id}`}>
													{course.courseCode}
												</Link>
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
															onClick={() => toggleStatus(course, true)} disabled={course.status}>
															Active
														</button>
														<button
															className={`${
																course.status === false ? 'inactive-button' : 'default-button'
															} button`}
															onClick={() => toggleStatus(course, false)} disabled={!course.status}>
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