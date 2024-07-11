import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, getDivisionName, checkAccess } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptTeachingAssignment.css';

function DeptTeachingAssignmentDetail() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { selectedDivision, courses, professors } = location.state || {};
	const [courseList, setCourseList] = useState({
		courses: [],
		totalCoursesCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [currentDivision, setCurrentDivision] = useState(selectedDivision);

	useEffect(() => {
		checkAccess(accountLogInType, navigate, 'department');
		if (courses && professors) {
			const prefix = currentDivision === 'computer-science' ? 'COSC' : currentDivision.slice(0, 4).toUpperCase();
			const filteredCourses = courses.filter(course => course.courseCode && course.courseCode.startsWith(prefix));

			const filledCourses = fillEmptyItems(filteredCourses, courseList.perPage);

			setCourseList({
				courses: filledCourses,
				totalCoursesCount: filteredCourses.length,
				perPage: 10,
				currentPage: 1,
			});
		}
	}, [currentDivision, courses, professors, courseList.perPage]);

	const currentCourses = currentItems(courseList.courses, courseList.currentPage, courseList.perPage);

	const handleDivisionChange = (event) => {
		setCurrentDivision(event.target.value);
	};

	return (
		<div className="dashboard" id="dept-course-list-test-content">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar searchListType={'DeptCourseList'} />

				<div className="srlist-main">
					<div className="subtitle-course">
						<div className='divison-select-subtitle'>
							List of Courses 
							<select className='detail-division-select' onChange={handleDivisionChange} value={currentDivision}>
								<option value="computer-science">Computer Science</option>
								<option value="mathematics">Mathematics</option>
								<option value="physics">Physics</option>
								<option value="statistics">Statistics</option>
							</select>
						</div>
						<button className='status-change-button'>
							<Link to={`/DeptTeachingAssignment`}>Return</Link>
						</button>
					</div>


					<div className="detail-course-table">
						<table>
							<thead>
								<tr>
									<th>Instructor</th>
									<th>Course Code</th>
									<th>Course Name</th>
									<th>Email</th>
								</tr>
							</thead>

							<tbody>
								{currentCourses.map((course) => (
									<tr key={course.id}>
										<td>{course.instructor}</td>
										<td>{course.courseCode}</td>
										<td>{course.courseName}</td>
										<td>{course.email}</td>
									</tr>
								))}
							</tbody>

							<tfoot>
								<ReactPaginate
									previousLabel={'<'}
									nextLabel={'>'}
									breakLabel={'...'}
									pageCount={pageCount(courseList.totalCoursesCount, courseList.perPage)}
									marginPagesDisplayed={3}
									pageRangeDisplayed={2}
									onPageChange={(data) => handlePageClick(data, setCourseList)}
									containerClassName={'pagination'}
									activeClassName={'active'}
									forcePage={courseList.currentPage - 1}
								/>
							</tfoot>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeptTeachingAssignmentDetail;
